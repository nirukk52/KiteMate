# Middleware & CORS Reference

This reference covers middleware implementation and CORS configuration in Encore.ts applications.

## Middleware

Reusable code running before/after API requests across multiple endpoints.

### Basic Implementation

```typescript
import { middleware } from "encore.dev/api";
import { Service } from "encore.dev/service";

const loggingMiddleware = middleware(
  { target: { auth: true } },
  async (req, next) => {
    // Pre-handler logic
    console.log("Request started");
    
    // Call the endpoint handler
    const resp = await next(req);
    
    // Post-handler logic
    console.log("Request completed");
    
    return resp;
  }
);

export default new Service("myService", {
  middlewares: [loggingMiddleware],
});
```

### Middleware Configuration

```typescript
import { Service } from "encore.dev/service";

export default new Service("myService", {
  middlewares: [
    first,   // Executes first
    second,  // Executes second
    third    // Executes third
  ],
});
```

**Execution Order**:
- Middleware executes in order of definition
- Pre-handler logic runs in forward order (1 → 2 → 3)
- Post-handler logic runs in reverse order (3 → 2 → 1)

### Request Access Types

#### Typed API Endpoints

```typescript
const apiMiddleware = middleware({}, async (req, next) => {
  // Access request metadata
  console.log("Path:", req.requestMeta.path);
  console.log("Method:", req.requestMeta.method);
  console.log("Headers:", req.requestMeta.headers);
  
  return await next(req);
});
```

#### Streaming Endpoints

```typescript
const streamMiddleware = middleware({}, async (req, next) => {
  // Access request metadata and stream
  console.log("Stream endpoint:", req.requestMeta.path);
  
  // Can interact with stream
  const resp = await next(req);
  
  return resp;
});
```

#### Raw Endpoints

```typescript
const rawMiddleware = middleware({}, async (req, next) => {
  // Access raw Node.js request/response
  const nodeReq = req.rawRequest;
  const nodeResp = req.rawResponse;
  
  console.log("URL:", nodeReq.url);
  console.log("Method:", nodeReq.method);
  
  return await next(req);
});
```

### Response Handling

Modify response headers:

```typescript
const headerMiddleware = middleware({}, async (req, next) => {
  const resp = await next(req);
  
  // Set header (replaces existing)
  resp.header.set("X-Custom-Header", "value");
  
  // Add header (allows multiple values)
  resp.header.add("X-Multiple-Header", "value1");
  resp.header.add("X-Multiple-Header", "value2");
  
  return resp;
});
```

### Targeting Specific Endpoints

Apply middleware only to specific endpoints:

```typescript
// Only authenticated endpoints
const authMiddleware = middleware(
  { target: { auth: true } },
  async (req, next) => {
    console.log("Auth required endpoint");
    return await next(req);
  }
);

// Only public endpoints
const publicMiddleware = middleware(
  { target: { auth: false } },
  async (req, next) => {
    console.log("Public endpoint");
    return await next(req);
  }
);

// All endpoints (default)
const allMiddleware = middleware({}, async (req, next) => {
  console.log("All endpoints");
  return await next(req);
});
```

**Best Practice**: Use the `target` option instead of runtime filtering for better performance.

## Common Middleware Patterns

### Request Logging

```typescript
import log from "encore.dev/log";

const requestLogger = middleware({}, async (req, next) => {
  const start = Date.now();
  
  log.info("request started", {
    path: req.requestMeta.path,
    method: req.requestMeta.method
  });
  
  try {
    const resp = await next(req);
    const duration = Date.now() - start;
    
    log.info("request completed", {
      path: req.requestMeta.path,
      duration,
      status: resp.status || 200
    });
    
    return resp;
  } catch (err) {
    const duration = Date.now() - start;
    
    log.error(err as Error, "request failed", {
      path: req.requestMeta.path,
      duration
    });
    
    throw err;
  }
});
```

### Rate Limiting

```typescript
import { APIError } from "encore.dev/api";

const rateLimits = new Map<string, { count: number; resetAt: number }>();

const rateLimitMiddleware = middleware({}, async (req, next) => {
  const ip = req.requestMeta.headers["x-forwarded-for"] as string || "unknown";
  const now = Date.now();
  
  let limit = rateLimits.get(ip);
  
  if (!limit || now > limit.resetAt) {
    limit = { count: 0, resetAt: now + 60000 }; // 1 minute window
    rateLimits.set(ip, limit);
  }
  
  limit.count++;
  
  if (limit.count > 100) { // 100 requests per minute
    throw APIError.resourceExhausted("rate limit exceeded");
  }
  
  return await next(req);
});
```

### Request ID Tracking

```typescript
import { randomUUID } from "crypto";

const requestIdMiddleware = middleware({}, async (req, next) => {
  // Get or generate request ID
  const requestId = 
    req.requestMeta.headers["x-request-id"] as string || 
    randomUUID();
  
  // Add to response headers
  const resp = await next(req);
  resp.header.set("X-Request-ID", requestId);
  
  return resp;
});
```

### Performance Monitoring

```typescript
import log from "encore.dev/log";

const performanceMiddleware = middleware({}, async (req, next) => {
  const start = performance.now();
  
  const resp = await next(req);
  
  const duration = performance.now() - start;
  
  // Log slow requests
  if (duration > 1000) {
    log.warn("slow request", {
      path: req.requestMeta.path,
      duration: Math.round(duration)
    });
  }
  
  return resp;
});
```

### Error Handling

```typescript
import { APIError } from "encore.dev/api";
import log from "encore.dev/log";

const errorHandlerMiddleware = middleware({}, async (req, next) => {
  try {
    return await next(req);
  } catch (err) {
    // Log error
    log.error(err as Error, "unhandled error", {
      path: req.requestMeta.path
    });
    
    // Convert unknown errors to API errors
    if (!(err instanceof APIError)) {
      throw APIError.internal("internal server error");
    }
    
    throw err;
  }
});
```

## CORS Configuration

### Overview

CORS (Cross-Origin Resource Sharing) controls which website origins can access your API from browsers.

**Scope**: Browser requests to resources on different origins (scheme, domain, or port)

### Configuration Location

Specified in `encore.app` file under `global_cors` key:

```cue
{
  "global_cors": {
    "debug": false,
    "allow_origins_without_credentials": ["*"],
    "allow_origins_with_credentials": [
      "https://example.com",
      "https://*.example.com"
    ],
    "allow_headers": ["Content-Type", "Authorization"],
    "expose_headers": ["X-Request-ID"]
  }
}
```

### Configuration Options

#### debug
- **Type**: boolean
- **Description**: Enables CORS debug logging
- **Default**: false

```cue
"debug": true
```

#### allow_headers
- **Type**: string[]
- **Description**: Additional accepted headers beyond defaults
- **Special value**: `"*"` for all headers

```cue
"allow_headers": ["Content-Type", "Authorization", "X-Custom-Header"]
// OR
"allow_headers": ["*"]
```

#### expose_headers
- **Type**: string[]
- **Description**: Additional exposed headers beyond defaults
- **Special value**: `"*"` for all headers

```cue
"expose_headers": ["X-Request-ID", "X-Custom-Header"]
// OR
"expose_headers": ["*"]
```

#### allow_origins_without_credentials
- **Type**: string[]
- **Description**: Allowed origins for non-credentialed requests
- **Default**: `["*"]`

```cue
"allow_origins_without_credentials": ["https://example.com"]
```

#### allow_origins_with_credentials
- **Type**: string[]
- **Description**: Allowed origins for credentialed requests (cookies, auth headers)
- **Wildcard support**: Yes

```cue
"allow_origins_with_credentials": [
  "https://app.example.com",
  "https://*.example.com",              // Any subdomain
  "https://*-myapp.example.com"         // Pattern matching
]
```

### Default CORS Behavior

Without configuration:
- ✅ Allows unauthenticated requests from all origins
- ❌ Disallows authenticated requests from other origins
- ✅ All origins allowed in local development

### Complete CORS Example

```cue
// encore.app
{
  "id": "my-app",
  "global_cors": {
    "debug": false,
    "allow_origins_without_credentials": [
      "https://website.com",
      "https://blog.example.com"
    ],
    "allow_origins_with_credentials": [
      "https://app.example.com",
      "https://*.app.example.com"
    ],
    "allow_headers": [
      "Content-Type",
      "Authorization",
      "X-Api-Key"
    ],
    "expose_headers": [
      "X-Request-ID",
      "X-RateLimit-Remaining"
    ]
  }
}
```

### Header Handling

#### Automatic Configuration
Encore automatically configures headers through static analysis:
- Detects header fields in request/response types
- Automatically adds them to CORS configuration

```typescript
import { Header } from "encore.dev/api";

interface Request {
  authorization: Header<"Authorization">;  // Auto-configured for CORS
}
```

#### Manual Configuration
Add custom headers for raw endpoints not detected by static analysis:

```cue
"allow_headers": ["X-Webhook-Signature"],
"expose_headers": ["X-Processing-Time"]
```

### CORS in Development

In local development (`encore run`):
- All origins automatically allowed
- No CORS restrictions
- Easier testing and development

### CORS Debugging

Enable debug logging:

```cue
"global_cors": {
  "debug": true
}
```

Debug logs will show:
- CORS preflight requests
- Allowed/rejected origins
- Header validation
- Configuration issues

## Best Practices

### Middleware
1. **Order matters**: Place security middleware first
2. **Use targeting**: Apply middleware only where needed
3. **Keep middleware focused**: One responsibility per middleware
4. **Avoid blocking operations**: Keep middleware fast
5. **Handle errors**: Always handle errors in middleware
6. **Use context**: Share data between middleware layers
7. **Test middleware independently**: Unit test middleware logic

### CORS
1. **Be specific**: List exact origins instead of using wildcards
2. **Separate credentials**: Use different origins for credentialed/non-credentialed
3. **Limit headers**: Only allow necessary headers
4. **Test in production-like environment**: CORS behaves differently in development
5. **Use HTTPS in production**: Always use secure origins
6. **Document CORS policies**: Keep track of allowed origins and reasons
7. **Monitor CORS errors**: Watch for rejected requests in logs

