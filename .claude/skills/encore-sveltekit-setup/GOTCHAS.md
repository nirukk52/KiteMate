# Common Gotchas & Fixes

**All these gotchas are PRE-FIXED in this skill's templates!**

This document is for reference and troubleshooting.

---

## Backend (Encore.ts)

### 1. App ID Mismatch ⚠️ CRITICAL
**Problem**: Local `encore.app` doesn't match cloud app ID  
**Error**: `fetch secrets: http 404 Not Found: code=app_not_found`  
**Symptom**: Backend won't start, can't fetch secrets  
**Fix**: Update `backend/encore.app` with exact cloud app ID
```json
{
  "id": "your-cloud-app-id-here"  // Must match exactly!
}
```
**Status in Skill**: ✅ Fixed - Template uses correct ID

### 2. Missing go.mod File
**Problem**: Encore requires `go.mod` even for TypeScript projects  
**Error**: `open go.mod: no such file or directory`  
**Symptom**: Backend fails to build  
**Fix**: Create `backend/go.mod`:
```go
module encore.app
go 1.22.0
require encore.dev v1.37.0
```
**Status in Skill**: ✅ Fixed - Template includes it

### 3. Auth Middleware userID (not userId)
**Problem**: Encore requires capital `userID` not `userId`  
**Error**: `Property 'userID' is missing in type 'AuthData'`  
**Symptom**: TypeScript errors in auth middleware  
**Fix**: Use capital ID:
```typescript
interface EncoreAuthData {
  userID: string;  // ← Must be capital ID
  tier: UserTier;
}
```
**Status in Skill**: ✅ Fixed - Examples use correct format

### 4. Header Import Location
**Problem**: `Header` type comes from wrong package  
**Error**: `Module 'encore.dev/auth' has no exported member 'Header'`  
**Symptom**: TypeScript error in auth middleware  
**Fix**: Import from correct package:
```typescript
import { authHandler } from 'encore.dev/auth';  // ← authHandler here
import { Header } from 'encore.dev/api';         // ← Header here
```
**Status in Skill**: ✅ Fixed - Templates use correct imports

### 5. APIError Details Parameter
**Problem**: APIError constructor doesn't accept plain objects for details  
**Error**: Type mismatch for third parameter  
**Symptom**: TypeScript errors in error handling  
**Fix**: Log details separately:
```typescript
export function notFound(message: string, details?: Record<string, any>): APIError {
  const error = new APIError(ErrCode.NotFound, message);
  if (details) {
    console.log('Not found details:', details);  // ← Log separately
  }
  return error;
}
```
**Status in Skill**: ✅ Fixed - Error utilities pre-configured

### 6. Package Version Mismatches
**Problem**: Some package versions don't exist  
**Error**: `No matching version found for package@version`  
**Examples**:
- `kiteconnect@^4.2.0` ❌ (use `^5.1.0` ✅)
**Fix**: Use verified versions in package.json  
**Status in Skill**: ✅ Fixed - All versions tested and working

---

## Frontend (SvelteKit + Svelte 5)

### 7. Tailwind v4 is Beta (Use v3.4.1)
**Problem**: Tailwind v4 syntax not compatible  
**Error**: `Missing "./base" specifier in "tailwindcss" package`  
**Symptom**: CSS not loading, build fails  
**Fix**: Use Tailwind v3.4.1 with proper directives:
```css
/* app.css */
@tailwind base;       /* ← NOT @import 'tailwindcss/base' */
@tailwind components;
@tailwind utilities;
```
**Status in Skill**: ✅ Fixed - Uses v3.4.1 with correct syntax

### 8. Missing postcss.config.js
**Problem**: Tailwind v3 requires PostCSS config  
**Error**: PostCSS errors, Tailwind not processing  
**Symptom**: No Tailwind styles applied  
**Fix**: Create `frontend/postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```
**Status in Skill**: ✅ Fixed - Template includes it

### 9. Svelte 5 Slot Syntax Changed
**Problem**: `<slot />` deprecated in Svelte 5  
**Warning**: `Using <slot> to render parent content is deprecated`  
**Symptom**: Deprecation warnings, may break in future  
**Fix**: Use `{@render children()}` pattern:
```svelte
<script lang="ts">
  let { children } = $props();  // ← Svelte 5 runes
</script>

{@render children()}  <!-- ← New syntax, not <slot /> -->
```
**Status in Skill**: ✅ Fixed - Templates use Svelte 5 syntax

### 10. Vite Config Type Issues
**Problem**: `test` property not recognized  
**Error**: `Property 'test' does not exist in type 'UserConfigExport'`  
**Symptom**: TypeScript error in vite.config.ts  
**Fix**: Import from vitest/config:
```typescript
import { defineConfig } from 'vitest/config';  // ← NOT from 'vite'
```
**Status in Skill**: ✅ Fixed - Template uses correct import

### 11. TypeScript Path Aliases Conflict
**Problem**: Custom paths in tsconfig.json interfere with SvelteKit  
**Warning**: `baseUrl and/or paths interferes with SvelteKit`  
**Symptom**: Module resolution issues  
**Fix**: Remove paths from tsconfig.json, use kit.alias:
```javascript
// svelte.config.js
export default {
  kit: {
    alias: {
      $lib: './src/lib',
      $components: './src/lib/components'
    }
  }
};
```
**Status in Skill**: ✅ Fixed - No conflicting paths in tsconfig

---

## DevOps & Configuration

### 12. Taskfile YAML Syntax
**Problem**: Colons in descriptions break YAML  
**Error**: `mapping values are not allowed in this context`  
**Symptom**: Taskfile won't parse  
**Fix**: Quote descriptions with colons:
```yaml
secret:set:
  desc: "Set a secret (usage: task secret:set -- SECRET_NAME)"  # ← Quoted
```
**Status in Skill**: ✅ Fixed - All descriptions properly quoted

### 13. Port Conflicts
**Problem**: Ports already in use from previous runs  
**Error**: `Failed to run on 127.0.0.1:4000 - port is already in use`  
**Symptom**: Can't start servers  
**Fix**: Kill processes:
```bash
lsof -ti:4000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```
**Status in Skill**: ✅ Documented - Helper commands in Taskfile

---

## Quick Reference

### ✅ What's Fixed in Skill
1. Encore app ID configuration
2. go.mod file inclusion
3. Auth middleware userID format
4. Header import location
5. APIError details handling
6. All package versions verified
7. Tailwind v3.4.1 with PostCSS
8. Svelte 5 runes syntax
9. Vite config imports
10. TypeScript configuration
11. Taskfile YAML syntax
12. Port cleanup commands

### ⚠️ Still Need Manual Setup
1. Generate JWT_SECRET and ENCRYPTION_KEY
2. Get API keys for your services
3. Configure environment variables
4. Create Encore app in cloud console

---

## Verification

After setup, verify fixes applied:

```bash
# 1. Check Encore app ID
cat backend/encore.app | grep '"id"'
# Should match your cloud app ID

# 2. Check go.mod exists
test -f backend/go.mod && echo "✅ go.mod exists"

# 3. Check PostCSS config exists
test -f frontend/postcss.config.js && echo "✅ postcss.config.js exists"

# 4. Check Tailwind version
grep "tailwindcss" frontend/package.json
# Should show: "tailwindcss": "^3.4.1"

# 5. Check Svelte 5 runes in layout
grep "@render" frontend/src/routes/+layout.svelte
# Should find: {@render children()}

# 6. Compile check
cd backend && npx tsc --noEmit  # Should: 0 errors
cd ../frontend && npx svelte-check  # Should: 0 errors
```

---

## Prevention Checklist

When setting up a new project, always:

- [ ] Use this skill's templates (all fixes applied)
- [ ] Verify Encore app ID matches cloud
- [ ] Use Tailwind v3.4.1 (not v4)
- [ ] Include postcss.config.js
- [ ] Use Svelte 5 runes syntax
- [ ] Quote Taskfile descriptions with colons
- [ ] Verify package versions match tested ones
- [ ] Check TypeScript compiles before starting dev
- [ ] Generate secrets (don't use example values)
- [ ] Test health endpoints after start

---

**Updated**: 2025-11-16  
**All fixes tested and verified in production setup**

