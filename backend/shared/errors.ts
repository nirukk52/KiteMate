/**
 * Encore API error handling utilities
 * 
 * Why this exists:
 * - Provides consistent error responses across all services
 * - Uses Encore's structured error system for proper HTTP status codes
 * - Enables type-safe error handling in frontend
 * - Improves debugging with detailed error context
 */

import { APIError, ErrCode } from 'encore.dev/api';

/**
 * Create a not found error (404)
 * @param message - Error message
 * @param details - Additional context
 */
export function notFound(message: string, details?: Record<string, any>): APIError {
  const error = new APIError(ErrCode.NotFound, message);
  if (details) {
    console.log('Not found details:', details);
  }
  return error;
}

/**
 * Create an invalid argument error (400)
 * @param message - Error message
 * @param details - Additional context (e.g., validation errors)
 */
export function invalidArgument(message: string, details?: Record<string, any>): APIError {
  const error = new APIError(ErrCode.InvalidArgument, message);
  if (details) {
    console.log('Invalid argument details:', details);
  }
  return error;
}

/**
 * Create an unauthenticated error (401)
 * @param message - Error message
 */
export function unauthenticated(message: string = 'Please login to continue'): APIError {
  return new APIError(ErrCode.Unauthenticated, message);
}

/**
 * Create a permission denied error (403)
 * @param message - Error message
 * @param details - Additional context
 */
export function permissionDenied(message: string, details?: Record<string, any>): APIError {
  const error = new APIError(ErrCode.PermissionDenied, message);
  if (details) {
    console.log('Permission denied details:', details);
  }
  return error;
}

/**
 * Create a resource exhausted error (429) - for rate limiting
 * @param message - Error message
 * @param details - Additional context (e.g., limit, reset time)
 */
export function resourceExhausted(message: string, details?: Record<string, any>): APIError {
  const error = new APIError(ErrCode.ResourceExhausted, message);
  if (details) {
    console.log('Resource exhausted details:', details);
  }
  return error;
}

/**
 * Create an already exists error (409)
 * @param resource - Resource type
 * @param identifier - Resource identifier
 */
export function alreadyExists(resource: string, identifier: string): APIError {
  const message = `${resource} with identifier '${identifier}' already exists`;
  console.log('Already exists:', { resource, identifier });
  return new APIError(ErrCode.AlreadyExists, message);
}

/**
 * Create an internal server error (500)
 * @param message - Error message (should not expose internal details)
 * @param internalDetails - Internal context for logging (not sent to client)
 */
export function internal(message: string = 'An internal error occurred', internalDetails?: any): APIError {
  // Log internal details for debugging
  if (internalDetails) {
    console.error('Internal error details:', internalDetails);
  }
  
  // Return generic message to client (don't expose internals)
  return new APIError(ErrCode.Internal, message);
}

/**
 * Create a service unavailable error (503)
 * @param service - Service name that is unavailable
 * @param message - Error message
 */
export function unavailable(service: string, message?: string): APIError {
  const msg = message || `${service} is temporarily unavailable`;
  console.log('Service unavailable:', { service });
  return new APIError(ErrCode.Unavailable, msg);
}

/**
 * Wrap an unknown error into a structured API error
 * @param error - Unknown error object
 * @param context - Additional context for debugging
 */
export function wrapError(error: unknown, context?: string): APIError {
  // If already an APIError, return as is
  if (error instanceof APIError) {
    return error;
  }

  // Extract message from Error objects
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  
  // Log the original error for debugging
  console.error('Wrapped error:', {
    context,
    originalError: error,
    stack: error instanceof Error ? error.stack : undefined
  });

  // Return generic internal error
  return internal(message);
}

/**
 * Validation error helper
 * @param field - Field name that failed validation
 * @param message - Validation error message
 * @param value - The invalid value (optional, for debugging)
 */
export function validationError(
  field: string,
  message: string,
  value?: any
): APIError {
  return invalidArgument(`Validation failed for '${field}': ${message}`, {
    field,
    value: value !== undefined ? String(value) : undefined
  });
}

/**
 * Multiple validation errors
 * @param errors - Array of validation errors
 */
export function validationErrors(
  errors: Array<{ field: string; message: string }>
): APIError {
  return invalidArgument('Validation failed', {
    errors
  });
}

/**
 * Zerodha API error helper
 * @param error - Error from Zerodha API
 */
export function zerodhaError(error: any): APIError {
  const message = error?.message || 'Zerodha API error';
  const statusCode = error?.status || 500;

  // Map Zerodha HTTP status codes to Encore error codes
  if (statusCode === 401 || statusCode === 403) {
    return unauthenticated('Zerodha authentication failed. Please reconnect your account.');
  }
  
  if (statusCode === 429) {
    return resourceExhausted('Zerodha API rate limit exceeded. Please try again later.');
  }

  if (statusCode >= 500) {
    return unavailable('Zerodha', 'Zerodha service is temporarily unavailable');
  }

  return internal('Failed to fetch data from Zerodha', { originalError: error });
}

/**
 * LLM API error helper
 * @param error - Error from LLM API (OpenAI, etc.)
 */
export function llmError(error: any): APIError {
  const message = error?.message || 'LLM API error';
  
  // Check for common LLM API errors
  if (message.includes('rate limit') || message.includes('quota')) {
    return resourceExhausted('AI service rate limit reached. Please try again later.');
  }

  if (message.includes('timeout')) {
    return unavailable('AI service', 'AI service request timed out');
  }

  return internal('Failed to process query with AI', { originalError: error });
}

/**
 * Payment provider error helper
 * @param provider - Payment provider name ('razorpay', 'stripe')
 * @param error - Error from payment provider
 */
export function paymentError(provider: string, error: any): APIError {
  const message = error?.message || 'Payment processing error';
  
  return internal(`Payment processing failed (${provider})`, {
    provider,
    originalError: error
  });
}

