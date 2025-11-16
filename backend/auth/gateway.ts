/**
 * API Gateway configuration
 * 
 * Why this exists:
 * - Configures Encore's API Gateway with authentication handler
 * - Applies auth middleware to all services
 * - Enables type-safe authentication across the entire API
 */

import { Gateway } from 'encore.dev/api';
import { auth } from './middleware';

/**
 * KiteMate API Gateway
 * 
 * This gateway applies authentication to all endpoints marked with auth: true
 * The auth handler validates JWT tokens and provides user context
 */
export const gateway = new Gateway({
  authHandler: auth
});

