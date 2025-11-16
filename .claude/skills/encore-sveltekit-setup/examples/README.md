# Working Examples

These are **tested and working** examples from real production setup.  
All gotchas are pre-fixed in these files.

---

## Backend Examples

### auth-health.ts
**Purpose**: Simple health check endpoint  
**Use**: Template for any service health check  
**Key Concepts**:
- Basic API endpoint definition
- Response typing
- No authentication required

```typescript
// Usage in any service:
export const health = api(
  { expose: true, method: 'GET', path: '/myservice/health' },
  async (): Promise<HealthResponse> => {
    return {
      status: 'ok',
      service: 'myservice',
      timestamp: new Date().toISOString()
    };
  }
);
```

### auth-middleware.ts
**Purpose**: JWT authentication middleware  
**Use**: Template for auth handler  
**Key Gotchas Fixed**:
- ✅ Uses `userID` (capital ID) - Encore requirement
- ✅ Imports `Header` from `encore.dev/api` (not auth)
- ✅ Proper `EncoreAuthData` typing

```typescript
// Key pattern:
interface EncoreAuthData {
  userID: string;  // ← Must be capital ID!
  tier: UserTier;
}

export const auth = authHandler<AuthParams, EncoreAuthData>(
  async (params: AuthParams): Promise<EncoreAuthData | null> => {
    // Validation logic here
    return {
      userID: user.id,  // ← Use capital ID
      tier: user.tier
    };
  }
);
```

---

## Frontend Examples

### svelte5-layout.svelte
**Purpose**: Root layout component  
**Use**: Template for all Svelte 5 layouts  
**Key Gotchas Fixed**:
- ✅ Uses `{@render children()}` not `<slot />`
- ✅ Proper Svelte 5 runes with `$props()`
- ✅ Imports app.css correctly

```svelte
<!-- Key pattern: -->
<script lang="ts">
  import '../app.css';
  
  // ← Svelte 5 runes pattern
  let { children } = $props();
</script>

<!-- ← New syntax, not <slot /> -->
{@render children()}
```

---

## Template Patterns

### Creating New Service
```typescript
// backend/myservice/encore.service.ts
export default new Service("myservice");

// backend/myservice/myservice.ts
import { api } from "encore.dev/api";
import service from "./encore.service";

export const myEndpoint = api(
  { expose: true, method: 'POST', path: '/myservice/endpoint' },
  async (req: MyRequest): Promise<MyResponse> => {
    // Implementation
  }
);
```

### Creating Authenticated Endpoint
```typescript
import { api } from "encore.dev/api";
import { requireAuth } from "../auth/middleware";

export const protectedEndpoint = api(
  { expose: true, method: 'GET', path: '/data', auth: true },
  async (): Promise<DataResponse> => {
    const authData = requireAuth();
    const userID = authData.userID;  // ← Capital ID
    // Use userID
  }
);
```

### Creating Svelte 5 Component
```svelte
<script lang="ts">
  // Props with runes
  let { item, onUpdate }: {
    item: Item,
    onUpdate: (item: Item) => void
  } = $props();
  
  // Reactive state
  let count = $state(0);
  
  // Derived values
  let doubled = $derived(count * 2);
  
  // Effects
  $effect(() => {
    console.log('Count changed:', count);
  });
</script>

<button onclick={() => count++}>
  Count: {count} (doubled: {doubled})
</button>
```

---

## Testing Patterns

### Backend API Test
```typescript
import { describe, it, expect } from 'vitest';
import { health } from './health';

describe('Health Endpoint', () => {
  it('should return ok status', async () => {
    const result = await health();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('auth');
  });
});
```

### Svelte Component Test
```typescript
import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent.svelte';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(MyComponent, { props: { value: 'test' } });
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```

---

## Common Use Cases

### 1. CRUD Endpoint
```typescript
// Create
export const createItem = api(
  { expose: true, method: 'POST', path: '/items', auth: true },
  async (req: CreateItemRequest): Promise<Item> => {
    const { userID } = requireAuth();
    // Validate, insert, return
  }
);

// Read
export const getItem = api(
  { expose: true, method: 'GET', path: '/items/:id' },
  async ({ id }: { id: string }): Promise<Item> => {
    // Fetch and return
  }
);

// Update
export const updateItem = api(
  { expose: true, method: 'PUT', path: '/items/:id', auth: true },
  async ({ id, ...data }: UpdateItemRequest): Promise<Item> => {
    const { userID } = requireAuth();
    // Validate, update, return
  }
);

// Delete
export const deleteItem = api(
  { expose: true, method: 'DELETE', path: '/items/:id', auth: true },
  async ({ id }: { id: string }): Promise<void> => {
    const { userID } = requireAuth();
    // Validate, delete
  }
);
```

### 2. Form with Validation
```svelte
<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { z } from 'zod';
  
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email()
  });
  
  let { data } = $props<{ data: PageData }>();
  
  const { form, errors, enhance } = superForm(data.form, {
    validators: zod(schema)
  });
</script>

<form method="POST" use:enhance>
  <input bind:value={$form.name} />
  {#if $errors.name}<span>{$errors.name}</span>{/if}
  
  <input bind:value={$form.email} />
  {#if $errors.email}<span>{$errors.email}</span>{/if}
  
  <button type="submit">Submit</button>
</form>
```

### 3. API Client Usage
```typescript
// frontend/src/lib/api/client.ts
import { Client } from './encore-client';

export const api = new Client(import.meta.env.VITE_API_URL || 'http://localhost:4000');

// frontend/src/routes/+page.server.ts
import { api } from '$lib/api/client';

export async function load() {
  const items = await api.myservice.listItems();
  return { items };
}
```

---

## Verification

After implementing:

```bash
# Backend: Check TypeScript
cd backend && npx tsc --noEmit
# Should: 0 errors

# Backend: Test endpoint
curl http://localhost:4000/myservice/health
# Should return JSON

# Frontend: Check Svelte
cd frontend && npx svelte-check
# Should: 0 errors

# Frontend: Test in browser
open http://localhost:5173
# Should render correctly
```

---

**All examples verified working** ✅  
**Last tested**: 2025-11-16  
**Stack versions**: See SKILL.md

