/**
 * Widgets Service API Contract
 * 
 * Handles widget CRUD, fork logic, and dashboard management.
 */

import type { WidgetDSL } from './chat.api';

// ============================================================================
// Types
// ============================================================================

export interface Widget {
  id: string;
  userId: string;
  title: string;
  type: 'chart' | 'table' | 'card' | 'tile';
  visibility: 'private' | 'public';
  config: WidgetDSL;
  createdAt: string;  // ISO 8601
  updatedAt: string;
  forkCount: number;
  forkedFrom?: string;  // Widget ID if this is a fork
}

export interface WidgetLayout {
  widgetId: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  visible: boolean;
}

export interface Dashboard {
  userId: string;
  layout: WidgetLayout[];
  updatedAt: string;
}

// ============================================================================
// Widget CRUD Endpoints
// ============================================================================

/**
 * POST /widgets
 * 
 * Create a new widget.
 */
export interface CreateWidgetRequest {
  title: string;
  type: 'chart' | 'table' | 'card' | 'tile';
  config: WidgetDSL;
  visibility?: 'private' | 'public';
}

export interface CreateWidgetResponse {
  widget: Widget;
}

/**
 * GET /widgets/:id
 * 
 * Get widget by ID (public widgets accessible by anyone, private only by owner).
 */
export interface GetWidgetRequest {
  id: string;  // Path param
}

export interface GetWidgetResponse {
  widget: Widget;
  data?: any;  // Computed data (only if user has portfolio access)
}

/**
 * GET /widgets
 * 
 * List user's widgets.
 */
export interface ListWidgetsRequest {
  userId: string;
  visibility?: 'private' | 'public' | 'all';
  limit?: number;
  offset?: number;
}

export interface ListWidgetsResponse {
  widgets: Widget[];
  total: number;
}

/**
 * PUT /widgets/:id
 * 
 * Update widget (owner only).
 */
export interface UpdateWidgetRequest {
  id: string;  // Path param
  title?: string;
  config?: WidgetDSL;
  visibility?: 'private' | 'public';
}

export interface UpdateWidgetResponse {
  widget: Widget;
}

/**
 * DELETE /widgets/:id
 * 
 * Delete widget (owner only).
 */
export interface DeleteWidgetRequest {
  id: string;  // Path param
}

export interface DeleteWidgetResponse {
  success: boolean;
}

// ============================================================================
// Fork Endpoints
// ============================================================================

/**
 * POST /widgets/:id/fork
 * 
 * Fork a public widget to own dashboard.
 */
export interface ForkWidgetRequest {
  id: string;  // Path param (original widget ID)
}

export interface ForkWidgetResponse {
  forkedWidget: Widget;
  addedToDashboard: boolean;
}

/**
 * GET /widgets/:id/forks
 * 
 * Get list of users who forked this widget.
 */
export interface GetWidgetForksRequest {
  id: string;  // Path param
  limit?: number;
  offset?: number;
}

export interface GetWidgetForksResponse {
  forks: Array<{
    forkedWidgetId: string;
    forkingUserId: string;
    forkingUsername: string;
    forkedAt: string;
  }>;
  total: number;
}

// ============================================================================
// Dashboard Endpoints
// ============================================================================

/**
 * GET /dashboard
 * 
 * Get user's dashboard layout.
 */
export interface GetDashboardRequest {
  userId: string;
}

export interface GetDashboardResponse {
  dashboard: Dashboard;
  widgets: Widget[];  // All widgets in dashboard with computed data
}

/**
 * PUT /dashboard
 * 
 * Update dashboard layout (positions, visibility).
 */
export interface UpdateDashboardRequest {
  layout: WidgetLayout[];
}

export interface UpdateDashboardResponse {
  dashboard: Dashboard;
}

/**
 * POST /dashboard/add-widget
 * 
 * Add existing widget to dashboard.
 */
export interface AddWidgetToDashboardRequest {
  widgetId: string;
  position?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface AddWidgetToDashboardResponse {
  dashboard: Dashboard;
}

/**
 * POST /dashboard/remove-widget
 * 
 * Remove widget from dashboard (doesn't delete widget, just hides it).
 */
export interface RemoveWidgetFromDashboardRequest {
  widgetId: string;
}

export interface RemoveWidgetFromDashboardResponse {
  dashboard: Dashboard;
}

/**
 * POST /dashboard/refresh
 * 
 * Refresh all widgets on dashboard (fetch latest data).
 */
export interface RefreshDashboardRequest {
  // No body, auth via JWT header
}

export interface RefreshDashboardResponse {
  refreshedAt: string;
  widgets: Array<{
    widgetId: string;
    data: any;
  }>;
}

// ============================================================================
// Error Responses
// ============================================================================

export interface WidgetsErrorResponse {
  code: 'not_found' | 'unauthorized' | 'invalid_config' | 'fork_failed' | 'private_widget';
  message: string;
  details?: Record<string, any>;
}

