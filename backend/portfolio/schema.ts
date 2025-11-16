/**
 * Portfolio schema and normalization utilities
 * 
 * Why this exists:
 * - Defines the canonical portfolio schema (Constitution Principle II)
 * - Provides validation and normalization utilities
 * - Ensures all connectors produce consistent data format
 * - Validates invariants (e.g., total_value >= 0, unrealizedPnL calculation)
 */

import { z } from 'zod';
import type { NormalizedHolding, Portfolio, PortfolioSource } from '../shared/types';
import { validationError } from '../shared/errors';

/**
 * Zod schema for NormalizedHolding
 * Used for validation during import and API responses
 */
export const NormalizedHoldingSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  isin: z.string().optional(),
  quantity: z.number().positive('Quantity must be positive'),
  avgPrice: z.number().nonnegative('Average price must be non-negative'),
  currentPrice: z.number().nonnegative('Current price must be non-negative'),
  unrealizedPnL: z.number(),
  assetType: z.enum(['equity', 'mutual_fund', 'etf', 'bond']),
  sector: z.string().optional(),
  exchange: z.string().optional(),
  purchaseDate: z.string().optional(),
  lastTradeDate: z.string().optional(),
  _metadata: z.record(z.any()).optional()
});

/**
 * Calculate unrealized P&L for a holding
 * Formula: (currentPrice - avgPrice) * quantity
 */
export function calculateUnrealizedPnL(holding: NormalizedHolding): number {
  return (holding.currentPrice - holding.avgPrice) * holding.quantity;
}

/**
 * Validate a single holding
 * Ensures all invariants are met
 */
export function validateHolding(holding: any): NormalizedHolding {
  // Validate with Zod schema
  const result = NormalizedHoldingSchema.safeParse(holding);
  
  if (!result.success) {
    const firstError = result.error.errors[0];
    throw validationError(
      firstError.path.join('.'),
      firstError.message,
      holding
    );
  }

  const validated = result.data;

  // Verify P&L calculation (invariant)
  const expectedPnL = calculateUnrealizedPnL(validated);
  const actualPnL = validated.unrealizedPnL;
  
  // Allow small floating point differences (within 0.01)
  if (Math.abs(expectedPnL - actualPnL) > 0.01) {
    throw validationError(
      'unrealizedPnL',
      `P&L mismatch: expected ${expectedPnL.toFixed(2)}, got ${actualPnL.toFixed(2)}`,
      validated
    );
  }

  return validated;
}

/**
 * Validate array of holdings
 * Ensures all holdings meet schema requirements
 */
export function validateHoldings(holdings: any[]): NormalizedHolding[] {
  if (!Array.isArray(holdings)) {
    throw validationError('holdings', 'Holdings must be an array', holdings);
  }

  return holdings.map((holding, index) => {
    try {
      return validateHolding(holding);
    } catch (error) {
      throw validationError(
        `holdings[${index}]`,
        error instanceof Error ? error.message : 'Validation failed',
        holding
      );
    }
  });
}

/**
 * Calculate portfolio totals from holdings
 */
export function calculatePortfolioTotals(holdings: NormalizedHolding[]): {
  totalValue: number;
  totalPnL: number;
} {
  let totalValue = 0;
  let totalPnL = 0;

  for (const holding of holdings) {
    totalValue += holding.currentPrice * holding.quantity;
    totalPnL += holding.unrealizedPnL;
  }

  return {
    totalValue: Math.max(0, totalValue), // Enforce non-negative invariant
    totalPnL
  };
}

/**
 * Normalize and validate complete portfolio data
 * This is the final step before persisting to database
 */
export function normalizePortfolio(
  userId: string,
  source: PortfolioSource,
  holdings: any[],
  currency: string = 'INR'
): Omit<Portfolio, 'id' | 'createdAt'> {
  // Validate all holdings
  const validatedHoldings = validateHoldings(holdings);

  // Calculate totals
  const { totalValue, totalPnL } = calculatePortfolioTotals(validatedHoldings);

  return {
    userId,
    source,
    lastSync: new Date(),
    totalValue,
    totalPnL,
    currency,
    holdings: validatedHoldings
  };
}

/**
 * Extract sector allocation from holdings
 * Returns map of sector -> total value
 */
export function getSectorAllocation(holdings: NormalizedHolding[]): Record<string, number> {
  const allocation: Record<string, number> = {};

  for (const holding of holdings) {
    const sector = holding.sector || 'Unknown';
    const value = holding.currentPrice * holding.quantity;
    allocation[sector] = (allocation[sector] || 0) + value;
  }

  return allocation;
}

/**
 * Get top gainers from holdings
 */
export function getTopGainers(holdings: NormalizedHolding[], limit: number = 5): NormalizedHolding[] {
  return [...holdings]
    .sort((a, b) => b.unrealizedPnL - a.unrealizedPnL)
    .slice(0, limit);
}

/**
 * Get top losers from holdings
 */
export function getTopLosers(holdings: NormalizedHolding[], limit: number = 5): NormalizedHolding[] {
  return [...holdings]
    .sort((a, b) => a.unrealizedPnL - b.unrealizedPnL)
    .slice(0, limit);
}

