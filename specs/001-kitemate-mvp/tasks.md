# Tasks: KiteMate MVP

**Input**: Design documents from `/specs/001-kitemate-mvp/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Following constitution principles, tests will be written FIRST for critical paths (auth, portfolio sync, NL→DSL pipeline, widget fork). Coverage target: 50-60%.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/` (Encore.ts microservices)
- **Frontend**: `frontend/` (SvelteKit 2)
- **Specs**: `specs/001-kitemate-mvp/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project root structure (backend/, frontend/, Taskfile.yml)
- [X] T002 Initialize Encore backend in backend/ with encore.app configuration
- [X] T003 [P] Initialize SvelteKit frontend in frontend/ with TypeScript and Tailwind v4
- [X] T004 [P] Setup Taskfile.yml with dev, test, deploy, gen:client, db:reset tasks
- [X] T005 [P] Create backend/shared/env.ts with envalid configuration for environment validation
- [X] T006 [P] Configure .gitignore for Node.js, Encore, and SvelteKit artifacts
- [X] T007 [P] Setup package.json dependencies in backend/ (envalid, kiteconnect, jose, zod, OpenAI SDK)
- [X] T008 [P] Setup package.json dependencies in frontend/ (@dnd-kit/*, layercake, superforms, zod)
- [X] T009 [P] Create backend/.env.example template with all required secrets
- [X] T010 [P] Create frontend/.env.local.example with VITE_ENCORE_API_URL

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 Setup PostgreSQL database definitions in Encore (portfolio, users, widgets, social, subscriptions)
- [X] T012 [P] Create backend/shared/types.ts with shared TypeScript interfaces (User, Portfolio, Widget, etc.)
- [X] T013 [P] Implement Encore API error handling utilities in backend/shared/errors.ts
- [X] T014 [P] Configure Encore CORS policy in backend/encore.app for frontend domain
- [X] T015 Create backend/auth/encore.service.ts service definition
- [X] T016 Implement JWT utilities in backend/auth/jwt.ts using jose library
- [X] T017 Implement auth middleware in backend/auth/middleware.ts with Encore authHandler
- [X] T018 Implement auth gateway in backend/auth/gateway.ts
- [X] T019 [P] Create base database migration structure in backend/portfolio/migrations/
- [X] T020 [P] Setup frontend Tailwind CSS v4 configuration in frontend/tailwind.config.js
- [X] T021 [P] Create frontend/src/lib/api/client.ts for configured Encore client instance
- [X] T022 [P] Setup SvelteKit adapter-vercel in frontend/svelte.config.js
- [X] T023 [P] Create frontend/src/routes/+layout.svelte root layout with Tailwind imports
- [X] T024 Generate initial TypeScript client: encore gen client typescript --output=frontend/src/lib/api/encore-client.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Connect Zerodha Account and View Portfolio (Priority: P1) 🎯 MVP

**Goal**: Users can connect Zerodha account via OAuth and view their portfolio (holdings, P&L, recent activity) within 5 seconds

**Independent Test**: Complete Zerodha OAuth flow from login button → authorization → callback → portfolio displays with mock/test data

### Tests for User Story 1 (TDD - Write First)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T025 [P] [US1] Unit test for Zerodha OAuth token exchange in backend/auth/zerodha.test.ts
- [ ] T026 [P] [US1] Unit test for portfolio normalization in backend/portfolio/connectors/zerodha.connector.test.ts
- [ ] T027 [P] [US1] Integration test for full Zerodha OAuth flow in backend/auth/integration.test.ts
- [ ] T028 [P] [US1] E2E test for Zerodha connection flow in frontend/tests/e2e/zerodha-auth.spec.ts
- [ ] T029 [P] [US1] Integration test for portfolio sync in backend/portfolio/sync.test.ts

### Database & Models for User Story 1

- [ ] T030 [P] [US1] Create migration 1_create_users.up.sql in backend/auth/migrations/ (users table)
- [ ] T031 [P] [US1] Create migration 1_create_portfolios.up.sql in backend/portfolio/migrations/ (portfolios table)
- [ ] T032 [P] [US1] Define NormalizedHolding interface in backend/portfolio/schema.ts
- [ ] T033 [P] [US1] Define User entity with Zerodha fields in backend/auth/types.ts

### Backend Implementation for User Story 1

- [ ] T034 [US1] Implement POST /auth/zerodha/initiate in backend/auth/zerodha.ts (generate OAuth URL)
- [ ] T035 [US1] Implement POST /auth/zerodha/callback in backend/auth/zerodha.ts (exchange request token)
- [ ] T036 [US1] Implement token encryption utilities in backend/auth/encryption.ts (AES-256)
- [ ] T037 [US1] Implement GET /auth/zerodha/status in backend/auth/zerodha.ts
- [ ] T038 [P] [US1] Create Zerodha connector in backend/portfolio/connectors/zerodha.connector.ts
- [ ] T039 [P] [US1] Implement portfolio normalization logic in backend/portfolio/schema.ts
- [ ] T040 [US1] Implement POST /portfolio/sync in backend/portfolio/sync.ts
- [ ] T041 [US1] Implement GET /portfolio/:userId in backend/portfolio/portfolio.ts
- [ ] T042 [US1] Implement GET /portfolio/summary in backend/portfolio/summary.ts
- [ ] T043 [US1] Add validation for Zerodha token expiration in backend/auth/zerodha.ts
- [ ] T044 [US1] Add error handling for Zerodha API failures in backend/portfolio/connectors/zerodha.connector.ts

### Frontend Implementation for User Story 1

- [ ] T045 [P] [US1] Create login page in frontend/src/routes/(auth)/login/+page.svelte
- [ ] T046 [P] [US1] Create OAuth callback handler in frontend/src/routes/(auth)/callback/+page.server.ts
- [ ] T047 [US1] Implement Zerodha connection logic in frontend/src/routes/(auth)/callback/+page.svelte
- [ ] T048 [US1] Create portfolio page in frontend/src/routes/dashboard/+page.svelte with SSR data loading
- [ ] T049 [US1] Create portfolio data loader in frontend/src/routes/dashboard/+page.server.ts
- [ ] T050 [P] [US1] Create PortfolioSummary component in frontend/src/lib/components/PortfolioSummary.svelte
- [ ] T051 [P] [US1] Create HoldingsTable component in frontend/src/lib/components/HoldingsTable.svelte
- [ ] T052 [US1] Implement auth store with $state rune in frontend/src/lib/stores/auth.svelte.ts
- [ ] T053 [US1] Add Zerodha connection status indicator to +layout.svelte
- [ ] T054 [US1] Add error handling UI for OAuth failures in frontend/src/routes/(auth)/callback/+page.svelte
- [ ] T055 [US1] Regenerate TypeScript client after auth/portfolio endpoints

**Checkpoint**: At this point, User Story 1 should be fully functional - users can connect Zerodha and view portfolio

---

## Phase 4: User Story 2 - Chat with Portfolio Using Natural Language (Priority: P2)

**Goal**: Users can ask natural language questions ("What's my P&L this month?") and receive widget visualizations within 3 seconds

**Independent Test**: Type NL query → verify widget generated with correct visualization → verify query count incremented

### Tests for User Story 2 (TDD - Write First)

- [ ] T056 [P] [US2] Unit test for DSL generation in backend/chat/nlp.test.ts
- [ ] T057 [P] [US2] Unit test for DSL validation in backend/chat/dsl.test.ts
- [ ] T058 [P] [US2] Integration test for NL→DSL→execution pipeline in backend/chat/integration.test.ts
- [ ] T059 [P] [US2] E2E test for chat query flow in frontend/tests/e2e/chat.spec.ts
- [ ] T060 [P] [US2] Unit test for query limit enforcement in backend/subscriptions/query-limits.test.ts

### Database & Models for User Story 2

- [ ] T061 [P] [US2] Create migration 1_create_dsl_audit_log.up.sql in backend/chat/migrations/ (dsl_audit_log table)
- [ ] T062 [P] [US2] Define WidgetDSL interface in backend/chat/dsl.ts with Zod schema
- [ ] T063 [US2] Update users migration to add query_count and query_reset_date fields

### Backend Implementation for User Story 2

- [ ] T064 [P] [US2] Create backend/chat/encore.service.ts service definition
- [ ] T065 [US2] Implement OpenAI GPT-4o integration in backend/chat/llm.ts with function calling
- [ ] T066 [US2] Implement DSL generation from NL in backend/chat/nlp.ts
- [ ] T067 [US2] Implement DSL validation with Zod in backend/chat/dsl.ts
- [ ] T068 [US2] Implement DSL audit logging in backend/chat/audit.ts
- [ ] T069 [US2] Implement POST /chat/query endpoint in backend/chat/query.ts
- [ ] T070 [US2] Implement POST /chat/validate-dsl endpoint in backend/chat/dsl.ts
- [ ] T071 [US2] Implement POST /chat/execute-dsl endpoint in backend/chat/execute.ts
- [ ] T072 [US2] Implement GET /chat/suggestions endpoint in backend/chat/suggestions.ts
- [ ] T073 [P] [US2] Create backend/subscriptions/encore.service.ts service definition
- [ ] T074 [US2] Implement query limit middleware in backend/subscriptions/query-limits.ts
- [ ] T075 [US2] Implement GET /subscriptions/query-usage endpoint in backend/subscriptions/usage.ts
- [ ] T076 [US2] Implement POST /subscriptions/increment-query endpoint in backend/subscriptions/usage.ts
- [ ] T077 [US2] Add query limit check to chat service middleware
- [ ] T078 [US2] Add error handling for LLM API failures in backend/chat/llm.ts

### Frontend Implementation for User Story 2

- [ ] T079 [P] [US2] Create chat page in frontend/src/routes/chat/+page.svelte
- [ ] T080 [P] [US2] Create chat page server load in frontend/src/routes/chat/+page.server.ts
- [ ] T081 [US2] Create ChatInterface component in frontend/src/lib/components/ChatInterface.svelte
- [ ] T082 [US2] Create ChatMessage component in frontend/src/lib/components/ChatMessage.svelte
- [ ] T083 [US2] Implement chat state management with $state rune in chat/+page.svelte
- [ ] T084 [US2] Add query limit indicator to chat interface
- [ ] T085 [US2] Add suggested queries UI in ChatInterface component
- [ ] T086 [US2] Add error handling for query limit exceeded in frontend/src/routes/chat/+page.svelte
- [ ] T087 [US2] Regenerate TypeScript client after chat/subscriptions endpoints

**Checkpoint**: At this point, User Story 2 should work independently - users can query portfolio with NL

---

## Phase 5: User Story 3 - Generate and Customize Dashboard Widgets (Priority: P3)

**Goal**: Users can save widgets from chat queries, arrange them on dashboard via drag-and-drop, and customize display settings

**Independent Test**: Generate widget from chat → add to dashboard → drag to reposition → verify layout persists on refresh

### Tests for User Story 3 (TDD - Write First)

- [ ] T088 [P] [US3] Unit test for widget CRUD operations in backend/widgets/crud.test.ts
- [ ] T089 [P] [US3] Unit test for dashboard layout updates in backend/widgets/dashboard.test.ts
- [ ] T090 [P] [US3] E2E test for widget creation and dashboard in frontend/tests/e2e/widgets.spec.ts
- [ ] T091 [P] [US3] Integration test for widget data execution in backend/widgets/execute.test.ts

### Database & Models for User Story 3

- [ ] T092 [P] [US3] Create migration 1_create_widgets.up.sql in backend/widgets/migrations/ (widgets table)
- [ ] T093 [P] [US3] Create migration 2_create_dashboards.up.sql in backend/widgets/migrations/ (dashboards table)
- [ ] T094 [P] [US3] Define Widget interface in backend/widgets/types.ts
- [ ] T095 [P] [US3] Define Dashboard and WidgetLayout interfaces in backend/widgets/types.ts

### Backend Implementation for User Story 3

- [ ] T096 [P] [US3] Create backend/widgets/encore.service.ts service definition
- [ ] T097 [US3] Implement POST /widgets endpoint in backend/widgets/crud.ts (create widget)
- [ ] T098 [US3] Implement GET /widgets/:id endpoint in backend/widgets/crud.ts
- [ ] T099 [US3] Implement GET /widgets endpoint in backend/widgets/crud.ts (list user widgets)
- [ ] T100 [US3] Implement PUT /widgets/:id endpoint in backend/widgets/crud.ts (update widget)
- [ ] T101 [US3] Implement DELETE /widgets/:id endpoint in backend/widgets/crud.ts
- [ ] T102 [US3] Implement widget data execution in backend/widgets/execute.ts
- [ ] T103 [US3] Implement GET /dashboard endpoint in backend/widgets/dashboard.ts
- [ ] T104 [US3] Implement PUT /dashboard endpoint in backend/widgets/dashboard.ts (save layout)
- [ ] T105 [US3] Implement POST /dashboard/add-widget endpoint in backend/widgets/dashboard.ts
- [ ] T106 [US3] Implement POST /dashboard/remove-widget endpoint in backend/widgets/dashboard.ts
- [ ] T107 [US3] Implement POST /dashboard/refresh endpoint in backend/widgets/dashboard.ts
- [ ] T108 [US3] Add validation for widget config DSL in backend/widgets/validate.ts

### Frontend Implementation for User Story 3

- [ ] T109 [P] [US3] Create ChartWidget component in frontend/src/lib/components/widgets/ChartWidget.svelte
- [ ] T110 [P] [US3] Create TableWidget component in frontend/src/lib/components/widgets/TableWidget.svelte
- [ ] T111 [P] [US3] Create CardWidget component in frontend/src/lib/components/widgets/CardWidget.svelte
- [ ] T112 [P] [US3] Create TileWidget component in frontend/src/lib/components/widgets/TileWidget.svelte
- [ ] T113 [US3] Create DashboardGrid component in frontend/src/lib/components/DashboardGrid.svelte with @dnd-kit
- [ ] T114 [US3] Update dashboard page in frontend/src/routes/dashboard/+page.svelte with drag-drop
- [ ] T115 [US3] Update dashboard server loader in frontend/src/routes/dashboard/+page.server.ts for widgets
- [ ] T116 [US3] Implement LayerCake chart rendering in ChartWidget component
- [ ] T117 [US3] Add "Save to Dashboard" button to chat query results
- [ ] T118 [US3] Implement dashboard layout persistence logic in DashboardGrid component
- [ ] T119 [US3] Add widget visibility toggle UI in DashboardGrid
- [ ] T120 [US3] Add widget refresh functionality in dashboard
- [ ] T121 [US3] Regenerate TypeScript client after widgets endpoints

**Checkpoint**: At this point, User Story 3 should work - users can create customizable dashboards

---

## Phase 6: User Story 4 - Share Widgets on Public Profile (Priority: P4)

**Goal**: Users can toggle widgets to public, view them on their public profile URL, and others can view without login

**Independent Test**: Make widget public → visit profile URL → verify widget displays → toggle private → verify widget hidden

### Tests for User Story 4 (TDD - Write First)

- [ ] T122 [P] [US4] Unit test for visibility toggle in backend/widgets/crud.test.ts
- [ ] T123 [P] [US4] Integration test for public profile generation in backend/social/profiles.test.ts
- [ ] T124 [P] [US4] E2E test for public profile viewing in frontend/tests/e2e/profile.spec.ts

### Database & Models for User Story 4

- [ ] T125 [P] [US4] Update widgets migration to add visibility column (default 'private')
- [ ] T126 [P] [US4] Create migration 1_create_profiles.up.sql in backend/social/migrations/ (profile settings)
- [ ] T127 [US4] Update users migration to add username, bio, avatar_url, follower_count fields

### Backend Implementation for User Story 4

- [ ] T128 [P] [US4] Create backend/social/encore.service.ts service definition
- [ ] T129 [US4] Update PUT /widgets/:id to support visibility toggle
- [ ] T130 [US4] Implement GET /profile/:username endpoint in backend/social/profiles.ts
- [ ] T131 [US4] Implement PUT /profile endpoint in backend/social/profiles.ts (update profile)
- [ ] T132 [US4] Implement POST /profile/upload-avatar endpoint in backend/social/profiles.ts
- [ ] T133 [US4] Add public widget filtering in GET /widgets for public profiles
- [ ] T134 [US4] Configure Encore object storage bucket for profile pictures

### Frontend Implementation for User Story 4

- [ ] T135 [P] [US4] Create public profile page in frontend/src/routes/[username]/+page.svelte
- [ ] T136 [P] [US4] Create public profile server loader in frontend/src/routes/[username]/+page.server.ts
- [ ] T137 [US4] Create ProfileHeader component in frontend/src/lib/components/ProfileHeader.svelte
- [ ] T138 [US4] Create PublicWidgetGrid component in frontend/src/lib/components/PublicWidgetGrid.svelte
- [ ] T139 [US4] Add visibility toggle to widget cards in dashboard
- [ ] T140 [US4] Create profile settings page in frontend/src/routes/settings/profile/+page.svelte
- [ ] T141 [US4] Implement profile edit form with superforms in settings/profile page
- [ ] T142 [US4] Add avatar upload UI in profile settings
- [ ] T143 [US4] Add "View Public Profile" link to dashboard
- [ ] T144 [US4] Regenerate TypeScript client after social/profile endpoints

**Checkpoint**: At this point, User Story 4 should work - users can share widgets publicly

---

## Phase 7: User Story 5 - Discover and Fork Widgets from Community (Priority: P5)

**Goal**: Users can browse trending widgets, fork them to their dashboard with one click, and original creators get notified

**Independent Test**: Visit discover page → find widget → fork to dashboard → verify appears with own portfolio data → verify creator notified

### Tests for User Story 5 (TDD - Write First)

- [ ] T145 [P] [US5] Unit test for widget fork logic in backend/widgets/fork.test.ts
- [ ] T146 [P] [US5] Integration test for fork notification in backend/social/notifications.test.ts
- [ ] T147 [P] [US5] E2E test for widget discovery and fork in frontend/tests/e2e/discover.spec.ts

### Database & Models for User Story 5

- [ ] T148 [P] [US5] Create migration 3_create_forks.up.sql in backend/widgets/migrations/ (forks table)
- [ ] T149 [P] [US5] Create migration 2_create_notifications.up.sql in backend/social/migrations/ (notifications table)
- [ ] T150 [US5] Update widgets migration to add fork_count and forked_from columns

### Backend Implementation for User Story 5

- [ ] T151 [US5] Implement POST /widgets/:id/fork endpoint in backend/widgets/fork.ts
- [ ] T152 [US5] Implement GET /widgets/:id/forks endpoint in backend/widgets/fork.ts
- [ ] T153 [US5] Implement fork notification logic in backend/widgets/fork.ts
- [ ] T154 [US5] Setup Encore PubSub topic for widget fork events in backend/widgets/events.ts
- [ ] T155 [US5] Implement fork event subscriber in backend/social/notifications.ts
- [ ] T156 [US5] Implement GET /discover/trending endpoint in backend/social/discovery.ts
- [ ] T157 [US5] Implement GET /discover/featured endpoint in backend/social/discovery.ts
- [ ] T158 [US5] Implement GET /discover/search endpoint in backend/social/discovery.ts
- [ ] T159 [US5] Implement GET /notifications endpoint in backend/social/notifications.ts
- [ ] T160 [US5] Implement PUT /notifications/:id/read endpoint in backend/social/notifications.ts
- [ ] T161 [US5] Implement POST /notifications/mark-all-read endpoint in backend/social/notifications.ts

### Frontend Implementation for User Story 5

- [ ] T162 [P] [US5] Create discover page in frontend/src/routes/discover/+page.svelte
- [ ] T163 [P] [US5] Create discover server loader in frontend/src/routes/discover/+page.server.ts
- [ ] T164 [US5] Create TrendingWidgets component in frontend/src/lib/components/TrendingWidgets.svelte
- [ ] T165 [US5] Create WidgetCard component in frontend/src/lib/components/WidgetCard.svelte with fork button
- [ ] T166 [US5] Implement fork action handler in discover page
- [ ] T167 [US5] Create notifications dropdown in +layout.svelte
- [ ] T168 [US5] Create NotificationsList component in frontend/src/lib/components/NotificationsList.svelte
- [ ] T169 [US5] Add fork attribution display to forked widgets
- [ ] T170 [US5] Add search functionality to discover page
- [ ] T171 [US5] Regenerate TypeScript client after discover/notifications endpoints

**Checkpoint**: At this point, User Story 5 should work - users can discover and fork widgets

---

## Phase 8: User Story 6 - CSV Import for Quick Start (Priority: P6)

**Goal**: Users can upload CSV file with portfolio data and use all features without Zerodha connection

**Independent Test**: Upload CSV → verify holdings imported → verify chat queries work with CSV data → verify widgets render

### Tests for User Story 6 (TDD - Write First)

- [ ] T172 [P] [US6] Unit test for CSV parsing in backend/portfolio/connectors/csv.connector.test.ts
- [ ] T173 [P] [US6] Unit test for CSV normalization in backend/portfolio/connectors/csv.connector.test.ts
- [ ] T174 [P] [US6] Integration test for CSV import flow in backend/portfolio/csv-import.test.ts
- [ ] T175 [P] [US6] E2E test for CSV upload in frontend/tests/e2e/csv-import.spec.ts

### Backend Implementation for User Story 6

- [ ] T176 [P] [US6] Create CSV connector in backend/portfolio/connectors/csv.connector.ts
- [ ] T177 [US6] Implement CSV parsing logic with validation in backend/portfolio/csv-import.ts
- [ ] T178 [US6] Implement POST /portfolio/import-csv endpoint in backend/portfolio/csv-import.ts
- [ ] T179 [US6] Implement GET /portfolio/csv-template endpoint in backend/portfolio/csv-import.ts
- [ ] T180 [US6] Add merge/replace strategy logic in CSV import
- [ ] T181 [US6] Add CSV validation error reporting
- [ ] T182 [US6] Update portfolio source tracking to distinguish Zerodha vs CSV

### Frontend Implementation for User Story 6

- [ ] T183 [P] [US6] Create CSV import page in frontend/src/routes/import/+page.svelte
- [ ] T184 [P] [US6] Create CSV import server actions in frontend/src/routes/import/+page.server.ts
- [ ] T185 [US6] Create CSVUpload component in frontend/src/lib/components/CSVUpload.svelte
- [ ] T186 [US6] Implement file upload with drag-and-drop in CSVUpload component
- [ ] T187 [US6] Add CSV template download link
- [ ] T188 [US6] Add merge/replace strategy selection UI
- [ ] T189 [US6] Add CSV validation error display
- [ ] T190 [US6] Add "Import CSV" option to onboarding flow
- [ ] T191 [US6] Regenerate TypeScript client after CSV import endpoints

**Checkpoint**: At this point, User Story 6 should work - users can import CSV data

---

## Phase 9: User Story 7 - Upgrade to Pro for Unlimited Chat Queries (Priority: P7)

**Goal**: Users can upgrade to Pro tier via payment gateway and receive unlimited chat queries immediately

**Independent Test**: Click upgrade → complete payment → verify tier updated to Pro → verify unlimited queries enabled

### Tests for User Story 7 (TDD - Write First)

- [ ] T192 [P] [US7] Unit test for subscription upgrade logic in backend/subscriptions/plans.test.ts
- [ ] T193 [P] [US7] Integration test for Razorpay webhook in backend/subscriptions/webhooks.test.ts
- [ ] T194 [P] [US7] E2E test for upgrade flow in frontend/tests/e2e/upgrade.spec.ts

### Database & Models for User Story 7

- [ ] T195 [P] [US7] Create migration 1_create_subscriptions.up.sql in backend/subscriptions/migrations/ (subscriptions table)
- [ ] T196 [US7] Update users migration to add tier column (default 'free')

### Backend Implementation for User Story 7

- [ ] T197 [US7] Implement GET /subscriptions/plans endpoint in backend/subscriptions/plans.ts
- [ ] T198 [US7] Implement GET /subscriptions/current endpoint in backend/subscriptions/current.ts
- [ ] T199 [US7] Implement POST /subscriptions/upgrade endpoint in backend/subscriptions/upgrade.ts
- [ ] T200 [US7] Implement POST /subscriptions/cancel endpoint in backend/subscriptions/cancel.ts
- [ ] T201 [US7] Implement POST /subscriptions/reactivate endpoint in backend/subscriptions/reactivate.ts
- [ ] T202 [US7] Integrate Razorpay SDK in backend/subscriptions/razorpay.ts
- [ ] T203 [US7] Implement Razorpay checkout session creation in backend/subscriptions/checkout.ts
- [ ] T204 [US7] Implement POST /subscriptions/webhooks/razorpay endpoint using api.raw()
- [ ] T205 [US7] Implement webhook signature verification in backend/subscriptions/webhooks.ts
- [ ] T206 [US7] Implement subscription activation logic in webhook handler
- [ ] T207 [US7] Implement GET /subscriptions/invoices endpoint in backend/subscriptions/invoices.ts
- [ ] T208 [US7] Update query limit middleware to bypass check for Pro tier
- [ ] T209 [US7] Add error handling for payment failures

### Frontend Implementation for User Story 7

- [ ] T210 [P] [US7] Create pricing page in frontend/src/routes/pricing/+page.svelte
- [ ] T211 [P] [US7] Create pricing page loader in frontend/src/routes/pricing/+page.server.ts
- [ ] T212 [US7] Create PricingCard component in frontend/src/lib/components/PricingCard.svelte
- [ ] T213 [US7] Implement Razorpay checkout integration in frontend
- [ ] T214 [US7] Create subscription settings page in frontend/src/routes/settings/subscription/+page.svelte
- [ ] T215 [US7] Create subscription server loader/actions in frontend/src/routes/settings/subscription/+page.server.ts
- [ ] T216 [US7] Add upgrade prompt when query limit reached
- [ ] T217 [US7] Add Pro badge to UI for Pro users
- [ ] T218 [US7] Create billing history page in frontend/src/routes/settings/billing/+page.svelte
- [ ] T219 [US7] Add cancel subscription UI with confirmation
- [ ] T220 [US7] Regenerate TypeScript client after subscriptions endpoints

**Checkpoint**: At this point, User Story 7 should work - users can upgrade to Pro tier

---

## Phase 10: Landing Page & Marketing Site

**Purpose**: Create professional landing page with Figma design system integration

**Prerequisites**: Figma design file with KiteMate landing page must be available

### Design Token Extraction with Figma MCP

- [ ] T221 [P] Connect to Figma file via Figma MCP (mcp-figma)
- [ ] T222 [P] Extract color palette from Figma design system using Figma MCP
- [ ] T223 [P] Extract typography tokens (font families, sizes, weights) using Figma MCP
- [ ] T224 [P] Extract spacing scale from Figma design using Figma MCP
- [ ] T225 [P] Extract component styles (buttons, cards, inputs) using Figma MCP
- [ ] T226 Update .claude/skills/theme-factory/themes/kitemate-finance.md with extracted tokens
- [ ] T227 [P] Export design assets (logo, icons, images) from Figma

### Theme Configuration

- [ ] T228 Create Tailwind CSS v4 theme configuration in frontend/tailwind.config.js with extracted colors
- [ ] T229 [P] Define CSS custom properties for design tokens in frontend/src/app.css
- [ ] T230 [P] Configure font loading (Google Fonts or local) based on Figma typography
- [ ] T231 [P] Setup color scheme (light/dark mode) if specified in Figma
- [ ] T232 Validate theme accessibility (WCAG AA contrast ratios)

### Landing Page Implementation

- [ ] T233 [P] Create landing page route in frontend/src/routes/+page.svelte
- [ ] T234 [P] Create Hero section component in frontend/src/lib/components/landing/Hero.svelte
- [ ] T235 [P] Create Features section component in frontend/src/lib/components/landing/Features.svelte
- [ ] T236 [P] Create Benefits section component in frontend/src/lib/components/landing/Benefits.svelte
- [ ] T237 [P] Create Pricing section component in frontend/src/lib/components/landing/Pricing.svelte
- [ ] T238 [P] Create Testimonials section component in frontend/src/lib/components/landing/Testimonials.svelte
- [ ] T239 [P] Create CTA (Call-to-Action) section component in frontend/src/lib/components/landing/CTA.svelte
- [ ] T240 [P] Create Footer component in frontend/src/lib/components/landing/Footer.svelte
- [ ] T241 Implement responsive navigation in landing page
- [ ] T242 Add smooth scroll animations using Svelte transitions
- [ ] T243 Implement mobile-responsive layout based on Figma breakpoints
- [ ] T244 Add SEO metadata in +page.svelte (title, description, Open Graph)
- [ ] T245 [P] Optimize images and assets for web performance
- [ ] T246 Add analytics tracking (optional: Plausible or Google Analytics)
- [ ] T247 Validate landing page matches Figma design pixel-perfect

### Documentation

- [ ] T248 Document theme tokens in specs/001-kitemate-mvp/theme-guide.md
- [ ] T249 Create component showcase page in frontend/src/routes/components/+page.svelte
- [ ] T250 Add Figma design file link to README.md and CLAUDE.md

---

## Phase 11: Jobs & Automation

**Purpose**: Background tasks that run automatically

- [ ] T251 [P] Create backend/jobs/encore.service.ts service definition
- [ ] T252 Create daily portfolio refresh cron job in backend/jobs/daily-refresh.ts (6 PM IST, weekdays)
- [ ] T253 Implement batch portfolio sync logic in backend/jobs/daily-refresh.ts
- [ ] T254 Create query limit reset cron job in backend/jobs/reset-limits.ts (monthly)
- [ ] T255 [P] Add error handling and retry logic for cron jobs
- [ ] T256 [P] Add logging for cron job executions
- [ ] T257 Create notification for daily refresh completion

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T258 [P] Add comprehensive error pages (404, 500) in frontend/src/routes/+error.svelte
- [ ] T259 [P] Implement rate limiting for all public endpoints via Encore middleware
- [ ] T260 [P] Add request/response logging for all API calls
- [ ] T261 [P] Implement security headers in SvelteKit hooks
- [ ] T262 [P] Add input sanitization for all user inputs
- [ ] T263 [P] Configure production CORS policy in backend/encore.app
- [ ] T264 [P] Add database connection pooling optimization
- [ ] T265 [P] Implement API response caching where appropriate
- [ ] T266 [P] Add loading states and skeleton UI across frontend
- [ ] T267 [P] Implement optimistic UI updates for common actions
- [ ] T268 [P] Add toast notifications component in frontend/src/lib/components/Toast.svelte
- [ ] T269 [P] Create comprehensive README.md with setup instructions (DONE)
- [ ] T270 [P] Create quickstart.md validation script
- [ ] T271 [P] Add accessibility improvements (ARIA labels, keyboard navigation)
- [ ] T272 [P] Implement responsive design for mobile devices
- [ ] T273 [P] Add performance monitoring with Encore built-in tracing
- [ ] T274 [P] Create deployment documentation in specs/001-kitemate-mvp/deployment.md
- [ ] T275 [P] Setup staging environment configuration
- [ ] T276 [P] Setup production environment configuration
- [ ] T277 Run constitution compliance review
- [ ] T278 Validate all 7 user stories work independently
- [ ] T279 Run full E2E test suite
- [ ] T280 Performance testing (portfolio with 500+ holdings)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - MVP starting point
- **User Story 2 (Phase 4)**: Depends on Foundational + US1 (needs portfolio data)
- **User Story 3 (Phase 5)**: Depends on Foundational + US2 (needs widgets from chat)
- **User Story 4 (Phase 6)**: Depends on Foundational + US3 (needs widgets to share)
- **User Story 5 (Phase 7)**: Depends on Foundational + US4 (needs public widgets to fork)
- **User Story 6 (Phase 8)**: Depends on Foundational (independent of other stories)
- **User Story 7 (Phase 9)**: Depends on Foundational + US2 (needs query limits to exist)
- **Landing Page (Phase 10)**: Depends on Foundational only - can run in parallel with user stories (requires Figma design file)
- **Jobs (Phase 11)**: Depends on US1 (portfolio sync), US5 (notifications)
- **Polish (Phase 12)**: Depends on all desired user stories being complete

### User Story Independence

- **US1 (Connect Zerodha)**: Completely independent after Foundational
- **US2 (Chat)**: Needs US1 for portfolio data
- **US3 (Dashboard)**: Needs US2 for widget generation
- **US4 (Public Profile)**: Needs US3 for widgets to share
- **US5 (Discover/Fork)**: Needs US4 for public widgets
- **US6 (CSV Import)**: Independent alternative to US1
- **US7 (Pro Upgrade)**: Needs US2 for query limits

### Critical Path (MVP - US1 only)

Setup (T001-T010) → Foundational (T011-T024) → US1 Tests (T025-T029) → US1 Backend (T030-T044) → US1 Frontend (T045-T055) → **VALIDATE MVP**

### Recommended Order

1. **MVP First**: Phase 1 → Phase 2 → Phase 3 (US1) → Validate
2. **Add Chat**: Phase 4 (US2) → Validate
3. **Add Dashboard**: Phase 5 (US3) → Validate
4. **Add Social**: Phase 6 (US4) + Phase 7 (US5) → Validate
5. **Add CSV & Pro**: Phase 8 (US6) + Phase 9 (US7) → Validate
6. **Automation**: Phase 10 → Phase 11 → Full validation

### Parallel Opportunities

**Within Setup (Phase 1)**:
- T003, T004, T005, T006, T007, T008, T009, T010 can all run in parallel

**Within Foundational (Phase 2)**:
- T012, T013, T014, T019, T020, T021, T022, T023 can run in parallel

**Within each User Story**:
- All tests marked [P] can run in parallel
- All database migrations marked [P] can run in parallel
- Backend and Frontend implementations can run in parallel (different files)

**Across User Stories** (if team capacity allows):
- After Foundational complete, US1 and US6 can start in parallel (independent)
- After US1 complete, US2 can start
- After US2 complete, US3 and US7 can start in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests together (write first, ensure they fail):
T025: Unit test for Zerodha OAuth token exchange
T026: Unit test for portfolio normalization
T027: Integration test for full Zerodha OAuth flow
T028: E2E test for Zerodha connection flow
T029: Integration test for portfolio sync

# Launch all migrations together:
T030: Create users table migration
T031: Create portfolios table migration
T032: Define NormalizedHolding interface
T033: Define User entity with Zerodha fields

# Launch backend and frontend in parallel:
Backend team: T034-T044 (Auth & Portfolio endpoints)
Frontend team: T045-T055 (Login, OAuth, Dashboard UI)
```

---

## Parallel Example: User Story 2

```bash
# Tests in parallel:
T056, T057, T058, T059, T060

# Migrations in parallel:
T061, T062

# Backend services in parallel:
Chat service (T064-T072)
Subscriptions service (T073-T078)

# Frontend in parallel with backend:
T079-T087 (Chat UI)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - Recommended

1. Complete Phase 1: Setup (10 tasks)
2. Complete Phase 2: Foundational (14 tasks) **CRITICAL BLOCKER**
3. Complete Phase 3: User Story 1 (31 tasks)
4. **STOP and VALIDATE**: Test Zerodha OAuth → Portfolio display
5. Deploy/demo if ready
6. **Decision Point**: Proceed to US2 or iterate on US1

### Full MVP (US1 + US2 + US3) - Complete Experience

1. Phases 1-3: US1 (Zerodha connection + portfolio)
2. Phase 4: US2 (Chat with NL queries)
3. Phase 5: US3 (Dashboard with widgets)
4. **VALIDATE**: Complete user journey works end-to-end
5. Deploy as functional MVP

### Incremental Delivery (Recommended for Production)

1. **Week 1-2**: Setup + Foundational → Foundation ready
2. **Week 3**: User Story 1 → Test independently → Deploy (MVP v0.1)
3. **Week 3-4 (Parallel)**: Landing Page (Phase 10) → Deploy marketing site
4. **Week 4-5**: User Story 2 → Test independently → Deploy (MVP v0.2)
5. **Week 6**: User Story 3 → Test independently → Deploy (MVP v0.3)
6. **Week 7**: User Story 6 (CSV) → Deploy (MVP v0.4)
7. **Week 8**: User Story 4 + 5 (Social) → Deploy (MVP v0.5)
8. **Week 9**: User Story 7 (Pro tier) + Jobs → Deploy (MVP v1.0)
9. **Week 10**: Polish + Performance → Deploy (v1.1)

**Note**: Landing Page (Phase 10) can be developed in parallel with user stories after Week 2, as it only depends on Foundational phase completion and Figma design file.

Each week delivers incremental value without breaking previous features.

### Parallel Team Strategy

With 3 developers after Foundational phase completes:

1. **Developer A**: Focus on US1 (Zerodha + Portfolio)
2. **Developer B**: Focus on US6 (CSV Import) - runs in parallel with US1
3. **Developer C**: Setup CI/CD, monitoring, documentation

Once US1 completes:
- Developer A → US2 (Chat)
- Developer B → US3 (Dashboard)
- Developer C → US4 (Public profiles)

---

## Notes

- **[P] tasks**: Different files, no dependencies - safe to parallelize
- **[Story] labels**: Map tasks to user stories for traceability
- **TDD Approach**: Tests written FIRST for critical paths (auth, sync, NL→DSL, fork)
- **Coverage Target**: 50-60% (behavior-focused, not implementation)
- **Constitution Compliance**: All tasks must follow the 7 principles
- **Independent Stories**: Each user story should be completable and testable independently
- **MVP Validation**: Stop after US1 to validate core value proposition
- **Incremental Delivery**: Each story adds value without breaking previous ones
- **Commit Frequency**: After each task or logical group for rollback safety
- **Client Generation**: Run after backend endpoint changes (marked in tasks)

**Total Tasks**: 280 tasks
- Phase 1 (Setup): 10 tasks
- Phase 2 (Foundational): 14 tasks
- Phase 3 (US1): 31 tasks
- Phase 4 (US2): 32 tasks
- Phase 5 (US3): 33 tasks
- Phase 6 (US4): 23 tasks
- Phase 7 (US5): 27 tasks
- Phase 8 (US6): 20 tasks
- Phase 9 (US7): 29 tasks
- Phase 10 (Landing Page): 30 tasks
- Phase 11 (Jobs): 7 tasks
- Phase 12 (Polish): 23 tasks

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (US1 only) = 55 tasks for functional MVP
**Full Featured MVP**: Phases 1-5 (US1, US2, US3) = 120 tasks for complete user experience
**With Landing Page**: Add Phase 10 (30 tasks) for marketing site with Figma design integration

