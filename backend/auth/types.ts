/**
 * Auth-specific types
 * 
 * Why this exists:
 * - Defines types specific to authentication service
 * - Separates auth domain types from shared types
 */

import type { UserTier } from '../shared/types';

/**
 * JWT payload structure
 */
export interface JWTPayload {
  userId: string;
  email: string;
  tier: UserTier;
  iat: number;  // Issued at
  exp: number;  // Expiry
}

/**
 * Zerodha OAuth token response
 */
export interface ZerodhaTokenResponse {
  accessToken: string;
  userId: string;
  loginTime: string;
  publicToken?: string;
  refreshToken?: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    tier: UserTier;
  };
}

