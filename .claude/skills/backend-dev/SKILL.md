---
name: backend-dev
description: This skill should be used when building backend applications with Encore.ts, a TypeScript backend framework. Use this skill for creating APIs, managing databases, implementing authentication, handling async messaging (Pub/Sub), managing storage, scheduling tasks (cron jobs), implementing middleware, configuring CORS, managing secrets, and structuring backend services. This skill is triggered when users need to create or modify backend services, endpoints, databases, authentication systems, or any other backend infrastructure using Encore.ts.
---

# Backend Development with Encore.ts

## Overview

This skill provides comprehensive guidance for building production-ready backend applications using Encore.ts, a TypeScript backend framework that provides type-safe APIs, automatic infrastructure provisioning, and built-in best practices for distributed systems.

## Core Capabilities

This skill covers all aspects of backend development with Encore.ts:

### 1. API Development
- Type-safe REST API endpoints
- Request/response validation
- Raw endpoints for custom HTTP handling
- Streaming APIs via WebSocket
- Static asset serving
- GraphQL support

### 2. Database Management
- PostgreSQL database integration
- Migration management
- Type-safe query execution
- ORM support (Drizzle, Prisma)

### 3. Authentication & Authorization
- Custom auth handlers
- Token validation (JWT, API keys, sessions)
- Auth data propagation
- Protected endpoints

### 4. Asynchronous Messaging
- Pub/Sub topics and subscriptions
- Event-driven architecture
- Delivery guarantees (at-least-once, exactly-once)
- Ordered message delivery

### 5. Storage & Caching
- Object storage (S3-compatible)
- File upload/download
- Public/private buckets
- Caching strategies

### 6. Scheduled Tasks
- Cron jobs with periodic or cron expression schedules
- Background task execution
- Automated maintenance tasks

### 7. Middleware & CORS
- Request/response middleware
- Cross-origin resource sharing configuration
- Custom header handling

### 8. Logging & Monitoring
- Structured logging
- Application metadata access
- Environment-based configuration
- Performance monitoring

### 9. Configuration Management
- Secret management
- Environment-specific configuration
- Feature flags

### 10. Application Architecture
- Service organization
- Monorepo structure
- Microservices patterns
- Service-to-service communication

## When to Use This Skill

Use this skill when:
- Creating new Encore.ts backend services
- Implementing API endpoints (REST, streaming, or GraphQL)
- Setting up database schemas and migrations
- Implementing authentication or authorization
- Building event-driven architectures with Pub/Sub
- Managing file storage or implementing caching
- Scheduling background jobs or periodic tasks
- Configuring middleware or CORS policies
- Managing secrets and environment configuration
- Structuring large-scale backend applications

## Quick Start Guide

### Creating a New Service

Define a service using `encore.service.ts`:

```typescript
import { Service } from "encore.dev/service";
export default new Service("my-service");
```

### Creating an API Endpoint

```typescript
import { api } from "encore.dev/api";

interface HelloRequest {
  name: string;
}

interface HelloResponse {
  message: string;
}

export const hello = api(
  { method: "POST", expose: true },
  async (req: HelloRequest): Promise<HelloResponse> => {
    return { message: `Hello, ${req.name}!` };
  }
);
```

### Setting Up a Database

```typescript
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("mydb", {
  migrations: "./migrations",
});

// Create migration: migrations/001_initial.up.sql
```

### Querying the Database

```typescript
// Fetch multiple rows
const users = await db.query`SELECT * FROM users`;
for await (const user of users) {
  console.log(user.name);
}

// Fetch single row
const user = await db.queryRow`SELECT * FROM users WHERE id = ${userId}`;

// Execute insert/update
await db.exec`INSERT INTO users (name, email) VALUES (${name}, ${email})`;
```

## Working with Detailed References

This skill includes comprehensive reference documentation in the `references/` directory. Load these references when working on specific features:

### API Development
**Reference**: `references/api-endpoints.md`

Load when:
- Creating new endpoints
- Implementing validation
- Adding streaming support
- Setting up raw endpoints
- Handling API errors

### Database Operations
**Reference**: `references/databases.md`

Load when:
- Setting up databases
- Creating migrations
- Writing queries
- Integrating ORMs
- Troubleshooting database issues

### Authentication
**Reference**: `references/authentication.md`

Load when:
- Implementing auth handlers
- Adding protected endpoints
- Working with JWT, API keys, or sessions
- Managing auth data propagation

### Pub/Sub Messaging
**Reference**: `references/pubsub-messaging.md`

Load when:
- Setting up event-driven architecture
- Creating topics and subscriptions
- Implementing message handlers
- Configuring delivery guarantees

### Storage & Caching
**Reference**: `references/storage-caching.md`

Load when:
- Implementing file uploads/downloads
- Setting up object storage buckets
- Implementing caching strategies
- Managing public/private assets

### Application Structure
**Reference**: `references/app-structure-services.md`

Load when:
- Organizing multi-service applications
- Setting up monorepo structure
- Planning service boundaries
- Implementing service-to-service calls

### Cron Jobs
**Reference**: `references/cron-jobs-scheduling.md`

Load when:
- Scheduling periodic tasks
- Creating background jobs
- Setting up automated maintenance
- Implementing complex schedules

### Logging & Monitoring
**Reference**: `references/logging-monitoring.md`

Load when:
- Implementing logging strategies
- Accessing application metadata
- Setting up environment-based behavior
- Monitoring application performance

### Middleware & CORS
**Reference**: `references/middleware-cors.md`

Load when:
- Creating request/response middleware
- Configuring CORS policies
- Implementing rate limiting
- Adding custom headers

### Secrets & Configuration
**Reference**: `references/secrets-config.md`

Load when:
- Managing API keys and secrets
- Setting up environment configuration
- Implementing feature flags
- Rotating credentials

## Development Workflow

### 1. Initial Setup

Create an Encore.ts application:

```bash
encore app create my-app
cd my-app
```

### 2. Define Service Structure

Start with single service for new projects:

```
my-app/
├── encore.app
├── package.json
├── encore.service.ts
├── api.ts
└── migrations/
```

### 3. Run Locally

```bash
encore run
```

Access local development dashboard at http://localhost:9400

### 4. Test Endpoints

```bash
# Using curl
curl http://localhost:4000/endpoint-name -X POST -d '{"key":"value"}'

# Or use the Encore Dev Dashboard
```

### 5. Apply Database Migrations

Migrations run automatically on `encore run`. View database:

```bash
# Open psql shell
encore db shell database-name

# Get connection string
encore db conn-uri database-name
```

### 6. Deploy

```bash
# Push to git (triggers automatic deployment if connected to Encore Cloud)
git push

# Or manually deploy
encore deploy
```

## Common Patterns

### Building a REST API

1. **Define service**: Create `encore.service.ts`
2. **Create endpoints**: Define API handlers in `api.ts`
3. **Add validation**: Use TypeScript interfaces for request/response
4. **Handle errors**: Use APIError for consistent error responses
5. **Test locally**: Use `encore run` and test endpoints

### Setting Up Authentication

1. **Create auth handler**: Implement `authHandler` in auth service
2. **Configure gateway**: Link auth handler to Gateway
3. **Protect endpoints**: Add `auth: true` to endpoint options
4. **Access auth data**: Use `getAuthData()` in protected endpoints

### Building Event-Driven Architecture

1. **Define topics**: Create Topic instances for events
2. **Publish events**: Call `topic.publish()` when events occur
3. **Create subscriptions**: Define Subscription instances with handlers
4. **Ensure idempotency**: Make handlers safe for duplicate delivery

### Implementing Background Jobs

1. **Create cron job**: Use `CronJob` with schedule
2. **Define endpoint**: Create API endpoint for job logic
3. **Handle failures**: Implement error handling and logging
4. **Test manually**: Call endpoint directly during development

## Best Practices

### Code Organization

- Start with single service, split when boundaries are clear
- Use shared modules for common types and utilities
- Keep services focused on single responsibility
- Document service APIs with comments explaining why each exists

### Database Management

- Always use parameterized queries (template literals)
- Keep migrations sequential and atomic
- Test migrations locally before deploying
- Use transactions for multi-step operations

### Error Handling

- Use APIError for consistent error responses
- Log errors with context for debugging
- Provide clear error messages to clients
- Handle edge cases explicitly

### Security

- Never commit secrets to version control
- Use auth handlers for protected endpoints
- Validate all user input
- Implement rate limiting for public endpoints
- Use HTTPS in production

### Performance

- Implement caching for expensive operations
- Use database indexes for common queries
- Monitor endpoint response times
- Implement pagination for large result sets

### Testing

- Test endpoints manually during development
- Write unit tests for business logic
- Test error conditions
- Verify authentication and authorization

## CLI Commands Reference

### Running Application
```bash
encore run              # Run locally with live reload
encore run --debug      # Run with debug logging
```

### Database Operations
```bash
encore db shell <db-name>        # Open psql shell
encore db conn-uri <db-name>     # Get connection string
encore db reset [service-name]   # Reset database
```

### Secrets Management
```bash
encore secret set --type prod <secret-name>    # Set production secret
encore secret list                             # List all secrets
```

### Logs
```bash
encore logs                    # Stream local logs
encore logs --env=prod         # Stream production logs
encore logs --json             # JSON formatted logs
```

### Code Generation
```bash
encore gen client <app-id> --lang=typescript    # Generate API client
```

## Troubleshooting

### Common Issues

**Issue**: Database connection errors
- **Solution**: Check connection string, verify database exists, check migrations

**Issue**: Authentication not working
- **Solution**: Verify auth handler is linked to Gateway, check auth data structure

**Issue**: CORS errors in browser
- **Solution**: Configure `global_cors` in `encore.app` file

**Issue**: Pub/Sub messages not delivered
- **Solution**: Check subscription handler, verify topic name, check error logs

**Issue**: Secrets not found
- **Solution**: Set secrets using CLI or dashboard, check environment type

### Getting Help

- Read detailed reference documentation in `references/` directory
- Check Encore.ts documentation: https://encore.dev/docs
- View example applications: https://github.com/encoredev/examples
- Use `encore --help` for CLI usage

## Example Applications

Reference these example repositories for complete implementations:

- **Hello World**: https://github.com/encoredev/examples/tree/main/ts/hello-world
- **URL Shortener**: https://github.com/encoredev/examples/tree/main/ts/url-shortener
- **Uptime Monitor**: https://github.com/encoredev/examples/tree/main/ts/uptime

## Resources

All detailed documentation is available in the `references/` directory:

- `api-endpoints.md` - Complete API development reference
- `databases.md` - Database and migration guide
- `authentication.md` - Auth implementation patterns
- `pubsub-messaging.md` - Event-driven architecture
- `storage-caching.md` - File storage and caching
- `app-structure-services.md` - Application organization
- `cron-jobs-scheduling.md` - Background task scheduling
- `logging-monitoring.md` - Logging and observability
- `middleware-cors.md` - Middleware and CORS config
- `secrets-config.md` - Secret and config management

Load specific references as needed when working on related features.
