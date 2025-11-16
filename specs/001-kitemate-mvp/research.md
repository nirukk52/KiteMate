# Phase 0: Research & Technical Decisions

**Branch**: `001-kitemate-mvp` | **Date**: 2025-11-16

## Overview

This document consolidates technical research for KiteMate MVP implementation, resolving all "NEEDS CLARIFICATION" items from the plan and documenting technology choices.

---

## 1. Zerodha Kite Connect Integration

### Decision
Use **`kiteconnect` npm package** (official SDK) for production, with **Kite MCP Server** as development/testing tool.

### Rationale
- **Direct SDK approach** gives full control over auth flow, error handling, and rate limiting
- **Kite MCP Server** ([github.com/zerodha/kite-mcp-server](https://github.com/zerodha/kite-mcp-server)) offers:
  - Hosted version at `mcp.kite.trade` (no API keys needed for dev)
  - MCP-native tools for portfolio, orders, market data
  - Useful for LLM-driven features (chat NLP could call MCP tools directly)
  - Self-hosted option with own API keys

### Hybrid Approach (Recommended)
```typescript
// backend/portfolio/connectors/zerodha.connector.ts
import KiteConnect from 'kiteconnect';
import { secret } from 'encore.dev/config';

const API_KEY = secret('ZERODHA_API_KEY');
const API_SECRET = secret('ZERODHA_API_SECRET');

export class ZerodhaConnector {
  private kite: KiteConnect;

  constructor(accessToken: string) {
    this.kite = new KiteConnect({ api_key: API_KEY() });
    this.kite.setAccessToken(accessToken);
  }

  async fetchHoldings(): Promise<NormalizedHolding[]> {
    const holdings = await this.kite.getHoldings();
    return holdings.map(h => normalizeHolding(h));
  }
  
  async fetchPositions(): Promise<NormalizedPosition[]> {
    const positions = await this.kite.getPositions();
    return positions.net.map(p => normalizePosition(p));
  }
}
```

### MCP Server Integration (Optional Enhancement)
For chat NLP, consider using Kite MCP tools directly in Phase 2:

```typescript
// backend/chat/mcp-integration.ts (Future enhancement)
// LLM can call MCP tools like get_holdings, get_quotes directly
// Reduces custom API wrapper code
```

### Development Usage
```bash
# Use hosted MCP server for testing without API keys
npx mcp-remote https://mcp.kite.trade/mcp

# Tools available: get_holdings, get_positions, get_quotes, etc.
# Perfect for prototyping chat features
```

### Alternatives Considered
- Direct REST API calls - Rejected: More error-prone, no TypeScript types
- Python `pykiteconnect` - Rejected: Requires separate Python service
- **MCP Server only** - Rejected for V1: Less control over auth flow, but viable for Phase 2 LLM integration

---

## 2. Natural Language → DSL Pipeline

### Decision
Use **OpenAI GPT-4o** for NL→DSL translation with structured output (function calling).

### Rationale
- Function calling ensures structured, validated output
- Fast response time (~1-2s)
- Good financial domain understanding
- Cost-effective for 50 queries/month free tier

### DSL Structure
```typescript
// backend/chat/dsl.ts
interface WidgetDSL {
  type: 'chart' | 'table' | 'card' | 'tile';
  query: {
    operation: 'aggregate' | 'filter' | 'sort' | 'timeseries';
    field: 'pnl' | 'allocation' | 'returns' | 'holdings';
    filters?: Record<string, any>;
    timeRange?: { from: Date; to: Date };
  };
  visualization: {
    chartType?: 'line' | 'bar' | 'pie' | 'scatter';
    xAxis?: string;
    yAxis?: string;
    groupBy?: string;
  };
}
```

### Validation Flow
```
User NL → GPT-4o function call → WidgetDSL JSON
→ Zod schema validation → Log to audit table
→ widgets.execute(dsl) → Query portfolio DB → Render widget
```

### Alternatives Considered
- Anthropic Claude - Viable alternative, similar capability
- Open-source LLM (Mistral, Llama) - Rejected: Less reliable structure, slower
- Rule-based NLP (spaCy) - Rejected: Inflexible, requires extensive pattern matching

---

## 3. Portfolio Schema Normalization

### Decision
Use **single PostgreSQL table with JSONB** for holdings, normalized structure for metadata.

### Rationale
- JSONB allows flexible connector-specific data without schema changes
- Normalized fields enable efficient queries (user_id, last_sync, total_value)
- PostgreSQL JSONB indexing for fast queries on nested fields
- Satisfies Constitution Principle II (single normalized schema)

### Schema Design
```sql
-- backend/portfolio/migrations/1_create_portfolios.up.sql
CREATE TABLE portfolios (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,  -- 'zerodha' | 'csv'
  last_sync TIMESTAMPTZ NOT NULL,
  total_value NUMERIC(15, 2) NOT NULL,
  total_pnl NUMERIC(15, 2) NOT NULL,
  data JSONB NOT NULL,  -- Normalized holdings array
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_data_gin ON portfolios USING GIN(data);
```

### Normalized Holding Structure (inside JSONB)
```typescript
interface NormalizedHolding {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  assetType: 'equity' | 'mutual_fund' | 'etf';
  sector?: string;
  purchaseDate?: string;
}
```

### Alternatives Considered
- Separate `holdings` table - Rejected: Over-normalization for V1, JSONB sufficient
- DynamoDB - Rejected: PostgreSQL better for relational queries (widgets, users)

---

## 4. Environment Variable Validation (envalid)

### Decision
Use **envalid** for centralized environment validation at application startup.

### Rationale
- Type-safe environment access across all services
- Fail-fast on missing/invalid env vars (before server starts)
- Built-in validators for common types (url, email, port, etc.)
- Integrates cleanly with Encore secrets

### Implementation
```typescript
// backend/shared/env.ts
import { cleanEnv, str, url, num } from 'envalid';

export const env = cleanEnv(process.env, {
  ZERODHA_API_KEY: str({ desc: 'Zerodha API key from developer portal' }),
  ZERODHA_API_SECRET: str({ desc: 'Zerodha API secret' }),
  LLM_API_KEY: str({ desc: 'OpenAI API key' }),
  RAZORPAY_KEY_ID: str({ desc: 'Razorpay key ID' }),
  RAZORPAY_SECRET: str({ desc: 'Razorpay secret' }),
  FRONTEND_URL: url({ default: 'http://localhost:5173' }),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  FREE_TIER_QUERY_LIMIT: num({ default: 50 })
});
```

### Alternatives Considered
- dotenv + manual validation - Rejected: Error-prone, no type safety
- Encore config only - Rejected: Harder to share constants, no fail-fast validation

---

## 5. Task Automation (go-task/task)

### Decision
Use **Taskfile.yml** with go-task runner for development workflow automation.

### Rationale
- Single command (`task dev`) to run backend + frontend + watch client generation
- Better than npm scripts for multi-repo tasks
- Platform-agnostic (works on macOS, Linux, Windows)
- Readable YAML syntax

### Sample Taskfile.yml
```yaml
version: '3'

tasks:
  dev:
    desc: "Run full dev environment"
    deps: [backend:run, frontend:run, gen:watch]

  backend:run:
    dir: backend
    cmd: encore run

  frontend:run:
    dir: frontend
    cmd: npm run dev

  gen:watch:
    desc: "Watch Encore client generation"
    cmd: |
      encore gen client typescript \
        --output=frontend/src/lib/api/encore-client.ts \
        --watch

  db:reset:
    desc: "Reset all databases"
    dir: backend
    cmd: encore db reset

  test:unit:
    desc: "Run backend unit tests"
    dir: backend
    cmd: encore test

  test:e2e:
    desc: "Run Playwright E2E tests"
    dir: frontend
    cmd: npm run test:e2e

  deploy:staging:
    desc: "Deploy to staging"
    cmd: encore deploy --env staging
```

### Alternatives Considered
- npm scripts only - Rejected: Hard to coordinate backend + frontend in monorepo
- Makefile - Rejected: Less readable, platform-specific issues

---

## 6. Drag-and-Drop Dashboard (@dnd-kit)

### Decision
Use **@dnd-kit/core + @dnd-kit/sortable** for drag-and-drop widget arrangement.

### Rationale
- Modern, accessible, TypeScript-first DnD library
- Works with Svelte 5 reactivity (no framework-specific wrapper needed)
- Supports grid layouts, sorting, multiple containers
- Good touch device support

### Integration Pattern
```svelte
<!-- frontend/src/lib/components/DashboardGrid.svelte -->
<script lang="ts">
  import { dndzone } from 'svelte-dnd-action';
  import type { Widget } from '$lib/types';

  let { widgets = $bindable() }: { widgets: Widget[] } = $props();

  function handleSort(e: CustomEvent) {
    widgets = e.detail.items;
  }
</script>

<div
  use:dndzone={{ items: widgets, flipDurationMs: 300 }}
  on:consider={handleSort}
  on:finalize={handleSort}
  class="grid grid-cols-2 gap-4"
>
  {#each widgets as widget (widget.id)}
    <WidgetCard data={widget} />
  {/each}
</div>
```

### Alternatives Considered
- SortableJS - Rejected: Not TypeScript-native
- react-beautiful-dnd - Rejected: React-specific
- Custom implementation - Rejected: Accessibility concerns, time-consuming

---

## 7. Chart Rendering (LayerCake)

### Decision
Use **LayerCake** for chart rendering with custom Svelte components.

### Rationale
- Svelte-native charting library (no framework wrappers)
- Composable: mix SVG, Canvas, HTML layers
- Responsive by default
- Lightweight, tree-shakeable

### Chart Types Needed
- Line chart (portfolio value over time)
- Pie chart (sector allocation)
- Bar chart (P&L by holding)
- Table (top movers, recent trades)

### Alternatives Considered
- Chart.js - Rejected: Imperative API, harder to integrate with Svelte reactivity
- D3.js - Rejected: Overkill for V1, steep learning curve
- Recharts - Rejected: React-specific

---

## 8. Form Handling (superforms + zod)

### Decision
Use **superforms** with **zod** schema validation for type-safe forms.

### Rationale
- SvelteKit-native, progressive enhancement friendly
- Zod schemas shared between frontend/backend
- Type inference from schemas
- Built-in error handling, loading states

### Example
```typescript
// Shared schema (backend/shared/types.ts)
import { z } from 'zod';

export const createWidgetSchema = z.object({
  title: z.string().min(3).max(100),
  type: z.enum(['chart', 'table', 'card', 'tile']),
  query: z.string().optional()
});

// Frontend (routes/dashboard/+page.server.ts)
import { superValidate } from 'sveltekit-superforms/server';

export const actions = {
  create: async ({ request }) => {
    const form = await superValidate(request, createWidgetSchema);
    if (!form.valid) return fail(400, { form });
    // Create widget...
  }
};
```

### Alternatives Considered
- Manual validation - Rejected: Error-prone, duplicated logic
- Joi - Rejected: Worse TypeScript inference than Zod

---

## 9. Authentication (JWT with jose)

### Decision
Use **jose** library for JWT signing/verification, store tokens in HTTP-only cookies.

### Rationale
- Modern, secure JWT library for Node.js
- Built-in for latest cryptographic standards
- TypeScript-native
- Smaller bundle than jsonwebtoken

### Auth Flow
```typescript
// backend/auth/middleware.ts
import { SignJWT, jwtVerify } from 'jose';
import { secret } from 'encore.dev/config';

const JWT_SECRET = secret('JWT_SECRET');

export async function signToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(JWT_SECRET()));
}
```

### Alternatives Considered
- Encore built-in auth - Viable, but JWT gives more flexibility for frontend
- Sessions in database - Rejected: Adds latency, not needed for V1
- OAuth only - Rejected: Still need session management after Zerodha OAuth

---

## 10. Payment Integration (Razorpay)

### Decision
Use **Razorpay** for Indian payment processing (primary market).

### Rationale
- India-focused (KiteMate targets Indian Zerodha users)
- UPI, cards, net banking support
- Good webhook infrastructure for subscription updates
- Lower fees than Stripe for Indian transactions

### Subscription Flow
```
User clicks "Upgrade to Pro" → frontend/razorpay.checkout()
→ Razorpay hosted checkout → Payment success
→ Webhook → backend/subscriptions/webhooks.ts
→ Update user.tier = 'pro', query_count = 0
→ Frontend redirects to dashboard
```

### Stripe as Fallback
For international users, add Stripe integration in Phase 2.

---

## Summary of Resolved Clarifications

| Original "NEEDS CLARIFICATION" | Resolution |
|--------------------------------|------------|
| LLM provider | OpenAI GPT-4o with function calling |
| DSL structure | Typed TypeScript interfaces with Zod validation |
| Portfolio storage | PostgreSQL with JSONB, single normalized schema |
| Env validation approach | envalid at application startup |
| Task automation | go-task/task (Taskfile.yml) |
| DnD library | @dnd-kit/core + @dnd-kit/sortable |
| Chart library | LayerCake (Svelte-native) |
| Form validation | superforms + zod |
| JWT library | jose (modern, TypeScript-native) |
| Payment gateway | Razorpay (India-focused) |

---

**Next Phase**: Proceed to Phase 1 (data-model.md, contracts/, quickstart.md)

