Create a new Encore.ts service with complete boilerplate including database migrations, API endpoints, and tests.

**Usage:** `/encore-service <service-name> <description>`

**Example:** `/encore-service notifications "Handle user notifications and alerts"`

## What This Command Creates

```
apps/backend/<service-name>/
├── encore.service.ts      # Service definition
├── <service-name>.ts      # API endpoints
├── db.ts                  # Database connection
├── migrations/
│   └── 1_create_tables.up.sql
├── tests/
│   └── <service-name>.test.ts
└── README.md
```

## Generated Files

### 1. Service Definition
```typescript
// encore.service.ts
import { Service } from "encore.dev/service";
export default new Service("<service-name>");
```

### 2. Database Setup
```typescript
// db.ts
import { SQLDatabase } from "encore.dev/storage/sqldb";

export const DB = new SQLDatabase("<service-name>", {
  migrations: "./migrations",
});
```

### 3. Initial Migration
```sql
-- migrations/1_create_<entity>.up.sql
CREATE TABLE <entities> (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_<entities>_created_at ON <entities>(created_at);
```

### 4. Sample API Endpoint
```typescript
// <service-name>.ts
import { api } from "encore.dev/api";
import { DB } from "./db";

interface CreateParams {
  // Define parameters
}

export const create = api(
  { method: "POST", path: "/<service-name>", expose: true, auth: true },
  async (params: CreateParams) => {
    // Implementation
  }
);
```

### 5. README
Includes:
- Service purpose and responsibilities
- API endpoints documentation
- Database schema overview
- Development instructions

## Post-Creation Steps

1. **Update Database Schema**: Edit `migrations/1_create_tables.up.sql`
2. **Implement API Endpoints**: Add endpoints to `<service-name>.ts`
3. **Write Tests**: Add tests to `tests/<service-name>.test.ts`
4. **Generate Client**: Run `encore gen client typescript --output=../frontend/src/lib/api/client.ts`

## Encore Service Patterns

The command follows these KiteMate service patterns:

- **One database per service** (Encore best practice)
- **Type-safe API endpoints** with validation
- **Structured errors** using `APIError`
- **Authentication** on sensitive endpoints (`auth: true`)
- **Migration-first** database changes

## Example Services in KiteMate

- `auth` - User authentication, Zerodha OAuth
- `portfolio` - Portfolio data, Zerodha sync
- `chat` - NLP query processing
- `widgets` - Widget CRUD, configuration
- `social` - Profiles, forks, discovery
- `subscriptions` - Payments, Pro tier

## Agent Used

This command invokes: **encore-backend-developer**
