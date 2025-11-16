/**
 * Health check endpoint
 * 
 * Why this exists:
 * - Provides a simple endpoint to verify the service is running
 * - Useful for monitoring and debugging
 * - Allows Encore to start the app (requires at least one endpoint)
 */

import { api } from 'encore.dev/api';

/**
 * Health check response
 */
interface HealthResponse {
  status: 'ok';
  service: 'auth';
  timestamp: string;
}

/**
 * Health check endpoint
 * GET /auth/health
 */
export const health = api(
  { expose: true, method: 'GET', path: '/auth/health' },
  async (): Promise<HealthResponse> => {
    return {
      status: 'ok',
      service: 'auth',
      timestamp: new Date().toISOString()
    };
  }
);

