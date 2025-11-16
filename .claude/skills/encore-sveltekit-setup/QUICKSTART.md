# Quick Start Guide

Get from zero to running app in < 10 minutes.

---

## Prerequisites (5 min)

### 1. Install Tools
```bash
# Check what you have
node --version  # Need 20+
npm --version   # Need 10+
encore version  # Need Encore CLI

# Install missing tools
brew install go-task/tap/go-task  # For Taskfile
# For Encore: https://encore.dev/docs/install
```

### 2. Create Encore App in Console
1. Visit https://app.encore.dev/
2. Click "Create App"
3. Note your app ID (e.g., `myapp-x9z2`)

---

## Setup (3 min)

### Option A: Use This Skill (Recommended)
```bash
# In Cursor/Claude:
@encore-sveltekit-setup Initialize "MyApp" with app ID "myapp-x9z2"

# Skill will:
# ✅ Create entire project structure
# ✅ Install all dependencies  
# ✅ Configure everything correctly
# ✅ Apply all gotcha fixes
```

### Option B: Manual Setup
```bash
# 1. Create directories
mkdir -p backend/auth/migrations backend/shared
mkdir -p frontend/src/{routes,lib/api}

# 2. Copy templates from this skill
cp .claude/skills/encore-sveltekit-setup/templates/* ./

# 3. Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

---

## Configure (2 min)

### 1. Environment Variables
```bash
# Generate secrets
openssl rand -hex 32  # Copy for JWT_SECRET
openssl rand -hex 32  # Copy for ENCRYPTION_KEY

# Create env files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Edit backend/.env
# - Set JWT_SECRET=<generated secret>
# - Set ENCRYPTION_KEY=<generated key>
# - Add your API keys
```

### 2. Verify Setup
```bash
./verify-setup.sh

# Should show all ✅
# ✓ backend/
# ✓ frontend/
# ✓ node_modules installed
# ✓ TypeScript compiles
# ✓ .env files exist
```

---

## Run (30 sec)

```bash
# Start everything
task dev

# Or individually:
# Terminal 1: task dev:backend  (port 4000)
# Terminal 2: task dev:frontend (port 5173)
```

### Verify It's Working
```bash
# Test backend health
curl http://localhost:4000/auth/health
# {"status":"ok","service":"auth","timestamp":"..."}

# Open frontend
open http://localhost:5173
```

---

## Next Steps

### 1. Add Your First Service
```bash
# In Cursor/Claude:
@encore-backend-developer Create a "todos" service with CRUD endpoints

# Generates:
# backend/todos/
# ├── encore.service.ts
# ├── todos.ts
# ├── db.ts
# └── migrations/
```

### 2. Create Frontend Component
```bash
@svelte-frontend-developer Create a TodoList component

# Generates:
# frontend/src/lib/components/TodoList.svelte
```

### 3. Connect Them
```bash
# Generate TypeScript client
task gen:client

# In Cursor/Claude:
@encore-svelte-integration Connect TodoList to todos API
```

---

## Common Tasks

```bash
# Development
task dev                 # Start everything
task gen:client          # Generate TypeScript client
task gen:client:watch    # Auto-generate on changes

# Database
task db:reset            # Reset databases
task db:shell -- todos   # PostgreSQL shell

# Code Quality
task lint                # Lint code
task format              # Format code
task test                # Run tests

# Deployment
task deploy:staging      # Deploy to staging
task deploy:prod         # Deploy to production

# See all commands
task --list
```

---

## Troubleshooting

### Backend Won't Start
```bash
# Check app ID
cat backend/encore.app | grep '"id"'
# Should match cloud app ID

# Check TypeScript
cd backend && npx tsc --noEmit
# Should: 0 errors

# Check go.mod exists
ls backend/go.mod
# Should exist

# Reset and try again
task db:reset
task dev:backend
```

### Frontend Won't Start
```bash
# Check Svelte
cd frontend && npx svelte-check
# Should: 0 errors

# Check PostCSS config
ls frontend/postcss.config.js
# Should exist

# Check Tailwind version
grep tailwindcss frontend/package.json
# Should: "^3.4.1" (not ^4)

# Clear cache
rm -rf frontend/.svelte-kit
task dev:frontend
```

### Port Already in Use
```bash
# Kill processes
lsof -ti:4000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend

# Restart
task dev
```

---

## Getting Help

1. **Check GOTCHAS.md** - All known issues and fixes
2. **Check agent files** - Patterns and examples
3. **Run verification**: `./verify-setup.sh`
4. **Check docs**:
   - Encore: https://encore.dev/docs
   - SvelteKit: https://kit.svelte.dev/docs
   - Svelte 5: https://svelte.dev/docs/svelte/overview

---

## Success Checklist

You're ready to build when:

- [X] `task dev` starts both servers
- [X] Health endpoints respond
- [X] Frontend shows in browser
- [X] TypeScript compiles (0 errors)
- [X] Tailwind styles working
- [X] `./verify-setup.sh` all ✅

---

**Time**: Setup 10 min → First feature 20 min → Deploy 5 min = **35 minutes** to production! 🚀

