/**
 * Chat Service API Contract
 * 
 * Handles natural language portfolio queries and DSL generation.
 */

// ============================================================================
// Types
// ============================================================================

export interface WidgetDSL {
  type: 'chart' | 'table' | 'card' | 'tile';
  query: {
    operation: 'aggregate' | 'filter' | 'sort' | 'timeseries';
    field: 'pnl' | 'allocation' | 'returns' | 'holdings' | 'performance';
    filters?: {
      symbol?: string[];
      sector?: string[];
      assetType?: string[];
      minValue?: number;
      maxValue?: number;
    };
    timeRange?: {
      from: string;  // ISO 8601
      to: string;
    };
    groupBy?: 'sector' | 'assetType' | 'symbol' | 'date';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
  };
  visualization: {
    chartType?: 'line' | 'bar' | 'pie' | 'scatter' | 'area';
    xAxis?: string;
    yAxis?: string;
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
  };
  refresh: {
    automatic: boolean;
    frequency?: 'daily' | 'hourly' | 'manual';
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;  // ISO 8601
}

// ============================================================================
// Chat Endpoints
// ============================================================================

/**
 * POST /chat/query
 * 
 * Send natural language query, get widget DSL + data.
 */
export interface ChatQueryRequest {
  message: string;
  context?: {
    previousMessages?: ChatMessage[];
    portfolioSnapshot?: any;
  };
}

export interface ChatQueryResponse {
  message: ChatMessage;  // Assistant's response
  widget?: {
    title: string;
    dsl: WidgetDSL;
    data: any;  // Actual computed data for the widget
  };
  clarificationNeeded?: {
    question: string;
    options?: string[];
  };
  queryCount: {
    used: number;
    limit: number | null;  // null for Pro tier (unlimited)
    remaining: number | null;
  };
}

/**
 * POST /chat/validate-dsl
 * 
 * Validate a DSL command before execution (for manual widget creation).
 */
export interface ValidateDSLRequest {
  dsl: WidgetDSL;
}

export interface ValidateDSLResponse {
  valid: boolean;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

/**
 * POST /chat/execute-dsl
 * 
 * Execute a validated DSL command and return data.
 */
export interface ExecuteDSLRequest {
  dsl: WidgetDSL;
  userId: string;
}

export interface ExecuteDSLResponse {
  data: any;  // Computed widget data
  executedAt: string;  // ISO 8601
  cacheHit: boolean;
}

/**
 * GET /chat/suggestions
 * 
 * Get suggested queries based on portfolio.
 */
export interface GetSuggestionsRequest {
  userId: string;
}

export interface GetSuggestionsResponse {
  suggestions: Array<{
    text: string;
    category: 'performance' | 'allocation' | 'analysis';
    popularity: number;
  }>;
}

/**
 * GET /chat/history
 * 
 * Get user's chat history.
 */
export interface GetChatHistoryRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface GetChatHistoryResponse {
  messages: ChatMessage[];
  total: number;
}

// ============================================================================
// Error Responses
// ============================================================================

export interface ChatErrorResponse {
  code: 'query_limit_exceeded' | 'dsl_validation_failed' | 'portfolio_not_found' | 'llm_error';
  message: string;
  details?: Record<string, any>;
}

