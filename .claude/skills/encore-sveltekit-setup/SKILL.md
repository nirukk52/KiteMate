# Encore + SvelteKit Full-Stack Setup

**Type**: Project Initialization & Setup  
**Stack**: Encore.ts (Backend) + SvelteKit 2 + Svelte 5 (Frontend)  
**Version**: 1.0.0  
**Last Updated**: 2025-11-16

## What This Skill Does

Automates complete setup of a production-ready Encore.ts + SvelteKit full-stack application with:
- ✅ Proper directory structure
- ✅ All configuration files (tested and working)
- ✅ Environment templates with dummy values
- ✅ Task automation (30+ commands via Taskfile)
- ✅ TypeScript configuration for both stacks
- ✅ Tailwind CSS v3.4.1 with PostCSS
- ✅ Svelte 5 with runes
- ✅ Auth middleware boilerplate
- ✅ Database setup with migrations
- ✅ Health check endpoints
- ✅ Type-safe full-stack integration
- ✅ All gotchas and fixes pre-applied

## When to Use This Skill

Use this skill when:
- 🆕 Starting a new Encore + SvelteKit project
- 🏗️ Need production-ready boilerplate
- ⚡ Want to skip setup and jump to features
- 🔄 Setting up multiple similar projects
- 👥 Onboarding team members
- 📚 Teaching the stack

## What You Get

### Backend (Encore.ts)
- Microservices architecture ready
- JWT authentication with middleware
- Database connection utilities
- Error handling framework
- Environment validation (envalid)
- Health check endpoints
- Type-safe API definitions
- Migration structure

### Frontend (SvelteKit 2)
- Svelte 5 with runes configured
- Tailwind CSS v3.4.1 working
- PostCSS configured
- Vercel adapter ready
- API client integration stub
- SSR data loading patterns
- Type-safe forms (superforms + zod)
- Modern routing structure

### DevOps
- Task automation (30+ commands)
- Setup verification script
- Environment templates
- Git ignore files
- TypeScript configurations
- Linting & formatting setup

## Prerequisites

Before using this skill:
- [ ] Encore CLI installed (`encore version`)
- [ ] Node.js 20+ installed
- [ ] npm 10+ installed
- [ ] go-task/task installed (for Taskfile)
- [ ] Encore account (for cloud connection)
- [ ] Git initialized (optional)

## Usage

### Quick Start

```bash
# 1. Create your Encore app in the console first
#    Visit: https://app.encore.dev/
#    Note the app ID (e.g., "myapp-x9z2")

# 2. In Cursor/Claude, use this skill:
@encore-sveltekit-setup Initialize project "MyApp" with app ID "myapp-x9z2"

# 3. The skill will:
#    - Create backend/ and frontend/ directories
#    - Set up all config files
#    - Install dependencies
#    - Generate environment templates
#    - Create Taskfile with commands
#    - Set up health check endpoints
#    - Verify everything compiles
```

### What Gets Created

```
your-project/
├── backend/                      # Encore.ts microservices
│   ├── encore.app               # ✅ Configured with your app ID
│   ├── go.mod                   # ✅ Required module file
│   ├── package.json             # ✅ All dependencies
│   ├── tsconfig.json            # ✅ TypeScript config
│   ├── .env.example             # ✅ Environment template
│   │
│   ├── auth/                    # ✅ Auth service boilerplate
│   │   ├── encore.service.ts    # Service definition
│   │   ├── jwt.ts               # JWT utilities (jose)
│   │   ├── middleware.ts        # Auth handler (✅ userID fix)
│   │   ├── gateway.ts           # API Gateway
│   │   ├── types.ts             # Auth types
│   │   └── health.ts            # Health check
│   │
│   ├── shared/                  # ✅ Shared utilities
│   │   ├── types.ts             # Base types
│   │   ├── errors.ts            # Error handling (✅ fixes applied)
│   │   └── env.ts               # Environment validation
│   │
│   └── .gitignore               # ✅ Proper ignores
│
├── frontend/                     # SvelteKit 2 application
│   ├── package.json             # ✅ All dependencies
│   ├── svelte.config.js         # ✅ Vercel adapter
│   ├── vite.config.ts           # ✅ Vitest config
│   ├── tsconfig.json            # ✅ TypeScript config
│   ├── tailwind.config.js       # ✅ Tailwind v3.4.1
│   ├── postcss.config.js        # ✅ REQUIRED for Tailwind
│   ├── .env.local.example       # ✅ Environment template
│   │
│   └── src/
│       ├── routes/
│       │   ├── +layout.svelte   # ✅ Svelte 5 runes ({@render})
│       │   └── +page.svelte     # Landing page
│       ├── lib/
│       │   └── api/
│       │       └── client.ts    # API client stub
│       └── app.css              # ✅ Tailwind directives
│
├── Taskfile.yml                 # ✅ 30+ automation commands
├── verify-setup.sh              # ✅ Setup checker
├── .gitignore                   # ✅ Root ignores
├── .eslintignore                # ✅ ESLint ignores
├── .prettierignore              # ✅ Prettier ignores
└── README.md                    # ✅ Project documentation
```

## All Gotchas Pre-Fixed

This skill includes fixes for ALL known issues:

### ✅ Backend Fixes Applied
1. **Encore App ID** - Uses your cloud app ID (no 404 errors)
2. **go.mod** - Includes required module file
3. **Auth Middleware** - Uses `userID` not `userId` (Encore requirement)
4. **Header Import** - Imports from `encore.dev/api` not `encore.dev/auth`
5. **Error Details** - Logs details separately (not in constructor)
6. **Package Versions** - All correct versions (kiteconnect 5.1.0)

### ✅ Frontend Fixes Applied
1. **Tailwind v3.4.1** - Not v4 beta (includes postcss.config.js)
2. **Svelte 5 Runes** - Uses `{@render children()}` pattern
3. **Vite Config** - Imports from `vitest/config`
4. **No Path Aliases** - Uses SvelteKit's kit.alias instead
5. **CSS Syntax** - Uses `@tailwind` directives not `@import`

### ✅ DevOps Fixes Applied
1. **Taskfile YAML** - All descriptions properly quoted
2. **Port Management** - Helper commands for port cleanup
3. **Environment Templates** - Complete with all required vars

## Commands Available After Setup

```bash
# Development
task dev                 # Start both servers
task dev:backend         # Encore backend (:4000)
task dev:frontend        # SvelteKit frontend (:5173)

# Code Quality
task lint                # Lint all code
task format              # Format all code
task test                # Run all tests

# Database
task db:reset            # Reset databases
task db:shell            # PostgreSQL shell
task db:proxy            # Database proxy

# TypeScript Client
task gen:client          # Generate once
task gen:client:watch    # Watch mode

# Deployment
task deploy:staging      # Deploy to staging
task deploy:prod         # Deploy to production

# Utilities
task clean               # Clean artifacts
task setup               # Install dependencies
task logs                # View backend logs

# See all 30+ commands
task --list
```

## Post-Setup Checklist

After skill runs, you need to:

### 1. Set Up Environment Variables
```bash
# Generate secrets
openssl rand -hex 32  # JWT_SECRET
openssl rand -hex 32  # ENCRYPTION_KEY

# Copy templates
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Edit backend/.env with real values:
# - ZERODHA_API_KEY (from https://kite.zerodha.com/)
# - ZERODHA_API_SECRET
# - LLM_API_KEY (from https://platform.openai.com/)
# - JWT_SECRET (generated above)
# - ENCRYPTION_KEY (generated above)
```

### 2. Verify Setup
```bash
./verify-setup.sh
```

### 3. Start Development
```bash
task dev
```

### 4. Test Health Endpoints
```bash
curl http://localhost:4000/auth/health
# {"status":"ok","service":"auth","timestamp":"..."}
```

## Integration with Agents

This skill works perfectly with your existing agents:

### Use Together
```bash
# 1. Initialize with this skill
@encore-sveltekit-setup Initialize "MyFinApp" with app ID "finapp-abc1"

# 2. Then use agents for development
@encore-backend-developer Create portfolio service
@svelte-frontend-developer Build dashboard component
@encore-svelte-integration Connect portfolio API to dashboard
```

### Agent Context
After setup completes, agents will have:
- ✅ Complete project structure
- ✅ All configuration files
- ✅ Working examples (health checks)
- ✅ Type system foundation
- ✅ Error handling patterns
- ✅ Authentication boilerplate

## Examples Included

The skill includes working examples:

### 1. Health Check Endpoints
```typescript
// backend/auth/health.ts
export const health = api(
  { expose: true, method: 'GET', path: '/auth/health' },
  async (): Promise<HealthResponse> => {
    return {
      status: 'ok',
      service: 'auth',
      timestamp: new Date().toISOString()
    };
  }
);
```

### 2. Auth Middleware
```typescript
// backend/auth/middleware.ts
import { authHandler } from 'encore.dev/auth';
import { Header } from 'encore.dev/api';

interface EncoreAuthData {
  userID: string;  // ← Correct: capital ID
  tier: UserTier;
}

export const auth = authHandler<AuthParams, EncoreAuthData>(...);
```

### 3. Svelte 5 Layout
```svelte
<!-- frontend/src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  let { children } = $props();  // ← Svelte 5 runes
</script>

{@render children()}  <!-- ← Not <slot /> -->
```

### 4. Error Handling
```typescript
// backend/shared/errors.ts
export function notFound(message: string, details?: Record<string, any>): APIError {
  const error = new APIError(ErrCode.NotFound, message);
  if (details) {
    console.log('Not found details:', details);  // ← Log separately
  }
  return error;
}
```

## Customization Points

After initial setup, customize:

### Backend
- Add more services in `backend/`
- Create migrations in `service/migrations/`
- Define API contracts
- Add middleware
- Configure secrets

### Frontend
- Update Tailwind theme in `tailwind.config.js`
- Add components in `src/lib/components/`
- Create routes in `src/routes/`
- Set up stores in `src/lib/stores/`

### DevOps
- Add tasks to `Taskfile.yml`
- Configure CI/CD
- Set up environments
- Add deployment scripts

## Troubleshooting

### "app_not_found" Error
**Cause**: App ID mismatch  
**Fix**: Verify `backend/encore.app` has correct cloud app ID

### Tailwind Not Working
**Cause**: Missing postcss.config.js  
**Fix**: Skill includes it, verify it exists in `frontend/`

### TypeScript Errors
**Cause**: Dependencies not installed  
**Fix**: Run `task setup` or `npm install` in both directories

### Port Already in Use
**Cause**: Previous server still running  
**Fix**:
```bash
lsof -ti:4000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

## Stack Versions

This skill uses these specific versions (tested and working):

### Backend
- Encore.dev: ^1.37.0
- Node.js: 20+
- TypeScript: ^5.3.3
- envalid: ^8.0.0
- kiteconnect: ^5.1.0
- jose: ^5.2.0
- zod: ^3.22.4
- openai: ^4.28.0

### Frontend
- SvelteKit: ^2.0.0
- Svelte: ^5.0.0
- Tailwind CSS: ^3.4.1 (not v4!)
- Vite: ^5.0.11
- TypeScript: ^5.3.3

## What's NOT Included

This skill provides infrastructure. You still need to implement:
- Business logic
- Database schemas (beyond examples)
- API endpoints (beyond health checks)
- UI components (beyond layout)
- Tests
- Feature-specific code

Use this skill for **setup**, then use agents for **development**.

## Success Criteria

Setup is successful when:
- [ ] `task dev` starts both servers
- [ ] Backend compiles: `cd backend && npx tsc --noEmit`
- [ ] Frontend compiles: `cd frontend && npx svelte-check`
- [ ] Health endpoints respond
- [ ] `./verify-setup.sh` shows all ✅
- [ ] No TypeScript errors
- [ ] Tailwind styles working
- [ ] Taskfile commands working

## Migration from Existing Project

To apply this skill to an existing project:
1. **Backup first!** - Commit all changes
2. Let skill create new structure
3. Manually merge your code into new structure
4. Test thoroughly
5. Commit when working

## Sharing with Team

To share this setup with your team:
1. Commit generated structure to git
2. Share `.env.example` files (not `.env`!)
3. Document in README.md
4. Team members run: `task setup` then `task dev`

## Updates & Maintenance

Keep skill updated when:
- Encore.dev releases breaking changes
- SvelteKit or Svelte major versions
- Security updates needed
- New best practices discovered
- Gotchas fixed

## Support

For issues or improvements:
1. Check `HANDOFF.md` in generated project
2. Review agent files for patterns
3. Check Encore docs: https://encore.dev/docs
4. Check SvelteKit docs: https://kit.svelte.dev/docs

## Version History

- **1.0.0** (2025-11-16) - Initial release
  - Complete setup automation
  - All known gotchas fixed
  - 30+ task commands
  - Production-ready boilerplate
  - Full TypeScript integration

---

**Ready to use!** Just say: `@encore-sveltekit-setup Initialize "ProjectName" with app ID "app-id"`

