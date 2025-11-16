# KiteMate - Personal Finance Companion for Zerodha Users

**Status**: 🚧 MVP Development (Branch: `001-kitemate-mvp`)

KiteMate is a personal finance companion that enables Zerodha users to connect their accounts, query portfolios using natural language, create customizable dashboards with drag-and-drop widgets, and share insights on public profiles.

## ✨ Features

### 🔐 Secure Account Connection
- OAuth integration with Zerodha Kite Connect
- Encrypted token storage
- Automatic daily portfolio sync

### 💬 Natural Language Portfolio Queries
- Ask questions like "What's my P&L this month?" or "Show sector allocation"
- AI-powered query interpretation (OpenAI GPT-4o)
- Automatic widget generation (charts, tables, cards)
- Query limits: 50/month (Free tier) | Unlimited (Pro tier)

### 📊 Customizable Dashboards
- Drag-and-drop widget arrangement
- Multiple visualization types (line, bar, pie, tables)
- Private and public widget visibility
- Automatic daily data refresh

### 🌐 Social Discovery
- Public profiles with shareable widgets
- Fork widgets to your own dashboard
- Trending widgets discovery
- Follow other users

### 📥 CSV Import
- Import portfolio data manually
- Merge or replace strategies
- Support for historical data

### 💳 Pro Subscription
- Unlimited natural language queries
- Advanced query types
- Priority support
- Razorpay/Stripe payment processing

---

## 🏗️ Architecture

### Tech Stack

**Backend (Encore.ts Microservices)**
- TypeScript 5.3+ on Node.js 20+
- 7 services: auth, portfolio, chat, widgets, social, subscriptions, jobs
- PostgreSQL with JSONB for flexible schema
- Redis caching
- OpenAI API for NLP
- Zerodha Kite Connect SDK

**Frontend (SvelteKit 2 + Svelte 5)**
- Svelte 5 with runes ($state, $derived, $props)
- Tailwind CSS v4 with KiteMate Finance theme
- LayerCake for charts
- @dnd-kit for drag-and-drop
- Type-safe Encore-generated client
- Figma design system integration

**Infrastructure**
- Encore Cloud (or AWS/GCP)
- PostgreSQL (via Encore sqldb)
- Redis cache
- Object storage for avatars

### Core Principles

1. **Single Normalized Portfolio Schema** - One source of truth regardless of data source
2. **Connector-Agnostic** - Business logic independent of broker APIs
3. **NL → DSL → Data Pipeline** - Validated DSL layer between natural language and database
4. **Test-Driven Development** - Tests written first for critical paths
5. **50-60% Test Coverage** - Focus on behavior, not implementation details

See [constitution](.specify/memory/constitution.md) for full development principles.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Go 1.21+ (for task runner)
- PostgreSQL (or use Encore's built-in)
- [Encore CLI](https://encore.dev)

### Installation

```bash
# Clone and checkout feature branch
git clone <repo-url>
cd KiteMate
git checkout 001-kitemate-mvp

# Install dependencies
npm install -g @taskfile/task  # or: go install github.com/go-task/task/v3/cmd/task@latest
curl -L https://encore.dev/install.sh | bash

# Install frontend deps
cd frontend && npm install && cd ..
```

### Configuration

```bash
# Set Encore secrets
cd backend
encore secret set --dev ZERODHA_API_KEY
encore secret set --dev ZERODHA_API_SECRET
encore secret set --dev LLM_API_KEY
encore secret set --dev JWT_SECRET
encore secret set --dev RAZORPAY_KEY_ID
encore secret set --dev RAZORPAY_SECRET
```

Or create `backend/.env`:
```bash
ZERODHA_API_KEY=your_key
ZERODHA_API_SECRET=your_secret
LLM_API_KEY=sk-your_openai_key
JWT_SECRET=your_random_secret_min_32_chars
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_SECRET=xxx
```

### Run Development Environment

```bash
# Start everything (backend, frontend, client generation)
task dev

# Or manually:
# Terminal 1: Backend
cd backend && encore run

# Terminal 2: Frontend  
cd frontend && npm run dev

# Terminal 3: Client generation watcher
encore gen client typescript --output=../frontend/src/lib/api/encore-client.ts --watch
```

**Access**:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:4000](http://localhost:4000)
- Encore Dev Dashboard: [http://localhost:9400](http://localhost:9400)

### Quick Test with Zerodha MCP Server

No API keys needed for prototyping:

```bash
npx mcp-remote https://mcp.kite.trade/mcp
```

This provides test access to Zerodha data via [Kite MCP Server](https://github.com/zerodha/kite-mcp-server).

---

## 📚 Documentation

### For Developers

- **[Quick Start Guide](specs/001-kitemate-mvp/quickstart.md)** - Get running in 10 minutes
- **[Implementation Plan](specs/001-kitemate-mvp/plan.md)** - Complete technical plan
- **[Implementation Tasks](specs/001-kitemate-mvp/tasks.md)** - 280 tasks organized by user story
- **[Data Model](specs/001-kitemate-mvp/data-model.md)** - Database schema & entities
- **[API Contracts](specs/001-kitemate-mvp/contracts/)** - TypeScript service contracts
- **[Research & Decisions](specs/001-kitemate-mvp/research.md)** - Technology choices
- **[Theme Guide](.claude/skills/theme-factory/themes/kitemate-finance.md)** - KiteMate Finance design theme

### For Product

- **[Feature Specification](specs/001-kitemate-mvp/spec.md)** - User stories, requirements, success criteria
- **[High-Level Plan](specs/001-kitemate-mvp/high-level-plan)** - Architecture overview
- **[Constitution](.specify/memory/constitution.md)** - Development principles & governance

### Agent Documentation & Skills

- **[Encore Backend Developer](.claude/agents/encore-backend-developer.md)** - Backend specialist
- **[Svelte Frontend Developer](.claude/agents/svelte-frontend-developer.md)** - Frontend specialist
- **[Encore-Svelte Integration](.claude/agents/encore-svelte-integration.md)** - Full-stack integration
- **[Theme Factory](.claude/skills/theme-factory/SKILL.md)** - Professional theming with KiteMate Finance theme

---

## 🧪 Testing

```bash
# Backend unit tests
task test:unit

# Frontend E2E tests (Playwright)
task test:e2e

# All tests
task test

# With coverage
task test:coverage
```

**Test Coverage Targets**:
- Minimum: 50%
- Maximum: 60% (focus on meaningful behavior tests)
- Critical paths: Auth, portfolio sync, DSL pipeline, widget fork

---

## 📦 Project Structure

```
KiteMate/
├── backend/                  # Encore.ts microservices
│   ├── auth/                # Authentication & Zerodha OAuth
│   ├── portfolio/           # Portfolio sync, CSV import
│   ├── chat/                # NLP queries, DSL generation
│   ├── widgets/             # Widget CRUD, fork logic
│   ├── social/              # Profiles, discovery, follows
│   ├── subscriptions/       # Pro tier, payment processing
│   ├── jobs/                # Cron jobs (daily refresh)
│   └── shared/              # Shared types, utilities
├── frontend/                 # SvelteKit application
│   ├── src/
│   │   ├── routes/          # File-based routing
│   │   ├── lib/
│   │   │   ├── api/         # Generated Encore client
│   │   │   ├── components/  # Svelte components
│   │   │   └── stores/      # State management
│   │   └── app.css          # Tailwind entry
│   └── tests/e2e/           # Playwright tests
├── specs/                    # Feature specifications
│   └── 001-kitemate-mvp/    # Current MVP spec
├── .claude/                  # AI agent configurations
├── .specify/                 # Spec-driven workflow
├── Taskfile.yml             # Task automation
└── README.md                # This file
```

---

## 🔧 Development Workflow

### Using Taskfile

```bash
task --list                  # Show all tasks
task dev                     # Run full dev environment
task db:reset                # Reset databases
task gen:client              # Generate TypeScript client
task deploy:staging          # Deploy to staging
```

### Common Operations

**Generate TypeScript Client**:
```bash
encore gen client typescript --output=frontend/src/lib/api/encore-client.ts
```

**Database Operations**:
```bash
encore db shell portfolio    # PostgreSQL shell
encore db reset              # Reset all databases
encore db conn-uri portfolio # Get connection string
```

**View Logs**:
```bash
encore logs                  # Backend logs
encore trace                 # Request traces
```

---

## 🚢 Deployment

```bash
# Deploy to staging
task deploy:staging

# Deploy to production (after approval)
encore deploy --env prod
```

**Environments**:
- **Development**: Local (localhost:4000, localhost:5173)
- **Staging**: Encore Cloud staging environment
- **Production**: Encore Cloud production environment

---

## 🤝 Contributing

### Development Principles

1. **Test-Driven Development**: Write tests first for critical paths
2. **Constitution Compliance**: All PRs must pass constitutional principles
3. **Type Safety**: Use TypeScript strictly, no `any` types
4. **Documentation**: Update specs when changing behavior
5. **Simplicity**: Follow YAGNI - no premature optimization

### Workflow

1. Create feature branch from `001-kitemate-mvp`
2. Run `/speckit.specify` for major features
3. Write tests before implementation
4. Run `task test` before committing
5. Generate TypeScript client after backend changes
6. Submit PR with constitutional compliance verification

### Code Review Checklist

- [ ] Tests pass (`task test`)
- [ ] Type-safe (no `any` types)
- [ ] Constitutional principles followed
- [ ] Documentation updated
- [ ] No hardcoded secrets
- [ ] Error handling implemented
- [ ] API contracts match implementation

---

## 🔒 Security

- **Secrets Management**: All secrets via Encore's `secret()` function
- **Token Encryption**: Zerodha tokens encrypted at rest (AES-256)
- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: Encore middleware enforces query limits
- **CORS**: Restricted to frontend domain only
- **Audit Logs**: All DSL operations logged for compliance

### Reporting Security Issues

Email security issues to: [security@kitemate.com] (Do not open public issues)

---

## 📊 Monitoring & Observability

**Built-in (Encore)**:
- Request traces and logs
- Database query performance
- Service health metrics
- Error tracking

**Custom Metrics**:
- Portfolio sync success rate
- Chat query accuracy
- Widget fork counts
- Payment conversion rate

**Invariants Monitored**:
- Portfolio value ≥ 0
- DSL validation before execution
- Connector schema compliance
- Query limits respected

---

## 📄 License

[TBD - Add license here]

---

## 🙏 Acknowledgments

- **[Zerodha](https://zerodha.com)** - Kite Connect API
- **[Encore](https://encore.dev)** - Backend framework
- **[Svelte](https://svelte.dev)** - Frontend framework
- **[OpenAI](https://openai.com)** - NLP capabilities

### Open Source Dependencies

**Backend**:
- [envalid](https://github.com/af/envalid) - Environment validation
- [kiteconnect](https://www.npmjs.com/package/kiteconnect) - Zerodha SDK
- [jose](https://github.com/panva/jose) - JWT handling
- [zod](https://github.com/colinhacks/zod) - Schema validation

**Frontend**:
- [@dnd-kit](https://dndkit.com) - Drag and drop
- [LayerCake](https://layercake.graphics) - Charts
- [superforms](https://superforms.rocks) - Form handling
- [Tailwind CSS](https://tailwindcss.com) - Styling

**Tooling**:
- [go-task](https://taskfile.dev) - Task automation

---

## 📞 Support

- **Documentation**: [specs/001-kitemate-mvp/](specs/001-kitemate-mvp/)
- **Issues**: [GitHub Issues](https://github.com/your-org/kitemate/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/kitemate/discussions)

---

## 🗺️ Roadmap

### V1 (MVP) - Current
- [x] Zerodha OAuth integration
- [x] Natural language portfolio queries
- [x] Customizable dashboards
- [x] Social widget sharing
- [x] CSV import
- [x] Pro subscription (unlimited queries)
- [ ] Implementation in progress...

### V2 (Planned)
- [ ] Multi-broker support (Upstox, Angel One)
- [ ] Real-time portfolio updates
- [ ] Mobile applications (iOS, Android)
- [ ] Advanced analytics (backtesting, risk modeling)
- [ ] Portfolio recommendations
- [ ] Tax optimization tools

### V3 (Future)
- [ ] Automated trading strategies
- [ ] Social trading features
- [ ] API for third-party developers
- [ ] WhatsApp bot integration

---

**Built with ❤️ for Indian retail investors**

