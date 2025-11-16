# Application Structure & Services Reference

This reference covers how to structure Encore.ts applications, define services, and organize code for scalability.

## Core Principles

1. **Use monorepo design** for entire backend application
2. **One Encore app** enables full application model benefits
3. **Supports both monolith and microservices** approaches
4. **Services cannot be nested** within other services

## Service Definition

### Creating a Service

1. Create `encore.service.ts` file in service directory
2. Export service instance using Service class

```typescript
import { Service } from "encore.dev/service";
export default new Service("my-service");
```

## Application Patterns

### Pattern 1: Single Service

**Best for**: New projects, simple applications, rapid prototyping

```
/my-app
├── package.json
├── encore.app
├── encore.service.ts    // service root
├── api.ts              // endpoints
└── db.ts               // database
```

**When to use**:
- Starting a new project
- MVP development
- Small to medium applications
- Single team ownership

### Pattern 2: Multi-Service

**Best for**: Distributed systems with multiple independent services

```
/my-app
├── encore.app
├── hello/
│   ├── migrations/
│   ├── encore.service.ts
│   ├── hello.ts
│   └── hello_test.ts
└── world/
    ├── encore.service.ts
    └── world.ts
```

**When to use**:
- Clear service boundaries
- Different teams owning different services
- Independent scaling requirements
- Different deployment schedules

### Pattern 3: Large-Scale (Systems-Based)

**Best for**: Large applications with multiple teams and complex domains

```
/my-trello-clone
├── encore.app
├── trello/             // system
│   ├── board/         // service
│   │   ├── encore.service.ts
│   │   ├── api.ts
│   │   └── migrations/
│   └── card/          // service
│       ├── encore.service.ts
│       └── api.ts
├── premium/           // system
│   ├── payment/       // service
│   └── subscription/  // service
└── usr/               // system
    ├── org/           // service
    └── user/          // service
```

**When to use**:
- Large organization
- Multiple development teams
- Complex business domains
- Need for domain-driven design

## Service Organization Best Practices

### Internal File Structure

For each service, organize files by concern:

```
my-service/
├── encore.service.ts       // Service definition
├── api.ts                  // API endpoints
├── db.ts                   // Database instance
├── models.ts               // TypeScript interfaces
├── business-logic.ts       // Core business logic
├── validators.ts           // Custom validation
├── utils.ts                // Utility functions
├── migrations/             // Database migrations
│   ├── 001_initial.up.sql
│   └── 002_add_index.up.sql
└── tests/
    ├── api.test.ts
    └── logic.test.ts
```

### Shared Code Organization

For code shared across services:

```
/my-app
├── encore.app
├── shared/
│   ├── types.ts           // Shared TypeScript types
│   ├── constants.ts       // App-wide constants
│   ├── utils.ts           // Utility functions
│   └── errors.ts          // Custom error types
├── service-a/
│   └── encore.service.ts
└── service-b/
    └── encore.service.ts
```

### Using Shared Code

```typescript
// shared/types.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

// service-a/api.ts
import { User } from "../shared/types";

export const getUser = api(
  { method: "GET", path: "/user/:id" },
  async ({ id }: { id: string }): Promise<User> => {
    // Implementation
  }
);
```

## Package Management

### Default Approach (Recommended)
Use a single root-level `package.json` file (monorepo approach):

```json
{
  "name": "my-encore-app",
  "version": "1.0.0",
  "dependencies": {
    "encore.dev": "^1.0.0",
    "some-library": "^2.0.0"
  }
}
```

**Benefits**:
- Simpler dependency management
- Consistent versions across services
- Easier to set up and maintain
- Works seamlessly with Encore.ts

### Alternative Approach
Separate `package.json` files in sub-packages:

**Limitations**:
- Encore.ts application must use one package with a single `package.json`
- Other separate packages must be pre-transpiled to JavaScript

**Example**:
```
/my-app
├── package.json              // Main Encore app dependencies
├── encore-app/
│   ├── service-a/
│   └── service-b/
└── shared-lib/              // Separate package
    ├── package.json
    ├── dist/                // Pre-transpiled JS
    └── src/
```

## Service Communication

### Type-Safe Service Calls

Import services from `~encore/clients`:

```typescript
// service-a/api.ts
import { api } from "encore.dev/api";

export const getUserData = api(
  { method: "GET" },
  async ({ userId }: { userId: string }) => {
    return { userId, name: "John" };
  }
);

// service-b/api.ts
import { serviceA } from "~encore/clients";

export const getEnrichedData = api(
  { method: "GET" },
  async ({ userId }: { userId: string }) => {
    // Type-safe call to service-a
    const userData = await serviceA.getUserData({ userId });
    return { ...userData, enriched: true };
  }
);
```

**Benefits**:
- Full TypeScript type safety
- IDE autocompletion
- Compile-time validation
- Automatic service discovery

## Middleware Configuration

Apply middleware at the service level:

```typescript
import { Service } from "encore.dev/service";
import { middleware } from "encore.dev/api";

const loggingMiddleware = middleware(
  { target: { auth: true } },
  async (req, next) => {
    console.log(`Request to ${req.requestMeta.path}`);
    const resp = await next(req);
    console.log(`Response status: ${resp.status}`);
    return resp;
  }
);

export default new Service("my-service", {
  middlewares: [loggingMiddleware],
});
```

## Gateway Configuration

Configure API gateway for the entire application:

```typescript
import { Gateway } from "encore.dev/api";
import { auth } from "./auth";

export const gateway = new Gateway({
  authHandler: auth,
});
```

## Environment-Specific Configuration

Use metadata API for environment-specific behavior:

```typescript
import { appMeta } from "encore.dev";

export const getSetting = () => {
  const env = appMeta().environment;
  
  switch (env.type) {
    case "production":
      return { apiTimeout: 5000, debug: false };
    case "development":
      return { apiTimeout: 30000, debug: true };
    case "test":
      return { apiTimeout: 1000, debug: false };
    default:
      return { apiTimeout: 5000, debug: false };
  }
};
```

## Best Practices

1. **Start simple**: Begin with single service, split when needed
2. **Define clear boundaries**: Each service should have a single responsibility
3. **Minimize cross-service calls**: Reduce latency and complexity
4. **Use shared types**: Define common interfaces in shared modules
5. **Keep services independent**: Avoid tight coupling between services
6. **Document service APIs**: Add comments explaining endpoint purposes
7. **Test services independently**: Write unit tests for each service
8. **Use consistent naming**: Follow naming conventions across services
9. **Monitor service health**: Track performance and errors per service
10. **Plan for growth**: Design structure that can scale with team size

## Migration Path

### From Monolith to Microservices

1. **Identify service boundaries**: Look for natural domain separations
2. **Extract one service at a time**: Don't try to split everything at once
3. **Start with least dependent**: Extract services with fewer dependencies first
4. **Use feature flags**: Gradually migrate traffic to new services
5. **Maintain compatibility**: Keep old interfaces during transition
6. **Test thoroughly**: Ensure functionality preserved after split

