/**
 * Subscriptions Service API Contract
 * 
 * Handles payment processing, Pro tier management, and query limits.
 */

// ============================================================================
// Types
// ============================================================================

export interface Subscription {
  userId: string;
  tier: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'past_due';
  paymentProvider?: 'razorpay' | 'stripe';
  billingCycle?: 'monthly' | 'annual';
  amountCents?: number;
  currency: string;
  currentPeriodStart?: string;  // ISO 8601
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
}

export interface QueryUsage {
  used: number;
  limit: number | null;  // null for Pro (unlimited)
  remaining: number | null;
  resetDate: string;  // ISO 8601
}

export interface PricingPlan {
  tier: 'free' | 'pro';
  name: string;
  price: {
    monthly: number;
    annual: number;
    currency: string;
  };
  features: {
    queries: string;  // "50/month" or "Unlimited"
    advancedQueries: boolean;
    widgets: string;  // "Unlimited"
    csvImport: boolean;
    publicProfile: boolean;
    prioritySupport: boolean;
  };
}

// ============================================================================
// Subscription Management Endpoints
// ============================================================================

/**
 * GET /subscriptions/plans
 * 
 * Get available pricing plans (no auth required).
 */
export interface GetPricingPlansRequest {
  // No params
}

export interface GetPricingPlansResponse {
  plans: PricingPlan[];
}

/**
 * GET /subscriptions/current
 * 
 * Get current subscription details.
 */
export interface GetCurrentSubscriptionRequest {
  // No params, auth via JWT header
}

export interface GetCurrentSubscriptionResponse {
  subscription: Subscription;
  queryUsage: QueryUsage;
}

/**
 * POST /subscriptions/upgrade
 * 
 * Initiate Pro subscription upgrade.
 */
export interface UpgradeSubscriptionRequest {
  billingCycle: 'monthly' | 'annual';
  paymentProvider?: 'razorpay' | 'stripe';
}

export interface UpgradeSubscriptionResponse {
  checkoutUrl: string;  // Redirect to payment gateway
  sessionId: string;
}

/**
 * POST /subscriptions/cancel
 * 
 * Cancel Pro subscription (effective at period end).
 */
export interface CancelSubscriptionRequest {
  reason?: string;
  feedback?: string;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  cancelAtPeriodEnd: boolean;
  periodEnd: string;  // ISO 8601
}

/**
 * POST /subscriptions/reactivate
 * 
 * Reactivate a cancelled subscription before period end.
 */
export interface ReactivateSubscriptionRequest {
  // No body, auth via JWT header
}

export interface ReactivateSubscriptionResponse {
  success: boolean;
  subscription: Subscription;
}

// ============================================================================
// Payment Webhook Endpoints
// ============================================================================

/**
 * POST /subscriptions/webhooks/razorpay
 * 
 * Handle Razorpay webhook events (payment success, failure, cancellation).
 */
export interface RazorpayWebhookRequest {
  event: string;
  payload: Record<string, any>;
  signature: string;  // Webhook signature for verification
}

export interface RazorpayWebhookResponse {
  received: boolean;
}

/**
 * POST /subscriptions/webhooks/stripe
 * 
 * Handle Stripe webhook events.
 */
export interface StripeWebhookRequest {
  event: string;
  data: Record<string, any>;
  signature: string;
}

export interface StripeWebhookResponse {
  received: boolean;
}

// ============================================================================
// Query Limit Endpoints
// ============================================================================

/**
 * GET /subscriptions/query-usage
 * 
 * Get current query usage and limits.
 */
export interface GetQueryUsageRequest {
  // No params, auth via JWT header
}

export interface GetQueryUsageResponse {
  usage: QueryUsage;
  tier: 'free' | 'pro';
}

/**
 * POST /subscriptions/increment-query
 * 
 * Internal: Increment query count (called by chat service middleware).
 */
export interface IncrementQueryRequest {
  userId: string;
}

export interface IncrementQueryResponse {
  newCount: number;
  limitExceeded: boolean;
}

/**
 * GET /subscriptions/can-query
 * 
 * Check if user can make a query (used by middleware).
 */
export interface CanQueryRequest {
  userId: string;
}

export interface CanQueryResponse {
  canQuery: boolean;
  reason?: 'limit_exceeded' | 'pro_tier';
  queriesRemaining: number | null;
}

// ============================================================================
// Billing Portal Endpoints
// ============================================================================

/**
 * POST /subscriptions/portal
 * 
 * Generate customer portal session for managing billing.
 */
export interface CreatePortalSessionRequest {
  returnUrl?: string;  // URL to return to after portal
}

export interface CreatePortalSessionResponse {
  portalUrl: string;
}

/**
 * GET /subscriptions/invoices
 * 
 * Get billing history and invoices.
 */
export interface GetInvoicesRequest {
  limit?: number;
  offset?: number;
}

export interface GetInvoicesResponse {
  invoices: Array<{
    id: string;
    date: string;  // ISO 8601
    amountCents: number;
    currency: string;
    status: 'paid' | 'pending' | 'failed';
    pdfUrl?: string;
  }>;
  total: number;
}

// ============================================================================
// Error Responses
// ============================================================================

export interface SubscriptionsErrorResponse {
  code: 'query_limit_exceeded' | 'payment_failed' | 'invalid_plan' | 'already_subscribed';
  message: string;
  details?: Record<string, any>;
}

