/**
 * Auth Service Definition
 * 
 * Why this exists:
 * - Defines the authentication and authorization service for KiteMate
 * - Handles Zerodha OAuth flow, JWT token management
 * - Provides auth middleware for protected endpoints
 * - Ensures secure user authentication across all services
 */

import { Service } from 'encore.dev/service';

export default new Service('auth');

