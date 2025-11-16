/**
 * Auth Service API Contract
 * 
 * Handles Zerodha OAuth, JWT sessions, and user authentication.
 */

// ============================================================================
// Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'pro';
  username?: string;
  avatarUrl?: string;
  zerodhaConnected: boolean;
}

// ============================================================================
// Auth Endpoints
// ============================================================================

/**
 * POST /auth/register
 * 
 * Register a new user account.
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  user: User;
  token: string;  // JWT token
}

/**
 * POST /auth/login
 * 
 * Login with email and password.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

/**
 * POST /auth/logout
 * 
 * Logout current session (invalidate JWT).
 */
export interface LogoutRequest {
  // No body, auth via JWT header
}

export interface LogoutResponse {
  success: boolean;
}

/**
 * GET /auth/me
 * 
 * Get current authenticated user profile.
 */
export interface GetMeRequest {
  // No params, auth via JWT header
}

export interface GetMeResponse {
  user: User;
}

// ============================================================================
// Zerodha OAuth Endpoints
// ============================================================================

/**
 * GET /auth/zerodha/initiate
 * 
 * Initiate Zerodha OAuth flow, returns authorization URL.
 */
export interface InitiateZerodhaAuthRequest {
  // No params
}

export interface InitiateZerodhaAuthResponse {
  authUrl: string;  // Redirect user to this URL
  state: string;    // CSRF protection token
}

/**
 * POST /auth/zerodha/callback
 * 
 * Handle Zerodha OAuth callback, exchange request token for access token.
 */
export interface ZerodhaCallbackRequest {
  requestToken: string;  // From Zerodha callback
  state: string;         // Validate CSRF token
}

export interface ZerodhaCallbackResponse {
  success: boolean;
  zerodhaUserId: string;
  connected: boolean;
}

/**
 * POST /auth/zerodha/disconnect
 * 
 * Disconnect Zerodha account from user profile.
 */
export interface DisconnectZerodhaRequest {
  // No body, auth via JWT header
}

export interface DisconnectZerodhaResponse {
  success: boolean;
}

/**
 * GET /auth/zerodha/status
 * 
 * Check Zerodha connection status (token validity).
 */
export interface ZerodhaStatusRequest {
  // No params, auth via JWT header
}

export interface ZerodhaStatusResponse {
  connected: boolean;
  zerodhaUserId?: string;
  tokenExpiresAt?: string;  // ISO 8601
}

// ============================================================================
// Error Responses
// ============================================================================

export interface AuthErrorResponse {
  code: 'invalid_credentials' | 'token_expired' | 'unauthorized' | 'oauth_failed';
  message: string;
  details?: Record<string, any>;
}

