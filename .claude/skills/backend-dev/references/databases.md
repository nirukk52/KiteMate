# SQL Databases Reference

This reference covers PostgreSQL database management in Encore.ts, including schema migrations, queries, and ORM integration.

## Core Concepts

- Encore treats SQL databases as logical resources
- Natively supports PostgreSQL databases
- Migrations are defined in standard SQL files
- Built-in database CLI tools for management

## Database Creation

```typescript
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("todo", {
  migrations: "./migrations",
});
```

### Example Migration File
```sql
-- todo/migrations/1_create_table.up.sql
CREATE TABLE todo_item (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);
```

## Migration Conventions

### Naming Rules
- Start with number followed by underscore
- Must increase sequentially
- End with `.up.sql`

### Examples
- `001_first_migration.up.sql`
- `002_second_migration.up.sql`
- `003_add_user_table.up.sql`

### Structure
Place migrations in a `migrations` directory within the service directory:
```
my-service/
├── encore.service.ts
├── api.ts
└── migrations/
    ├── 001_initial_schema.up.sql
    └── 002_add_indexes.up.sql
```

## Database Operations

### Supported Methods
**IMPORTANT**: These are the ONLY supported methods when using SQLDatabase module with Encore.ts. Do not use any methods not listed here.

#### query
Returns async iterator for multiple rows:

```typescript
const allTodos = await db.query`SELECT * FROM todo_item`;
for await (const todo of allTodos) {
  // Process each todo
}
```

**With Type Safety**:
```typescript
const rows = await db.query<{ email: string; source_url: string; scraped_at: Date }>`
  SELECT email, source_url, created_at as scraped_at
  FROM scraped_emails
  ORDER BY created_at DESC
`;

// Fetch all rows and return as array
const emails = [];
for await (const row of rows) {
  emails.push(row);
}

return { emails };
```

#### queryRow
Returns single row or null:

```typescript
async function getTodoTitle(id: number): string | undefined {
  const row = await db.queryRow`SELECT title FROM todo_item WHERE id = ${id}`;
  return row?.title;
}
```

#### exec
For inserts and queries not returning rows:

```typescript
await db.exec`
  INSERT INTO todo_item (title, done)
  VALUES (${title}, false)
`;
```

## Database Access via CLI

### Open psql Shell
```bash
encore db shell database-name [--env=name]
```

Flags:
- `--write`: Write access
- `--admin`: Admin access
- `--superuser`: Superuser access

### Get Connection String
```bash
encore db conn-uri database-name [--env=name]
```

### Setup Local Proxy
```bash
encore db proxy [--env=name]
```

### Reset Databases
```bash
encore db reset [service-names...]
```

## Error Handling

- Encore automatically rolls back failed migrations
- Migration tracking stored in `schema_migrations` table
- Columns:
  - `version` (bigint): Tracks last applied migration
  - `dirty` (boolean): Not used by default

## Advanced Topics

### Sharing Databases

**Method 1**: Export SQLDatabase object from shared module
```typescript
// shared/db.ts
import { SQLDatabase } from "encore.dev/storage/sqldb";
export const sharedDB = new SQLDatabase("shared", {
  migrations: "./migrations",
});

// service/api.ts
import { sharedDB } from "../shared/db";
```

**Method 2**: Use named reference
```typescript
import { SQLDatabase } from "encore.dev/storage/sqldb";
const db = SQLDatabase.named("existing-database-name");
```

### PostgreSQL Extensions

Available extensions:
- **pgvector**: Vector similarity search
- **PostGIS**: Geographic information systems

Uses `encoredotdev/postgres` Docker image.

## ORM Integration

### Compatibility Requirements
- ORM must support standard SQL driver connection
- Migration framework must generate standard SQL files

### Supported ORMs
- **Prisma**
- **Drizzle**

### Drizzle Example

**Database Setup**:
```typescript
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "./schema";

const db = new SQLDatabase("test", {
  migrations: {
    path: "migrations",
    source: "drizzle",
  },
});

const orm = drizzle(db.connectionString);
await orm.select().from(users);
```

**Drizzle Config** (`drizzle.config.ts`):
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: 'migrations',
  schema: 'schema.ts',
  dialect: 'postgresql',
});
```

**Schema Definition** (`schema.ts`):
```typescript
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(),
});
```

**Generate Migrations**:
```bash
drizzle-kit generate
```

**Migration Application**:
Migrations are automatically applied during Encore application runtime. Manual migration commands are not required.

## Connection String Usage

For ORMs and custom database tools:

```typescript
import { SQLDatabase } from "encore.dev/storage/sqldb";

const SiteDB = new SQLDatabase("siteDB", {
  migrations: "./migrations",
});

// Use the connection string with your ORM
const connStr = SiteDB.connectionString;
```

## Best Practices

1. **Always use parameterized queries**: Template literals automatically parameterize values
2. **Type your query results**: Use type parameters for better type safety
3. **Keep migrations sequential**: Never skip numbers in migration filenames
4. **Test migrations locally**: Use `encore run` to apply migrations before deploying
5. **Use transactions for complex operations**: Wrap multiple operations in database transactions
6. **Avoid manual schema_migrations edits**: Let Encore manage the migration table

