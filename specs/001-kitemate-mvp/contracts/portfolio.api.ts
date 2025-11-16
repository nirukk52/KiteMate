/**
 * Portfolio Service API Contract
 * 
 * Handles portfolio data sync, CSV import, and portfolio queries.
 */

// ============================================================================
// Types
// ============================================================================

export interface NormalizedHolding {
  symbol: string;
  isin?: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  assetType: 'equity' | 'mutual_fund' | 'etf' | 'bond';
  sector?: string;
  exchange?: string;
  purchaseDate?: string;  // ISO 8601
  lastTradeDate?: string;
}

export interface Portfolio {
  userId: string;
  source: 'zerodha' | 'csv';
  lastSync: string;  // ISO 8601
  totalValue: number;
  totalPnL: number;
  currency: string;
  holdings: NormalizedHolding[];
}

// ============================================================================
// Portfolio Endpoints
// ============================================================================

/**
 * GET /portfolio/:userId
 * 
 * Get user's portfolio (requires auth, can only access own portfolio).
 */
export interface GetPortfolioRequest {
  userId: string;  // Path param
}

export interface GetPortfolioResponse {
  portfolio: Portfolio;
}

/**
 * POST /portfolio/sync
 * 
 * Trigger manual portfolio sync from Zerodha (requires Zerodha connection).
 */
export interface SyncPortfolioRequest {
  // No body, auth via JWT header
}

export interface SyncPortfolioResponse {
  success: boolean;
  portfolio: Portfolio;
  syncedAt: string;  // ISO 8601
}

/**
 * POST /portfolio/import-csv
 * 
 * Import portfolio data from CSV file.
 */
export interface ImportCSVRequest {
  file: File | string;  // CSV file (multipart) or base64 string
  mergeStrategy: 'replace' | 'merge';  // How to handle existing data
}

export interface ImportCSVResponse {
  success: boolean;
  imported: number;  // Number of holdings imported
  errors?: Array<{
    row: number;
    message: string;
  }>;
  portfolio: Portfolio;
}

/**
 * GET /portfolio/holdings
 * 
 * Get detailed holdings with filters.
 */
export interface GetHoldingsRequest {
  userId: string;
  filters?: {
    symbol?: string[];
    sector?: string[];
    assetType?: string[];
    minValue?: number;
    maxValue?: number;
  };
  sortBy?: 'symbol' | 'value' | 'pnl' | 'quantity';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface GetHoldingsResponse {
  holdings: NormalizedHolding[];
  total: number;
  page: {
    limit: number;
    offset: number;
  };
}

/**
 * GET /portfolio/summary
 * 
 * Get portfolio summary statistics.
 */
export interface GetPortfolioSummaryRequest {
  userId: string;
  timeRange?: {
    from: string;  // ISO 8601
    to: string;
  };
}

export interface GetPortfolioSummaryResponse {
  totalValue: number;
  totalPnL: number;
  dayChange: number;
  dayChangePercent: number;
  allocation: {
    sector: Array<{ name: string; percentage: number; value: number }>;
    assetType: Array<{ name: string; percentage: number; value: number }>;
  };
  topGainers: Array<{ symbol: string; pnl: number; pnlPercent: number }>;
  topLosers: Array<{ symbol: string; pnl: number; pnlPercent: number }>;
}

// ============================================================================
// CSV Template
// ============================================================================

/**
 * GET /portfolio/csv-template
 * 
 * Download CSV template for imports.
 */
export interface GetCSVTemplateRequest {
  // No params
}

export interface GetCSVTemplateResponse {
  template: string;  // CSV content with headers and sample row
  headers: string[];
}

// ============================================================================
// Error Responses
// ============================================================================

export interface PortfolioErrorResponse {
  code: 'not_found' | 'zerodha_not_connected' | 'sync_failed' | 'csv_invalid';
  message: string;
  details?: Record<string, any>;
}

