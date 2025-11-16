# KiteMate MVP - Quick Start Guide

**Branch**: `001-kitemate-mvp` | **Date**: 2025-11-16

Get KiteMate running locally in under 10 minutes.

---

## Prerequisites

- **Node.js** 20+ (with npm)
- **Go** 1.21+ (for go-task/task runner)
- **PostgreSQL** (or use Encore's built-in dev database)
- **Git**

Optional but recommended:
- **Zerodha Kite Connect API credentials** ([kite.trade/connect](https://kite.trade/connect))
- **OpenAI API key** (for chat NLP features)

---

## 1. Clone & Install

```bash
# Clone repository
git clone <repo-url>
cd KiteMate

# Checkout feature branch
git checkout 001-kitemate-mvp

# Install task runner (if not installed)
go install github.com/go-task/task/v3/cmd/task@latest

# Install Encore CLI
curl -L https://encore.dev/install.sh | bash

# Install frontend dependencies
cd frontend && npm install && cd ..
```

---

## 2. Environment Setup

### Backend (.env or Encore secrets)

```bash
# Set Encore secrets (production-safe)
cd backend

encore secret set --dev ZERODHA_API_KEY
encore secret set --dev ZERODHA_API_SECRET
encore secret set --dev LLM_API_KEY
encore secret set --dev JWT_SECRET
encore secret set --dev RAZORPAY_KEY_ID
encore secret set --dev RAZORPAY_SECRET
```

Or use `.env` file for development:

```bash
# backend/.env
ZERODHA_API_KEY=your_kite_api_key
ZERODHA_API_SECRET=your_kite_secret
LLM_API_KEY=sk-your_openai_key
JWT_SECRET=your_random_secret_min_32_chars
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_SECRET=xxx
FREE_TIER_QUERY_LIMIT=50
NODE_ENV=development
```

### Frontend (.env.local)

```bash
# frontend/.env.local
VITE_ENCORE_API_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=rzp_test_xxx
PUBLIC_APP_URL=http://localhost:5173
```

---

## 3. Database Setup

Encore automatically creates PostgreSQL databases. Reset and run migrations:

```bash
cd backend

# Reset databases (creates fresh schema)
encore db reset

# Alternatively, run migrations manually
encore db shell portfolio  # Access portfolio DB
encore db shell users      # Access users DB
```

Verify databases are created:

```bash
encore db list
```

Expected output:
```
- portfolio
- users
- widgets
- social
- subscriptions
```

---

## 4. Start Development Environment

### Option A: Using Task Runner (Recommended)

```bash
# From project root
task dev
```

This runs:
- Backend (`encore run`) on `http://localhost:4000`
- Frontend (`npm run dev`) on `http://localhost:5173`
- Client generation watcher (auto-updates TypeScript client)

### Option B: Manual Start

```bash
# Terminal 1: Backend
cd backend
encore run

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Client generation (watch mode)
encore gen client typescript \
  --output=../frontend/src/lib/api/encore-client.ts \
  --watch
```

---

## 5. Verify Installation

### Backend Health Check

```bash
curl http://localhost:4000/health
# Expected: {"status": "ok"}
```

### Encore Dev Dashboard

Open [http://localhost:9400](http://localhost:9400) to access:
- API Explorer (test endpoints)
- Database viewer
- Traces and logs
- Service map

### Frontend

Open [http://localhost:5173](http://localhost:5173) and verify home page loads.

---

## 6. Test Zerodha Integration (Optional)

If you have Zerodha API credentials:

1. Navigate to [http://localhost:5173/login](http://localhost:5173/login)
2. Click "Connect Zerodha Account"
3. Complete OAuth flow
4. Return to app → verify portfolio data displays

**Note**: Without Zerodha credentials, you can still use CSV import to test features.

---

## 7. Test Chat Feature

### Using Zerodha MCP Server (No API Keys Needed)

For quick prototyping without Zerodha API keys:

```bash
# Test MCP server integration
npx mcp-remote https://mcp.kite.trade/mcp
```

This gives you access to Zerodha data via MCP tools for testing chat features.

### With OpenAI API Key

1. Navigate to [http://localhost:5173/chat](http://localhost:5173/chat)
2. Type: "What's my portfolio allocation by sector?"
3. Verify widget is generated with chart/table

---

## 8. Run Tests

```bash
# Backend unit tests
task test:unit

# Frontend E2E tests (Playwright)
task test:e2e

# All tests
task test
```

---

## 9. Common Tasks

### Generate TypeScript Client

```bash
cd backend
encore gen client typescript \
  --output=../frontend/src/lib/api/encore-client.ts
```

### Reset Database

```bash
cd backend
encore db reset
```

### View Logs

```bash
# Backend logs (Encore CLI)
encore logs

# Frontend logs (Vite dev server)
# Visible in terminal running npm run dev
```

### Access Database Shell

```bash
# PostgreSQL shell for specific database
encore db shell portfolio

# Connection string for external tools
encore db conn-uri portfolio
```

---

## 10. Available Taskfile Commands

```bash
task --list
```

Common tasks:
- `task dev` - Run full dev environment
- `task backend:run` - Backend only
- `task frontend:run` - Frontend only
- `task gen:watch` - Watch client generation
- `task db:reset` - Reset all databases
- `task test:unit` - Backend unit tests
- `task test:e2e` - Frontend E2E tests
- `task deploy:staging` - Deploy to staging

---

## Troubleshooting

### "Command not found: encore"

Install Encore CLI:

```bash
curl -L https://encore.dev/install.sh | bash
source ~/.bashrc  # or ~/.zshrc
```

### "Port 4000 already in use"

Kill process on port 4000:

```bash
lsof -ti:4000 | xargs kill -9
```

### "Database connection failed"

Ensure PostgreSQL is running or let Encore handle it:

```bash
encore db reset  # Creates databases automatically
```

### "Frontend can't connect to backend"

Verify `VITE_ENCORE_API_URL` in `frontend/.env.local` matches backend URL:

```bash
# Should be http://localhost:4000
echo $VITE_ENCORE_API_URL
```

### "TypeScript client types mismatch"

Regenerate client after backend changes:

```bash
cd backend
encore gen client typescript \
  --output=../frontend/src/lib/api/encore-client.ts
```

---

## Next Steps

1. **Read the spec**: [`specs/001-kitemate-mvp/spec.md`](./spec.md)
2. **Review data model**: [`specs/001-kitemate-mvp/data-model.md`](./data-model.md)
3. **Explore API contracts**: [`specs/001-kitemate-mvp/contracts/`](./contracts/)
4. **Check implementation plan**: [`specs/001-kitemate-mvp/plan.md`](./plan.md)
5. **Start implementing**: Follow TDD approach from constitution

---

## Useful Links

- **Encore Docs**: [encore.dev/docs](https://encore.dev/docs)
- **SvelteKit Docs**: [kit.svelte.dev](https://kit.svelte.dev)
- **Zerodha Kite Connect**: [kite.trade/docs/connect](https://kite.trade/docs/connect)
- **Zerodha MCP Server**: [github.com/zerodha/kite-mcp-server](https://github.com/zerodha/kite-mcp-server)
- **LayerCake Charts**: [layercake.graphics](https://layercake.graphics)

---

**Questions?** Check the [constitution](/.specify/memory/constitution.md) for development principles or open a GitHub issue.

