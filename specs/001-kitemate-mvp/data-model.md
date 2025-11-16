# Phase 1: Data Model

**Branch**: `001-kitemate-mvp` | **Date**: 2025-11-16

## Overview

This document defines the normalized data schema for KiteMate, ensuring a single source of truth for portfolio data regardless of connector source (Zerodha API, CSV import, or future brokers).

---

## Core Entities

### 1. User

**Purpose**: Represents a KiteMate account holder with authentication and subscription details.

**Table**: `users`

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,              -- UUID v4
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Subscription
  tier TEXT NOT NULL DEFAULT 'free',  -- 'free' | 'pro'
  query_count INTEGER NOT NULL DEFAULT 0,
  query_reset_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 month'),
  
  -- Profile
  username TEXT UNIQUE,              -- Public profile URL slug
  bio TEXT,
  avatar_url TEXT,
  
  -- Social stats
  follower_count INTEGER NOT NULL DEFAULT 0,
  total_forks_received INTEGER NOT NULL DEFAULT 0,
  
  -- Zerodha connection
  zerodha_user_id TEXT,
  zerodha_connected BOOLEAN NOT NULL DEFAULT FALSE,
  zerodha_token_encrypted BYTEA,     -- Encrypted access token
  zerodha_token_expires_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_zerodha_user_id ON users(zerodha_user_id);
```

**Invariants**:
- Email must be valid format
- Username must be URL-safe (lowercase, alphanumeric, hyphens)
- `query_count` ≥ 0
- `tier = 'pro'` implies unlimited queries (query_count not enforced)
- `zerodha_token_encrypted` must be encrypted at rest (AES-256)

---

### 2. Portfolio

**Purpose**: Normalized portfolio data from any source (Zerodha, CSV). Single source of truth.

**Table**: `portfolios`

```sql
CREATE TABLE portfolios (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  source TEXT NOT NULL,              -- 'zerodha' | 'csv'
  last_sync TIMESTAMPTZ NOT NULL,
  total_value NUMERIC(15, 2) NOT NULL,
  total_pnl NUMERIC(15, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  data JSONB NOT NULL,               -- Array of NormalizedHolding
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_data_gin ON portfolios USING GIN(data);
```

**Normalized Holding Structure (JSONB)**:

```typescript
interface NormalizedHolding {
  symbol: string;                   // Stock ticker (e.g., "INFY", "RELIANCE")
  isin?: string;                    // International Securities ID
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnL: number;            // (currentPrice - avgPrice) * quantity
  assetType: 'equity' | 'mutual_fund' | 'etf' | 'bond';
  sector?: string;                  // e.g., "Technology", "Finance"
  exchange?: string;                // e.g., "NSE", "BSE"
  purchaseDate?: string;            // ISO 8601 date
  lastTradeDate?: string;
  
  // Connector-specific metadata (preserved but not used in business logic)
  _metadata?: Record<string, any>;
}
```

**Invariants**:
- `total_value` ≥ 0
- `quantity` > 0 for each holding
- `unrealizedPnL` must match calculation: `(currentPrice - avgPrice) * quantity`
- All holdings must have valid `symbol` and `assetType`
- JSONB `data` must be an array of holdings

---

### 3. Widget

**Purpose**: Visual component displaying portfolio insights. Can be private or public.

**Table**: `widgets`

```sql
CREATE TABLE widgets (
  id TEXT PRIMARY KEY,               -- UUID v4
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,                -- 'chart' | 'table' | 'card' | 'tile'
  visibility TEXT NOT NULL DEFAULT 'private',  -- 'private' | 'public'
  config JSONB NOT NULL,             -- Widget-specific configuration (DSL)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fork_count INTEGER NOT NULL DEFAULT 0,
  forked_from TEXT REFERENCES widgets(id) ON DELETE SET NULL
);

CREATE INDEX idx_widgets_user_id ON widgets(user_id);
CREATE INDEX idx_widgets_visibility ON widgets(visibility);
CREATE INDEX idx_widgets_forked_from ON widgets(forked_from);
CREATE INDEX idx_widgets_config_gin ON widgets USING GIN(config);
```

**Widget Config Structure (JSONB - DSL)**:

```typescript
interface WidgetConfig {
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
```

**Invariants**:
- Config must pass DSL validation (Zod schema) before persistence
- `fork_count` ≥ 0
- Public widgets can be forked; private widgets cannot
- `forked_from` creates an immutable genealogy chain

---

### 4. Dashboard

**Purpose**: User's personalized widget layout.

**Table**: `dashboards`

```sql
CREATE TABLE dashboards (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  layout JSONB NOT NULL,             -- Array of WidgetLayout
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Layout Structure (JSONB)**:

```typescript
interface WidgetLayout {
  widgetId: string;
  position: {
    x: number;  // Grid column (0-indexed)
    y: number;  // Grid row (0-indexed)
    w: number;  // Width in grid units
    h: number;  // Height in grid units
  };
  visible: boolean;
}

type DashboardLayout = WidgetLayout[];
```

**Invariants**:
- All `widgetId` references must exist in `widgets` table
- No overlapping positions (enforced client-side with @dnd-kit)
- Grid dimensions: 12 columns × unlimited rows

---

### 5. Fork

**Purpose**: Tracks widget genealogy for attribution and discovery.

**Table**: `forks`

```sql
CREATE TABLE forks (
  id BIGSERIAL PRIMARY KEY,
  original_widget_id TEXT NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  forked_widget_id TEXT NOT NULL UNIQUE REFERENCES widgets(id) ON DELETE CASCADE,
  forking_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  forked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_forks_original_widget_id ON forks(original_widget_id);
CREATE INDEX idx_forks_forking_user_id ON forks(forking_user_id);
```

**Fork Logic**:
1. Clone `original_widget` config
2. Create new widget with `forked_from = original_widget_id`
3. Map config to `forking_user_id`'s portfolio data
4. Increment `original_widget.fork_count`
5. Insert into `forks` table
6. Pub/Sub: Notify original creator

**Invariants**:
- Cannot fork your own widget
- Forked widget belongs to forking user
- Fork creates independent copy (changes don't propagate)

---

### 6. Notification

**Purpose**: Event-driven user notifications (forks, follows, system alerts).

**Table**: `notifications`

```sql
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                -- 'fork' | 'follow' | 'system' | 'refresh'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB,                    -- Type-specific data
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

**Metadata Examples**:

```typescript
// Fork notification
{
  type: 'fork',
  metadata: {
    forkedWidgetId: 'w789',
    forkingUserId: 'u456',
    forkingUsername: 'alice'
  }
}

// System notification
{
  type: 'system',
  metadata: {
    queryLimitReached: true,
    queriesRemaining: 0,
    resetDate: '2025-12-01T00:00:00Z'
  }
}
```

---

### 7. DSL Audit Log

**Purpose**: Compliance and debugging for all DSL operations (Constitution Principle IV).

**Table**: `dsl_audit_log`

```sql
CREATE TABLE dsl_audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  widget_id TEXT REFERENCES widgets(id) ON DELETE SET NULL,
  dsl_command JSONB NOT NULL,        -- Full WidgetConfig DSL
  validation_result TEXT NOT NULL,   -- 'valid' | 'invalid'
  validation_errors JSONB,           -- Array of error messages if invalid
  executed BOOLEAN NOT NULL DEFAULT FALSE,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dsl_audit_log_user_id ON dsl_audit_log(user_id);
CREATE INDEX idx_dsl_audit_log_widget_id ON dsl_audit_log(widget_id);
CREATE INDEX idx_dsl_audit_log_created_at ON dsl_audit_log(created_at);
```

**Invariants**:
- Every DSL command (from NL or manual) is logged before execution
- `validation_result = 'valid'` required for `executed = true`
- Immutable log (no updates, only inserts)

---

### 8. Subscription

**Purpose**: Payment and billing details for Pro tier.

**Table**: `subscriptions`

```sql
CREATE TABLE subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,                -- 'free' | 'pro'
  status TEXT NOT NULL,              -- 'active' | 'cancelled' | 'past_due'
  payment_provider TEXT,             -- 'razorpay' | 'stripe'
  payment_provider_subscription_id TEXT UNIQUE,
  billing_cycle TEXT,                -- 'monthly' | 'annual'
  amount_cents INTEGER,
  currency TEXT DEFAULT 'INR',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

**Invariants**:
- `tier = 'pro'` implies `status = 'active'`
- `current_period_end` > `current_period_start`
- Payment provider ID required for non-free tiers

---

## Connector Normalization Flow

### Zerodha → Normalized Schema

```typescript
// backend/portfolio/connectors/zerodha.connector.ts
function normalizeHolding(zerodhaHolding: any): NormalizedHolding {
  return {
    symbol: zerodhaHolding.tradingsymbol,
    isin: zerodhaHolding.isin,
    quantity: zerodhaHolding.quantity,
    avgPrice: zerodhaHolding.average_price,
    currentPrice: zerodhaHolding.last_price,
    unrealizedPnL: zerodhaHolding.pnl,
    assetType: mapAssetType(zerodhaHolding.product),
    sector: zerodhaHolding.sector || undefined,
    exchange: zerodhaHolding.exchange,
    purchaseDate: zerodhaHolding.purchase_date,
    lastTradeDate: zerodhaHolding.last_trade_date,
    
    // Preserve raw Zerodha data for debugging
    _metadata: {
      zerodha: zerodhaHolding
    }
  };
}
```

### CSV → Normalized Schema

```typescript
// backend/portfolio/connectors/csv.connector.ts
function normalizeCSVRow(row: CSVRow): NormalizedHolding {
  return {
    symbol: row.symbol.toUpperCase(),
    quantity: parseFloat(row.quantity),
    avgPrice: parseFloat(row.avg_price),
    currentPrice: parseFloat(row.current_price || row.avg_price),
    unrealizedPnL: calculatePnL(row),
    assetType: row.asset_type as AssetType || 'equity',
    sector: row.sector,
    purchaseDate: row.purchase_date,
    
    _metadata: {
      csv: { source: 'manual_import' }
    }
  };
}
```

---

## Relationships

```
users (1) → (1) portfolio
users (1) → (many) widgets
users (1) → (1) dashboard
users (1) → (many) notifications
users (1) → (0..1) subscription

widgets (1) → (many) forks (as original)
widgets (1) → (0..1) fork (as forked)
widgets (many) → (1) dashboard.layout

dsl_audit_log (many) → (1) user
dsl_audit_log (many) → (0..1) widget
```

---

## Data Lifecycle

1. **User Registration** → Create user, dashboard, default subscription (free)
2. **Zerodha OAuth** → Store encrypted token, set `zerodha_connected = true`
3. **Portfolio Sync** → Fetch Zerodha holdings → Normalize → Upsert portfolio
4. **Chat Query** → NL → LLM → DSL → Validate → Log to audit → Execute → Create widget
5. **Widget Fork** → Clone config → Create new widget → Insert fork record → Notify creator
6. **Daily Refresh** → Cron job → Fetch all portfolios → Update `data` and `last_sync`
7. **Pro Upgrade** → Payment webhook → Update subscription → Set tier = 'pro'

---

## Testing Considerations

- **Unit Tests**: Normalization functions (Zerodha → schema, CSV → schema)
- **Integration Tests**: Database constraints, foreign keys, JSONB indexing
- **E2E Tests**: Full data flow (OAuth → sync → query → widget creation)

---

**Next Steps**: Generate API contracts in `/contracts/` directory.

