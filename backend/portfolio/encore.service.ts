/**
 * Portfolio Service Definition
 * 
 * Why this exists:
 * - Manages portfolio data for all users
 * - Handles Zerodha API synchronization and CSV imports
 * - Normalizes data from multiple sources into canonical schema
 * - Provides portfolio query and summary APIs
 */

import { Service } from 'encore.dev/service';

export default new Service('portfolio');

