/**
 * Health check endpoint
 * 
 * Why this exists:
 * - Provides a simple endpoint to verify the service is running
 * - Useful for monitoring and debugging
 */

import { api } from 'encore.dev/api';

/**
 * Health check response
 */
interface HealthResponse {
  status: 'ok';
  service: 'portfolio';
  timestamp: string;
}

/**
 * Health check endpoint
 * GET /portfolio/health
 */
export const health = api(
  { expose: true, method: 'GET', path: '/portfolio/health' },
  async (): Promise<HealthResponse> => {
    return {
      status: 'ok',
      service: 'portfolio',
      timestamp: new Date().toISOString()
    };
  }
);

