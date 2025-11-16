# KiteMate - AI Assistant Context

**Project**: Personal finance companion for Zerodha users with NLP-powered portfolio queries  
**Current Branch**: `001-kitemate-mvp` (MVP Development)  
**Architecture**: Encore.ts microservices backend + SvelteKit 2 frontend

---

## 🎯 Core Mission

Enable Zerodha users to query their portfolios using natural language ("What's my P&L this month?"), automatically generate visualizations, and share insights on public profiles with social forking capabilities.

---

## 🏗️ Tech Stack

### Backend (Encore.ts Microservices)
- **Language**: TypeScript 5.3+ (Node.js 20+)
- **Framework**: Encore.ts (microservices, type-safe APIs)
- **Database**: PostgreSQL with JSONB (via Encore sqldb)
- **Cache**: Redis (Encore cache)
- **Services**: auth, portfolio, chat, widgets, social, subscriptions, jobs
- **Key Dependencies**:
  - `envalid` - Environment validation
  - `kiteconnect` - Zerodha Kite Connect SDK
  - `jose` - JWT authentication
  - `zod` - Schema validation
  - OpenAI SDK (GPT-4o for NLP)

### Frontend (SvelteKit 2)
- **Language**: TypeScript 5.3+
- **Framework**: SvelteKit 2 + Svelte 5 with runes
- **Styling**: Tailwind CSS v3.4.1 with KiteMate Finance theme
- **Design System**: Figma design tokens extracted via Figma MCP
- **Key Dependencies**:
  - `@dnd-kit/*` - Drag-and-drop dashboard
  - `layercake` - Chart rendering (Svelte-native)
  - `superforms` + `zod` - Type-safe forms
  - Auto-generated Encore TypeScript client

### Infrastructure
- **Task Automation**: go-task/task (Taskfile.yml)
- **Deployment**: Encore Cloud (or AWS/GCP)
- **Payments**: Razorpay (India-focused), Stripe (international)
- **Dev Tools**: Zerodha MCP Server (`mcp.kite.trade`) for testing

---

## 🧭 Key Architectural Patterns

### 1. Single Normalized Portfolio Schema
- All portfolio data (Zerodha API, CSV import) normalized to unified schema
- JSONB storage for flexibility, normalized fields for queries
- See: `specs/001-kitemate-mvp/data-model.md`

### 2. NL → DSL → Data Pipeline
```
Natural Language Query → LLM (GPT-4o) → Structured DSL (WidgetConfig)
→ Zod Validation → Audit Log → Widget Execution → PostgreSQL Query → Visualization
```
- DSL logged for compliance (Constitution Principle IV)
- See: `backend/chat/dsl.ts`

### 3. Connector-Agnostic Design
- Business logic operates on normalized schema
- Connectors are adapters: `portfolio/connectors/zerodha.connector.ts`, `csv.connector.ts`
- Future brokers can plug in without touching business logic

### 4. Type-Safe Full Stack
- Backend: Encore generates TypeScript client automatically
- Frontend: Imports generated client (`$lib/api/encore-client.ts`)
- Shared Zod schemas for validation
- Zero type drift between backend/frontend

---

## 📁 Project Structure

```
backend/                      # Encore.ts microservices
├── auth/                    # Zerodha OAuth, JWT sessions
├── portfolio/               # Sync, CSV import, normalized schema
│   ├── connectors/         # Zerodha, CSV adapters
│   └── migrations/         # PostgreSQL migrations
├── chat/                    # NLP → DSL generation, LLM integration
├── widgets/                 # CRUD, fork logic, dashboard management
├── social/                  # Public profiles, discovery, follows
├── subscriptions/           # Pro tier, Razorpay/Stripe, query limits
├── jobs/                    # Cron (daily portfolio refresh at 6 PM IST)
└── shared/                  # Types, env config (envalid)

frontend/                     # SvelteKit application
├── src/
│   ├── routes/             # File-based routing (SSR-first)
│   │   ├── (auth)/        # Login, OAuth callback
│   │   ├── dashboard/     # Private widgets + drag-drop
│   │   ├── chat/          # NLP interface
│   │   ├── [username]/    # Public profiles
│   │   └── discover/      # Trending widgets
│   └── lib/
│       ├── api/           # Encore client (auto-generated)
│       ├── components/    # Svelte 5 components with runes
│       └── stores/        # State management (Svelte stores)

specs/001-kitemate-mvp/      # Implementation docs
├── spec.md                 # Feature specification (user stories)
├── plan.md                 # Implementation plan
├── data-model.md           # Database schema (8 entities)
├── research.md             # Technology decisions
├── quickstart.md           # 10-minute setup guide
└── contracts/              # TypeScript API contracts (6 services)
```

---

## 🎨 Svelte 5 Runes (Frontend)

**Key Patterns**:
```svelte
<script lang="ts">
  import { api } from '$lib/api/client';
  
  // Reactive state
  let portfolio = $state<Portfolio | null>(null);
  
  // Derived values
  let totalValue = $derived(portfolio?.totalValue ?? 0);
  
  // Props with destructuring
  let { widgets = $bindable() }: { widgets: Widget[] } = $props();
  
  // Effects for side effects
  $effect(() => {
    console.log('Portfolio updated:', portfolio);
  });
</script>
```

**Never use** `$state` in SSR components - use `export let data` from `+page.server.ts`

---

## 🔐 Critical Security Practices

1. **No hardcoded secrets** - Use `secret()` from `encore.dev/config`
2. **Encrypt Zerodha tokens** at rest (AES-256)
3. **Validate all inputs** with Zod schemas
4. **Rate limiting** via Encore middleware (free tier: 50 queries/month)
5. **CORS** restricted to frontend domain only
6. **Audit logs** for all DSL operations

---

## 📚 Essential Documentation

**Start Here**:
- [`README.md`](./README.md) - Project overview
- [`specs/001-kitemate-mvp/quickstart.md`](./specs/001-kitemate-mvp/quickstart.md) - 10-min setup
- [`specs/001-kitemate-mvp/plan.md`](./specs/001-kitemate-mvp/plan.md) - Implementation plan

**Specifications**:
- [`specs/001-kitemate-mvp/spec.md`](./specs/001-kitemate-mvp/spec.md) - User stories, requirements
- [`specs/001-kitemate-mvp/data-model.md`](./specs/001-kitemate-mvp/data-model.md) - Database schema
- [`specs/001-kitemate-mvp/contracts/`](./specs/001-kitemate-mvp/contracts/) - API contracts

**Constitution** (CRITICAL):
- [`.specify/memory/constitution.md`](./.specify/memory/constitution.md) - Non-negotiable development principles

**Agents** (Use Proactively):
- [`.claude/agents/encore-backend-developer.md`](./.claude/agents/encore-backend-developer.md)
- [`.claude/agents/svelte-frontend-developer.md`](./.claude/agents/svelte-frontend-developer.md)
- [`.claude/agents/encore-svelte-integration.md`](./.claude/agents/encore-svelte-integration.md)

**Skills**:
- [`.claude/skills/theme-factory/`](./.claude/skills/theme-factory/) - Professional theming (includes KiteMate Finance theme)

---

## 🧪 Testing Philosophy

**Coverage Target**: 50-60% (quality over quantity)
- **DO**: Test observational behavior, invariants, edge cases
- **DON'T**: Mirror implementation details, over-test getters/setters

**Critical Paths to Test**:
1. Auth flow (Zerodha OAuth → JWT → token refresh)
2. Portfolio sync (Zerodha API → normalization → PostgreSQL)
3. NL→DSL pipeline (query → GPT-4o → validation → execution)
4. Widget fork (clone config → map to user's portfolio → notify creator)

**Run Tests**:
```bash
task test              # All tests
task test:unit         # Backend unit tests
task test:e2e          # Frontend E2E (Playwright)
```

---

## 🚀 Development Workflow

### Quick Start
```bash
# Start everything
task dev

# Or manually:
cd backend && encore run              # http://localhost:4000
cd frontend && npm run dev            # http://localhost:5173
encore gen client typescript --watch  # Auto-update client
```

### Common Tasks
```bash
task --list                          # Show all tasks
task db:reset                        # Reset databases
task gen:client                      # Generate TypeScript client
encore db shell portfolio            # PostgreSQL shell
encore logs                          # View backend logs
```

### Generate TypeScript Client (After Backend Changes)
```bash
encore gen client typescript --output=frontend/src/lib/api/encore-client.ts
```

---

## 📋 Constitution Compliance (MANDATORY)

All code must comply with [constitution](.specify/memory/constitution.md):

1. **Test-Driven Development** - Tests first for critical paths
2. **Single Normalized Portfolio Schema** - One source of truth
3. **Connector-Agnostic Architecture** - Business logic independent of brokers
4. **NL → DSL → Data Pipeline** - Validated DSL layer with audit logs
5. **Comprehensive Testing** - 50-60% coverage, behavior-focused
6. **Runtime Invariants** - Monitor violations (e.g., portfolio value ≥ 0)
7. **Simplicity & YAGNI** - No premature optimization

**Gate Checks**: All PRs must pass constitutional principles before merge.

---

## 💡 Key Implementation Notes

### Zerodha Integration
- Use `kiteconnect` npm SDK for production
- Use [Kite MCP Server](https://github.com/zerodha/kite-mcp-server) (`mcp.kite.trade`) for dev/testing
- OAuth flow: Login → Request token → Exchange for access token → Encrypt & store

### Chat NLP
- GPT-4o with function calling generates structured `WidgetDSL`
- Zod validates DSL before execution
- Every DSL operation logged to `dsl_audit_log` table
- Query limits enforced via Encore middleware

### Widget Fork
- Clone config, not data
- Map forked widget to forking user's portfolio
- PubSub event notifies original creator
- Increment `fork_count` on original widget

### Dashboard Layout
- Stored as JSONB array of `WidgetLayout` objects
- Drag-and-drop with `@dnd-kit` (12-column grid)
- SSR load → hydrate client-side → reactive updates

### Landing Page & Design System
- Professional landing page based on Figma design
- Design tokens extracted via Figma MCP (colors, typography, spacing)
- KiteMate Finance theme in `.claude/skills/theme-factory/themes/`
- Tailwind v4 configured with extracted design tokens
- Theme documented in `theme-factory` skill for consistent styling

---

## 🔄 Recent Changes

### 001-kitemate-mvp (Current)
- ✅ **Phase 0 & 1 (Design)**: Research + Data model + API contracts complete
- ✅ **Phase 1 (Setup)**: Project structure, Taskfile, dependencies (10/10 tasks)
- ✅ **Phase 2 (Foundational)**: Core infrastructure ready (14/14 tasks)
  - Backend: Auth service with JWT + middleware, Portfolio service with schema validation
  - Frontend: SvelteKit 2 with Tailwind v4, Svelte 5 runes
  - Shared: Type system, error handling, environment validation
- ✅ **Compilation Tests**: Both backend and frontend TypeScript compile without errors
- 🚧 **Phase 3 (MVP)**: Ready to start User Story 1 - Zerodha integration (31 tasks remaining)

---

## 🎯 Current Status

**Phase 0 & 1**: ✅ Complete (Research + Design)  
**Phase 1**: ✅ Complete (Setup - 10 tasks)  
**Phase 2**: ✅ Complete (Foundational - 14 tasks)  
**Phase 3**: 🚧 Ready to start (User Story 1 - 31 tasks)

**Test Results**: ✅ ALL PASSING
- Backend TypeScript: 0 errors
- Frontend Svelte: 0 errors  
- Dependencies: 346 backend + 488 frontend packages installed
- See `TEST_RESULTS.md` for full report

**Next Steps**:
1. ✅ ~~Project setup~~ - DONE
2. ✅ ~~Foundational infrastructure~~ - DONE
3. 🚧 **Start Phase 3: User Story 1** (Connect Zerodha & View Portfolio)
   - Write tests first (TDD)
   - Implement backend (auth + portfolio endpoints)
   - Build frontend (login + dashboard)
   - Validate MVP
4. Run `./verify-setup.sh` to check environment
5. Use `task dev` to start development servers

---

## 🆘 When You Need Help

- **Encore patterns**: Check `.claude/agents/encore-backend-developer.md`
- **Svelte 5 runes**: Check `.claude/agents/svelte-frontend-developer.md`
- **Full-stack integration**: Check `.claude/agents/encore-svelte-integration.md`
- **API design**: See `specs/001-kitemate-mvp/contracts/`
- **Database schema**: See `specs/001-kitemate-mvp/data-model.md`

**Remember**: Always check constitution compliance before suggesting architectural changes!