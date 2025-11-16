/**
 * Auth middleware for Encore.ts
 * 
 * Why this exists:
 * - Provides authentication middleware using Encore's authHandler
 * - Validates JWT tokens on protected endpoints
 * - Makes user information available to all authenticated endpoints
 * - Integrates with Encore's type-safe API system
 */

import { authHandler } from 'encore.dev/auth';
import { Header } from 'encore.dev/api';
import { verifyToken, extractTokenFromHeader } from './jwt';

/**
 * Auth parameters - extracted from HTTP headers
 */
interface AuthParams {
  authorization: Header<'Authorization'>;
}

/**
 * Auth data with Encore's required userID field
 */
interface EncoreAuthData {
  userID: string;  // Note: Encore requires 'userID' not 'userId'
  tier: 'free' | 'pro';
}

/**
 * Encore auth handler
 * 
 * This function is called automatically by Encore for all endpoints with auth: true
 * It validates the JWT token and returns user authentication data
 * 
 * @returns AuthData object with userId and tier
 * @throws APIError if authentication fails
 */
export const auth = authHandler<AuthParams, EncoreAuthData>(
  async ({ authorization }): Promise<EncoreAuthData> => {
    // Extract token from "Bearer <token>" format
    const token = extractTokenFromHeader(authorization);

    // Verify and decode JWT
    const payload = await verifyToken(token);

    // Return auth data that will be available in all authenticated endpoints
    // Note: Encore requires 'userID' (capital ID) not 'userId'
    return {
      userID: payload.userId,
      tier: payload.tier
    };
  }
);

