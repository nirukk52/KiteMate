# Setup Checklist

Use this checklist when setting up a new Encore + SvelteKit project.

---

## Phase 0: Pre-Setup (5 min)

### Prerequisites
- [ ] Node.js 20+ installed (`node --version`)
- [ ] npm 10+ installed (`npm --version`)
- [ ] Encore CLI installed (`encore version`)
- [ ] go-task installed (`task --version`)
- [ ] Git installed (optional but recommended)

### Cloud Setup
- [ ] Encore account created (https://app.encore.dev/)
- [ ] New app created in Encore console
- [ ] App ID noted (e.g., `myapp-x9z2`)
- [ ] Encore MCP connected to app ID (optional, for debugging)

---

## Phase 1: Project Setup (3 min)

### Using This Skill (Recommended)
- [ ] Run: `@encore-sveltekit-setup Initialize "ProjectName" with app ID "your-app-id"`
- [ ] Wait for setup to complete
- [ ] Verify structure created (`ls backend frontend`)

### Manual Setup (Alternative)
- [ ] Create directory structure
- [ ] Copy templates from `.claude/skills/encore-sveltekit-setup/templates/`
- [ ] Run `npm install` in backend/
- [ ] Run `npm install` in frontend/

---

## Phase 2: Configuration (2 min)

### Backend Configuration
- [ ] Update `backend/encore.app` with correct app ID
- [ ] Verify `backend/go.mod` exists
- [ ] Generate JWT_SECRET: `openssl rand -hex 32`
- [ ] Generate ENCRYPTION_KEY: `openssl rand -hex 32`
- [ ] Copy `backend/.env.example` to `backend/.env`
- [ ] Fill in `.env` with generated secrets
- [ ] Add any API keys needed for your app

### Frontend Configuration
- [ ] Copy `frontend/.env.local.example` to `frontend/.env.local`
- [ ] Set `VITE_API_URL=http://localhost:4000` (or your backend URL)
- [ ] Verify `frontend/postcss.config.js` exists
- [ ] Verify `frontend/tailwind.config.js` exists

---

## Phase 3: Verification (2 min)

### Structure Verification
- [ ] `backend/` directory exists
- [ ] `backend/auth/` directory exists
- [ ] `backend/shared/` directory exists
- [ ] `frontend/src/` directory exists
- [ ] `Taskfile.yml` exists at root
- [ ] `verify-setup.sh` exists at root

### Configuration Verification
```bash
# Run all checks
./verify-setup.sh

# Should see all ✅:
# ✅ Backend structure
# ✅ Frontend structure
# ✅ Dependencies installed
# ✅ TypeScript compiles
# ✅ Svelte compiles
# ✅ Environment files exist
```

### Manual Verification
- [ ] Backend TypeScript compiles: `cd backend && npx tsc --noEmit`
- [ ] Frontend Svelte compiles: `cd frontend && npx svelte-check`
- [ ] Encore app ID matches cloud: `cat backend/encore.app | grep '"id"'`
- [ ] Tailwind version is v3: `grep tailwindcss frontend/package.json`
- [ ] PostCSS config exists: `ls frontend/postcss.config.js`

---

## Phase 4: First Run (1 min)

### Start Servers
- [ ] Run: `task dev` (starts both backend and frontend)
- [ ] Or separately:
  - [ ] Terminal 1: `task dev:backend` (waits for compile)
  - [ ] Terminal 2: `task dev:frontend` (waits for Vite)

### Verify Running
- [ ] Backend accessible: `curl http://localhost:4000/auth/health`
- [ ] Backend returns: `{"status":"ok","service":"auth",...}`
- [ ] Frontend accessible: Open http://localhost:5173
- [ ] Frontend renders: See "Welcome to [YourApp]"
- [ ] No console errors in browser
- [ ] No compilation errors in terminals

---

## Phase 5: Development Setup (Optional)

### TypeScript Client Generation
- [ ] Run: `task gen:client` (generates frontend API client)
- [ ] Verify: `ls frontend/src/lib/api/encore-client.ts`
- [ ] Or watch mode: `task gen:client:watch` (auto-regenerates)

### Database Setup (If Needed)
- [ ] Create migrations: `mkdir backend/myservice/migrations`
- [ ] Write migration SQL: `1_create_table.up.sql`
- [ ] Run migrations: `task db:reset` or restart backend

### IDE Setup
- [ ] TypeScript language server running
- [ ] Svelte extension enabled
- [ ] ESLint extension enabled
- [ ] Prettier extension enabled

---

## Phase 6: Critical Gotchas Check (1 min)

### Backend Gotchas
- [ ] ✅ `encore.app` has correct cloud app ID (no 404 errors)
- [ ] ✅ `go.mod` exists (Encore requirement)
- [ ] ✅ Auth middleware uses `userID` not `userId`
- [ ] ✅ `Header` imported from `encore.dev/api`
- [ ] ✅ Error details logged separately (not in constructor)
- [ ] ✅ Package versions match tested ones

### Frontend Gotchas
- [ ] ✅ Tailwind v3.4.1 not v4 (beta has issues)
- [ ] ✅ PostCSS config exists (required for Tailwind v3)
- [ ] ✅ Layout uses `{@render children()}` not `<slot />`
- [ ] ✅ Vite config imports from `vitest/config`
- [ ] ✅ No custom paths in tsconfig.json
- [ ] ✅ CSS uses `@tailwind` directives not `@import`

### DevOps Gotchas
- [ ] ✅ Taskfile descriptions with colons are quoted
- [ ] ✅ Port cleanup commands available
- [ ] ✅ Environment templates exist (not real .env in git)

---

## Phase 7: First Feature (Optional Test)

### Create Test Service
- [ ] Create: `backend/test/encore.service.ts`
- [ ] Create: `backend/test/test.ts` with simple endpoint
- [ ] Restart backend
- [ ] Test: `curl http://localhost:4000/test/hello`

### Create Test Component
- [ ] Create: `frontend/src/lib/components/TestComponent.svelte`
- [ ] Import in: `frontend/src/routes/+page.svelte`
- [ ] Verify renders in browser

### Connect Backend to Frontend
- [ ] Generate client: `task gen:client`
- [ ] Import in component: `import { api } from '$lib/api/client'`
- [ ] Call endpoint: `const result = await api.test.hello()`
- [ ] Verify data displays

---

## Common Issues & Fixes

### Backend Won't Start
**Issue**: `app_not_found` error  
**Check**: [ ] App ID matches cloud: `cat backend/encore.app`  
**Fix**: Update `backend/encore.app` with correct ID

**Issue**: `go.mod not found`  
**Check**: [ ] File exists: `ls backend/go.mod`  
**Fix**: Create from template or run setup again

**Issue**: TypeScript errors  
**Check**: [ ] Run: `cd backend && npx tsc --noEmit`  
**Fix**: Review errors, check imports and types

### Frontend Won't Start
**Issue**: PostCSS errors  
**Check**: [ ] Config exists: `ls frontend/postcss.config.js`  
**Fix**: Create config with tailwindcss + autoprefixer

**Issue**: Tailwind not working  
**Check**: [ ] Version: `grep tailwindcss frontend/package.json`  
**Fix**: Downgrade to v3.4.1 if on v4

**Issue**: Svelte errors  
**Check**: [ ] Run: `cd frontend && npx svelte-check`  
**Fix**: Use Svelte 5 runes syntax

### Ports Already in Use
**Issue**: Can't bind to port  
**Check**: [ ] Processes: `lsof -ti:4000` or `lsof -ti:5173`  
**Fix**: Kill processes: `lsof -ti:PORT | xargs kill -9`

---

## Success Criteria

Project is ready when ALL are ✅:

### Infrastructure
- [X] Both servers start without errors
- [X] Health endpoints respond
- [X] Frontend renders in browser
- [X] No TypeScript compilation errors
- [X] No Svelte compilation errors
- [X] All environment files configured

### Development
- [X] `task --list` shows all commands
- [X] `task gen:client` generates client
- [X] Hot reload works (save → refresh → see changes)
- [X] Database accessible (if using)
- [X] Logs visible and readable

### Code Quality
- [X] ESLint runs: `task lint`
- [X] Prettier formats: `task format`
- [X] Tests run: `task test` (even if no tests yet)

### Documentation
- [X] README.md exists
- [X] Environment example files exist
- [X] Setup instructions clear
- [X] Gotchas documented

---

## Next Steps After Setup

1. **Plan Features**: Review specs, user stories
2. **Use Agents**: 
   - `@encore-backend-developer` for backend services
   - `@svelte-frontend-developer` for UI components
   - `@encore-svelte-integration` for connecting them
3. **Build Incrementally**: One feature at a time
4. **Test Continuously**: Use `task test` frequently
5. **Commit Often**: Small, focused commits

---

## Time Estimates

- **Phase 0-3** (Pre-setup, Setup, Config, Verify): **10 minutes**
- **Phase 4** (First Run): **2 minutes**
- **Phase 5** (Dev Setup): **3 minutes**
- **Phase 6** (Gotchas Check): **1 minute**
- **Phase 7** (First Feature): **10 minutes**

**Total**: ~25 minutes from zero to first feature! ⚡

---

**Use this checklist every time you start a new project to ensure nothing is missed.**

✅ **All items checked** = Ready to build! 🚀

