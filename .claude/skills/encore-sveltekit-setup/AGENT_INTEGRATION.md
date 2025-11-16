# Agent Integration Guide

How AI agents should use this skill to set up Encore + SvelteKit projects.

---

## For Agent Developers

This skill is designed to work **proactively** with your existing agents.

### Integration Pattern

```
User Request → Setup Skill → Agent-Specific Work
     ↓              ↓                 ↓
  "Build X"    Structure       Feature Dev
               Templates        API + UI
               Config           Testing
```

---

## Usage by Agent Type

### 1. Backend Developer Agent

**When to use this skill**:
- User starts new project
- User says "set up backend"
- New service architecture needed

**After skill runs**:
```typescript
// You'll have:
backend/
├── encore.app           // ✅ Configured
├── go.mod               // ✅ Required file
├── auth/                // ✅ Boilerplate ready
│   ├── middleware.ts    // ✅ Auth handler
│   └── health.ts        // ✅ Example endpoint
└── shared/              // ✅ Utilities ready
    ├── types.ts
    ├── errors.ts
    └── env.ts

// Start creating services immediately:
@encore-backend-developer Create portfolio service with CRUD
```

**What you DON'T need to do**:
- ❌ Set up TypeScript config
- ❌ Configure error handling
- ❌ Write auth middleware
- ❌ Set up environment validation
- ❌ Fix known gotchas

**What you DO need to do**:
- ✅ Create business logic services
- ✅ Write database migrations
- ✅ Define API contracts
- ✅ Implement features

### 2. Frontend Developer Agent

**When to use this skill**:
- User starts new project
- User says "set up frontend"
- New UI architecture needed

**After skill runs**:
```svelte
// You'll have:
frontend/
├── svelte.config.js     // ✅ Configured
├── vite.config.ts       // ✅ Configured
├── tailwind.config.js   // ✅ v3.4.1 ready
├── postcss.config.js    // ✅ Required for Tailwind
└── src/
    ├── routes/
    │   ├── +layout.svelte  // ✅ Svelte 5 runes
    │   └── +page.svelte    // ✅ Landing page
    └── lib/
        └── api/
            └── client.ts    // ✅ API stub

// Start building UI immediately:
@svelte-frontend-developer Create dashboard with widgets
```

**What you DON'T need to do**:
- ❌ Configure Tailwind
- ❌ Set up PostCSS
- ❌ Fix Svelte 5 syntax
- ❌ Configure Vite
- ❌ Set up routing

**What you DO need to do**:
- ✅ Create components
- ✅ Build pages
- ✅ Implement state management
- ✅ Style with Tailwind

### 3. Full-Stack Integration Agent

**When to use this skill**:
- User starts new full-stack project
- User says "connect frontend to backend"

**After skill runs**:
```typescript
// You'll have:
backend/                 // ✅ Encore services ready
frontend/                // ✅ SvelteKit ready
Taskfile.yml             // ✅ Commands for:
                         //    - dev (both servers)
                         //    - gen:client (TypeScript client)
                         //    - deployment

// Start integration immediately:
@encore-svelte-integration Connect portfolio API to dashboard
```

**What you DON'T need to do**:
- ❌ Configure CORS
- ❌ Set up API proxy
- ❌ Write client generation scripts
- ❌ Configure type sharing

**What you DO need to do**:
- ✅ Generate TypeScript client
- ✅ Connect API calls to UI
- ✅ Handle loading states
- ✅ Implement error handling

---

## Agent Communication Pattern

### Step 1: Detect Need for Setup

**Agent should detect**:
```
User: "Build a finance dashboard app with Encore and Svelte"
         ↓
Agent: New project detected!
         ↓
Action: Use @encore-sveltekit-setup skill first
```

### Step 2: Run Setup Skill

```
Agent: @encore-sveltekit-setup Initialize "FinanceDashboard" with app ID "finance-abc1"
         ↓
Skill: Creates entire structure
         ↓
Output: Project ready with all configs
```

### Step 3: Agent-Specific Work

```
Agent: Now I can use my specialized knowledge
         ↓
- Create services (backend agent)
- Build UI (frontend agent)
- Connect them (integration agent)
```

---

## Code Generation After Setup

### Backend Agent Example

```typescript
// Skill provides: backend/auth/health.ts (example)
// You generate: backend/portfolio/portfolio.ts

import { api } from "encore.dev/api";
import service from "./encore.service";

interface GetPortfolioResponse {
  holdings: Holding[];
  totalValue: number;
}

export const getPortfolio = api(
  { expose: true, method: 'GET', path: '/portfolio', auth: true },
  async (): Promise<GetPortfolioResponse> => {
    const { userID } = requireAuth();  // ← Pattern from middleware.ts
    // Fetch portfolio logic
  }
);
```

### Frontend Agent Example

```svelte
<!-- Skill provides: src/routes/+layout.svelte (example) -->
<!-- You generate: src/lib/components/PortfolioCard.svelte -->

<script lang="ts">
  // Pattern from layout
  let { portfolio }: { portfolio: Portfolio } = $props();
  
  // Reactive state
  let expanded = $state(false);
  
  // Derived
  let gainPercent = $derived(
    (portfolio.gain / portfolio.cost) * 100
  );
</script>

<div class="portfolio-card">
  <!-- Use Tailwind (already configured) -->
  <h2 class="text-xl font-bold">{portfolio.name}</h2>
  <p class="text-green-600">+{gainPercent.toFixed(2)}%</p>
</div>
```

---

## Error Handling

### If Setup Fails

**Agent should**:
1. Read error message
2. Check GOTCHAS.md for known issues
3. Apply fix from gotchas
4. Re-run setup
5. If still fails, report to user

**Common failures**:
- Encore app ID mismatch → Update `backend/encore.app`
- Missing dependencies → Run `task setup`
- Port conflicts → Kill processes with port cleanup

### If Compilation Fails

**Agent should**:
1. Run `cd backend && npx tsc --noEmit`
2. Run `cd frontend && npx svelte-check`
3. Read errors
4. Check if it's a known gotcha
5. Apply fix
6. Re-compile

---

## Verification After Setup

**Agent must verify**:

```bash
# 1. Structure exists
ls backend frontend Taskfile.yml
# All should exist

# 2. Dependencies installed
ls backend/node_modules frontend/node_modules
# Both should exist

# 3. TypeScript compiles
cd backend && npx tsc --noEmit
# Should: 0 errors

# 4. Svelte compiles
cd frontend && npx svelte-check
# Should: 0 errors

# 5. Servers start
task dev
# Should start both without errors

# 6. Health checks
curl http://localhost:4000/auth/health
# Should return JSON
```

**Only proceed if ALL pass** ✅

---

## Context to Maintain

**Agent should remember**:

### Project Structure
```
Root: /path/to/project
Backend: /path/to/project/backend
Frontend: /path/to/project/frontend
Config: /path/to/project/Taskfile.yml
```

### Key Files
- `backend/encore.app` - App ID
- `backend/auth/middleware.ts` - Auth patterns
- `frontend/src/lib/api/client.ts` - API client
- `Taskfile.yml` - Available commands

### Gotchas Applied
- ✅ All backend gotchas from GOTCHAS.md
- ✅ All frontend gotchas from GOTCHAS.md
- ✅ All DevOps gotchas from GOTCHAS.md

### Available Commands
```bash
task dev              # Start servers
task gen:client       # Generate client
task db:reset         # Reset databases
task test             # Run tests
task --list           # See all
```

---

## Integration with Existing Agents

### Update Your Agent Files

Add to `@encore-backend-developer.md`:
```markdown
## Initial Setup

Before creating services, ensure setup is complete:

```bash
@encore-sveltekit-setup Initialize "ProjectName" with app ID "app-id"
```

This provides:
- Auth middleware boilerplate
- Error handling utilities
- Environment validation
- Health check examples
- All gotchas pre-fixed

Then proceed with service creation...
```

Add to `@svelte-frontend-developer.md`:
```markdown
## Initial Setup

Before building UI, ensure setup is complete:

```bash
@encore-sveltekit-setup Initialize "ProjectName" with app ID "app-id"
```

This provides:
- Svelte 5 with runes configured
- Tailwind v3.4.1 ready
- PostCSS configured
- Layout examples
- All gotchas pre-fixed

Then proceed with component creation...
```

---

## Workflow Example

### Full Project Setup

```
1. User: "Build a task manager with Encore + Svelte"

2. Agent: Detects new project
   → Uses @encore-sveltekit-setup
   → Verifies setup complete

3. Agent: Creates backend
   → @encore-backend-developer Create tasks service
   → Generates: backend/tasks/tasks.ts
   → Tests: curl http://localhost:4000/tasks/health

4. Agent: Creates frontend
   → @svelte-frontend-developer Create TaskList component
   → Generates: frontend/src/lib/components/TaskList.svelte
   → Tests: Open http://localhost:5173

5. Agent: Connects them
   → @encore-svelte-integration Connect TaskList to API
   → Runs: task gen:client
   → Updates: TaskList to use api.tasks.list()
   → Tests: Full CRUD flow

6. User: "Deploy"
   → Agent: task deploy:prod
   → Success! 🚀
```

---

## Best Practices for Agents

### DO ✅
- Use this skill for ALL new Encore + SvelteKit projects
- Verify setup before proceeding with features
- Reference examples in `examples/` folder
- Use task commands from Taskfile
- Check GOTCHAS.md when errors occur
- Follow patterns from generated boilerplate

### DON'T ❌
- Skip setup and try to configure manually
- Ignore verification steps
- Generate code with known gotchas
- Use outdated syntax (Tailwind v4, `<slot />`)
- Hardcode values that should be in .env
- Create duplicate utilities (use shared/)

---

## Continuous Improvement

**When you discover new gotchas**:
1. Document in GOTCHAS.md
2. Update templates to pre-fix
3. Update examples if needed
4. Update agent integration docs
5. Version bump skill

**When stack updates**:
1. Test new versions
2. Update package.json templates
3. Update examples
4. Document breaking changes
5. Update SKILL.md version info

---

## Support & Issues

**If agent encounters issues**:
1. Check GOTCHAS.md first
2. Run `./verify-setup.sh`
3. Check agent's critical gotchas section
4. Review examples for correct patterns
5. Report new issues back to skill

---

**This skill is your foundation. Build confidently on top of it!** 🏗️

