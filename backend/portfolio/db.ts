/**
 * Portfolio Database Connection
 * 
 * Why this exists:
 * - Provides type-safe database access for portfolio service
 * - Manages PostgreSQL connection with automatic migrations
 * - Follows Encore pattern: one database per service
 */

import { SQLDatabase } from 'encore.dev/storage/sqldb';

/**
 * Portfolio service database
 * Manages: portfolios, users (auth data)
 */
export const DB = new SQLDatabase('portfolio', {
  migrations: './migrations'
});

