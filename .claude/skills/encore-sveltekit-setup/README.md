# 🚀 Encore + SvelteKit Full-Stack Setup Skill

**Your 10-minute ticket to production-ready Encore.ts + SvelteKit applications.**

---

## What Is This?

A comprehensive, battle-tested skill that automates complete setup of Encore.ts backend + SvelteKit frontend projects. Born from real production experience, it includes ALL gotchas pre-fixed, working examples, and 30+ automation commands.

### What You Get

```
10 minutes → Full-stack app ready
20 minutes → First feature deployed
30 minutes → Production-ready MVP
```

**No more**:
- ❌ Hours debugging configuration
- ❌ Fighting with Tailwind v4 beta
- ❌ TypeScript errors from auth middleware
- ❌ Port conflicts and CORS issues
- ❌ Wondering "why won't this compile?"

**Instead**:
- ✅ Everything configured and tested
- ✅ All gotchas pre-fixed
- ✅ Working examples to reference
- ✅ Task automation ready
- ✅ Type-safe full-stack from day 1

---

## Quick Start (3 Steps)

### 1. Create Encore App
Visit https://app.encore.dev/ → Create App → Note app ID

### 2. Run This Skill
```bash
@encore-sveltekit-setup Initialize "MyApp" with app ID "myapp-x9z2"
```

### 3. Start Building
```bash
task dev
# Backend: http://localhost:4000
# Frontend: http://localhost:5173
```

**That's it.** Start building features immediately.

---

## Documentation Structure

```
.claude/skills/encore-sveltekit-setup/
├── SKILL.md                  # Full skill documentation
├── README.md                 # This file
├── QUICKSTART.md             # 10-minute setup guide
├── GOTCHAS.md                # All known issues & fixes
├── CHECKLIST.md              # Step-by-step verification
├── AGENT_INTEGRATION.md      # For AI agents
│
├── templates/                # Verified config templates
│   ├── encore.app.template
│   ├── go.mod.template
│   ├── postcss.config.js.template
│   └── env.example.template
│
├── examples/                 # Working code examples
│   ├── README.md
│   ├── auth-health.ts        # Backend endpoint
│   ├── auth-middleware.ts    # Auth handler
│   └── svelte5-layout.svelte # Frontend component
│
└── scripts/                  # Automation scripts
    └── (future: setup.sh, verify.sh)
```

---

## What Gets Created

### Backend (Encore.ts)
```
backend/
├── encore.app              # ✅ App ID configured
├── go.mod                  # ✅ Required for Encore
├── package.json            # ✅ All dependencies
├── tsconfig.json           # ✅ TypeScript config
├── .env.example            # ✅ Environment template
│
├── auth/                   # ✅ Authentication service
│   ├── encore.service.ts   # Service definition
│   ├── jwt.ts              # JWT utilities
│   ├── middleware.ts       # Auth handler (userID fix ✅)
│   ├── gateway.ts          # API Gateway
│   ├── types.ts            # Auth types
│   └── health.ts           # Health check example
│
└── shared/                 # ✅ Shared utilities
    ├── types.ts            # Base types
    ├── errors.ts           # Error handling (fixes ✅)
    └── env.ts              # Environment validation
```

### Frontend (SvelteKit 2)
```
frontend/
├── package.json            # ✅ All dependencies
├── svelte.config.js        # ✅ Vercel adapter
├── vite.config.ts          # ✅ Vitest config (fix ✅)
├── tsconfig.json           # ✅ No conflicting paths ✅
├── tailwind.config.js      # ✅ v3.4.1 (not v4! ✅)
├── postcss.config.js       # ✅ REQUIRED for Tailwind
├── .env.local.example      # ✅ Environment template
│
└── src/
    ├── app.css             # ✅ Tailwind directives (fix ✅)
    ├── app.html            # ✅ Main HTML
    ├── routes/
    │   ├── +layout.svelte  # ✅ Svelte 5 runes (fix ✅)
    │   └── +page.svelte    # Landing page
    └── lib/
        └── api/
            └── client.ts   # API client stub
```

### DevOps
```
Taskfile.yml                # ✅ 30+ commands
verify-setup.sh             # ✅ Setup checker
.gitignore                  # ✅ Proper ignores
.eslintignore               # ✅ ESLint ignores
.prettierignore             # ✅ Prettier ignores
README.md                   # ✅ Project docs
```

---

## All Gotchas Pre-Fixed

### ✅ Backend (6 fixes)
1. Encore app ID matches cloud (no 404 errors)
2. go.mod file included (Encore requirement)
3. Auth middleware uses `userID` not `userId`
4. Header imported from `encore.dev/api`
5. Error details logged separately
6. All package versions verified

### ✅ Frontend (6 fixes)
1. Tailwind v3.4.1 not v4 beta
2. PostCSS config included
3. Layout uses `{@render children()}`
4. Vite config imports from `vitest/config`
5. No conflicting TypeScript paths
6. CSS uses `@tailwind` directives

### ✅ DevOps (2 fixes)
1. Taskfile descriptions properly quoted
2. Port cleanup commands available

**See GOTCHAS.md for details on each fix.**

---

## Available Commands

After setup, you have 30+ commands via Taskfile:

```bash
# Development
task dev                 # Start both servers
task dev:backend         # Backend only (:4000)
task dev:frontend        # Frontend only (:5173)
task gen:client          # Generate TypeScript client
task gen:client:watch    # Watch mode

# Code Quality
task lint                # Lint all code
task format              # Format all code
task test                # Run all tests
task test:unit           # Unit tests only
task test:e2e            # E2E tests only

# Database
task db:reset            # Reset databases
task db:shell            # PostgreSQL shell
task db:proxy            # Database proxy

# Deployment
task deploy:staging      # Deploy to staging
task deploy:prod         # Deploy to production

# Utilities
task clean               # Clean artifacts
task setup               # Install dependencies
task logs                # View logs
task --list              # See all commands
```

---

## Working Examples

All examples are **tested and working**:

### Backend Health Check
```typescript
// From examples/auth-health.ts
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

### Auth Middleware
```typescript
// From examples/auth-middleware.ts
interface EncoreAuthData {
  userID: string;  // ← Correct: capital ID
  tier: UserTier;
}

export const auth = authHandler<AuthParams, EncoreAuthData>(...);
```

### Svelte 5 Layout
```svelte
<!-- From examples/svelte5-layout.svelte -->
<script lang="ts">
  import '../app.css';
  let { children } = $props();  // ← Svelte 5 runes
</script>

{@render children()}  <!-- ← Not <slot /> -->
```

**See examples/README.md for full patterns.**

---

## For AI Agents

This skill integrates seamlessly with agent workflows:

```
User: "Build finance app"
   ↓
Agent: @encore-sveltekit-setup Initialize...
   ↓
Skill: Creates structure + configs
   ↓
Agent: @encore-backend-developer Create services
Agent: @svelte-frontend-developer Build UI
Agent: @encore-svelte-integration Connect them
   ↓
Done: Full-stack app ready!
```

**See AGENT_INTEGRATION.md for full agent guide.**

---

## Tech Stack (Tested Versions)

### Backend
- **Encore.dev**: ^1.37.0
- **Node.js**: 20+
- **TypeScript**: ^5.3.3
- **envalid**: ^8.0.0
- **kiteconnect**: ^5.1.0
- **jose**: ^5.2.0
- **zod**: ^3.22.4

### Frontend
- **SvelteKit**: ^2.0.0
- **Svelte**: ^5.0.0
- **Tailwind CSS**: ^3.4.1 (NOT v4!)
- **Vite**: ^5.0.11
- **TypeScript**: ^5.3.3

### Tools
- **Task**: ^3.x
- **Git**: Any recent version

---

## Success Criteria

Setup is successful when:

- [ ] `task dev` starts both servers
- [ ] `curl http://localhost:4000/auth/health` returns JSON
- [ ] `open http://localhost:5173` shows landing page
- [ ] `cd backend && npx tsc --noEmit` → 0 errors
- [ ] `cd frontend && npx svelte-check` → 0 errors
- [ ] `./verify-setup.sh` → All ✅
- [ ] No console errors
- [ ] Tailwind styles working

---

## Troubleshooting

### Setup Issues
**Problem**: Errors during setup  
**Solution**: Check GOTCHAS.md for known issues

### Backend Won't Start
**Problem**: `app_not_found` error  
**Solution**: Verify `backend/encore.app` has correct app ID

### Frontend Won't Start
**Problem**: PostCSS or Tailwind errors  
**Solution**: Verify `frontend/postcss.config.js` exists and Tailwind is v3.4.1

### Port Conflicts
**Problem**: Port already in use  
**Solution**: `lsof -ti:PORT | xargs kill -9`

**See GOTCHAS.md for comprehensive troubleshooting.**

---

## File Guide

### For Users
- **QUICKSTART.md** - 10-minute setup guide
- **CHECKLIST.md** - Step-by-step checklist
- **GOTCHAS.md** - All issues & fixes
- **examples/** - Working code to reference

### For Agents
- **AGENT_INTEGRATION.md** - How agents should use this skill
- **SKILL.md** - Complete skill documentation
- **templates/** - Config file templates

### For Developers
- **templates/** - Modify these for your needs
- **examples/** - Add more examples here
- **scripts/** - Future automation scripts

---

## Customization

After initial setup, customize:

### Backend
- Add services in `backend/`
- Create migrations
- Define API contracts
- Add middleware
- Configure secrets

### Frontend
- Update Tailwind theme
- Add components
- Create routes
- Set up stores

### DevOps
- Add Taskfile tasks
- Configure CI/CD
- Set up environments

---

## Best Practices

### DO ✅
- Use this skill for every new project
- Verify setup before building features
- Reference examples for patterns
- Use task commands
- Check gotchas when stuck

### DON'T ❌
- Skip verification steps
- Use Tailwind v4 (beta)
- Hardcode secrets
- Ignore TypeScript errors
- Manually configure (use skill!)

---

## Version History

### v1.0.0 (2025-11-16)
- ✅ Initial release
- ✅ Complete setup automation
- ✅ 14 gotchas pre-fixed
- ✅ 30+ task commands
- ✅ Working examples
- ✅ Full documentation
- ✅ Agent integration
- ✅ Tested in production

---

## Future Enhancements

### Planned
- [ ] One-command setup script
- [ ] CI/CD templates
- [ ] Docker support
- [ ] More service examples
- [ ] More component examples
- [ ] Video tutorials

### Ideas
- Database seeding
- Test data generators
- Deployment automation
- Monitoring setup

---

## Support

### Get Help
1. Check QUICKSTART.md
2. Check GOTCHAS.md
3. Run `./verify-setup.sh`
4. Check examples/
5. Review agent docs

### Report Issues
- Document new gotchas in GOTCHAS.md
- Update templates with fixes
- Update examples if needed
- Version bump SKILL.md

---

## Credits

**Created from**: Real production experience setting up KiteMate MVP  
**Tested on**: macOS 24.6.0, Node.js 20+, Encore 1.37+  
**Stack**: Encore.ts + SvelteKit 2 + Svelte 5 + Tailwind v3  
**Battle-tested**: ✅ All gotchas found and fixed

---

## License

Free to use, modify, and share.  
Built with ❤️ for the Encore + Svelte community.

---

## Quick Links

- **Start Here**: [QUICKSTART.md](./QUICKSTART.md)
- **Full Docs**: [SKILL.md](./SKILL.md)
- **Gotchas**: [GOTCHAS.md](./GOTCHAS.md)
- **Checklist**: [CHECKLIST.md](./CHECKLIST.md)
- **For Agents**: [AGENT_INTEGRATION.md](./AGENT_INTEGRATION.md)
- **Examples**: [examples/README.md](./examples/README.md)

---

**Ready to build?**

```bash
@encore-sveltekit-setup Initialize "YourApp" with app ID "your-app-id"
```

**10 minutes to production. Let's go! 🚀**

