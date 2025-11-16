/**
 * JWT utilities for token generation and validation
 * 
 * Why this exists:
 * - Provides secure JWT token generation and validation using jose library
 * - Manages token expiry and refresh logic
 * - Ensures consistent token format across the application
 * - Uses HS256 algorithm for signing (symmetric key)
 */

import { SignJWT, jwtVerify } from 'jose';
import { env } from '../shared/env';
import type { JWTPayload } from './types';
import type { UserTier } from '../shared/types';
import { unauthenticated } from '../shared/errors';

/**
 * Secret key for JWT signing (converted to Uint8Array)
 */
const getSecretKey = (): Uint8Array => {
  return new TextEncoder().encode(env.JWT_SECRET);
};

/**
 * Parse expiry duration string to seconds
 * Examples: '7d' -> 604800, '24h' -> 86400, '30m' -> 1800
 */
function parseExpiry(expiry: string): number {
  const units: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800
  };

  const match = expiry.match(/^(\d+)([smhdw])$/);
  if (!match) {
    throw new Error(`Invalid expiry format: ${expiry}`);
  }

  const [, value, unit] = match;
  return parseInt(value, 10) * units[unit];
}

/**
 * Generate a JWT token for a user
 * 
 * @param userId - User ID
 * @param email - User email
 * @param tier - User subscription tier
 * @returns JWT token string
 */
export async function generateToken(
  userId: string,
  email: string,
  tier: UserTier
): Promise<string> {
  const expirySeconds = parseExpiry(env.JWT_EXPIRY);
  const now = Math.floor(Date.now() / 1000);

  const token = await new SignJWT({
    userId,
    email,
    tier
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(now + expirySeconds)
    .setIssuer('kitemate')
    .setAudience('kitemate-api')
    .sign(getSecretKey());

  return token;
}

/**
 * Verify and decode a JWT token
 * 
 * @param token - JWT token string
 * @returns Decoded JWT payload
 * @throws APIError if token is invalid or expired
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: 'kitemate',
      audience: 'kitemate-api'
    });

    // Type assertion - jose returns JWTPayload type but we need our custom shape
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      tier: payload.tier as UserTier,
      iat: payload.iat!,
      exp: payload.exp!
    };
  } catch (error) {
    // Token is invalid, expired, or malformed
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        throw unauthenticated('Token has expired. Please login again.');
      }
      if (error.message.includes('signature')) {
        throw unauthenticated('Invalid token signature.');
      }
    }
    throw unauthenticated('Invalid or malformed token.');
  }
}

/**
 * Extract token from Authorization header
 * Supports: "Bearer <token>" format
 * 
 * @param authHeader - Authorization header value
 * @returns Extracted token
 * @throws APIError if header format is invalid
 */
export function extractTokenFromHeader(authHeader: string): string {
  if (!authHeader) {
    throw unauthenticated('Missing Authorization header.');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw unauthenticated('Invalid Authorization header format. Expected: Bearer <token>');
  }

  return parts[1];
}

/**
 * Check if a token is close to expiry (within 24 hours)
 * 
 * @param payload - Decoded JWT payload
 * @returns True if token expires soon
 */
export function isTokenExpiringSoon(payload: JWTPayload): boolean {
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = payload.exp - now;
  const twentyFourHours = 86400;

  return timeUntilExpiry < twentyFourHours;
}

/**
 * Get remaining token lifetime in seconds
 * 
 * @param payload - Decoded JWT payload
 * @returns Remaining seconds until expiry
 */
export function getTokenLifetime(payload: JWTPayload): number {
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
}

