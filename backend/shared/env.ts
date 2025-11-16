/**
 * Environment variable validation and type-safe access using envalid
 * 
 * Why this exists:
 * - Ensures all required environment variables are present at startup
 * - Provides type-safe access to environment variables throughout the app
 * - Validates format and constraints (e.g., URLs, email formats)
 * - Prevents runtime errors from missing or invalid configuration
 */

import { cleanEnv, str, url, email, num, bool } from 'envalid';

/**
 * Validated and type-safe environment variables
 * Access via: env.ZERODHA_API_KEY, env.LLM_API_KEY, etc.
 */
export const env = cleanEnv(process.env, {
  // Zerodha Integration
  ZERODHA_API_KEY: str({
    desc: 'Zerodha Kite Connect API Key',
    example: 'your_api_key_here'
  }),
  ZERODHA_API_SECRET: str({
    desc: 'Zerodha Kite Connect API Secret',
    example: 'your_api_secret_here'
  }),

  // LLM Integration (OpenAI)
  LLM_API_KEY: str({
    desc: 'OpenAI API Key for GPT-4o',
    example: 'sk-...'
  }),
  LLM_MODEL: str({
    desc: 'LLM model to use for NL queries',
    default: 'gpt-4o',
    choices: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo']
  }),

  // Payment Integration (Razorpay)
  RAZORPAY_KEY_ID: str({
    desc: 'Razorpay Key ID',
    example: 'rzp_test_...',
    default: ''
  }),
  RAZORPAY_KEY_SECRET: str({
    desc: 'Razorpay Key Secret',
    example: 'your_razorpay_secret',
    default: ''
  }),

  // JWT Configuration
  JWT_SECRET: str({
    desc: 'Secret key for JWT token signing',
    example: 'your_jwt_secret_min_32_chars'
  }),
  JWT_EXPIRY: str({
    desc: 'JWT token expiry duration',
    default: '7d'
  }),

  // Encryption
  ENCRYPTION_KEY: str({
    desc: '32-byte hex string for AES-256 encryption (64 hex chars)',
    example: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  }),

  // Application Configuration
  NODE_ENV: str({
    desc: 'Node environment',
    choices: ['development', 'production', 'test'],
    default: 'development'
  }),
  FRONTEND_URL: url({
    desc: 'Frontend application URL',
    default: 'http://localhost:5173'
  }),

  // Database (Encore manages this, but can be overridden)
  DATABASE_URL: str({
    desc: 'PostgreSQL connection URL (optional, Encore provides default)',
    default: ''
  }),

  // Subscription Tiers
  FREE_TIER_QUERY_LIMIT: num({
    desc: 'Monthly query limit for free tier users',
    default: 50
  }),

  // Feature Flags
  ENABLE_CSV_IMPORT: bool({
    desc: 'Enable CSV import feature',
    default: true
  }),
  ENABLE_SOCIAL_FEATURES: bool({
    desc: 'Enable social features (public profiles, forks, discover)',
    default: true
  })
});

/**
 * Check if running in production
 */
export const isProduction = () => env.NODE_ENV === 'production';

/**
 * Check if running in development
 */
export const isDevelopment = () => env.NODE_ENV === 'development';

/**
 * Check if running in test environment
 */
export const isTest = () => env.NODE_ENV === 'test';

