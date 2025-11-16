# Logging & Monitoring Reference

This reference covers structured logging, metadata access, and monitoring patterns in Encore.ts applications.

## Structured Logging

Built-in structured logging combining free-form messages with type-safe key-value pairs.

### Basic Usage

```typescript
import log from "encore.dev/log";

// Simple message
log.info("user logged in");

// With structured data
log.info("user logged in", { 
  userId: "user-123", 
  method: "oauth" 
});

// Error logging
log.error(err, "failed to process payment");
```

### Log Levels

Available log levels (from least to most severe):

```typescript
log.trace("detailed tracing information");
log.debug("debugging information");
log.info("general information");
log.warn("warning conditions");
log.error(err, "critical issues");
```

### Contextual Logging

Group logs with shared key-value pairs:

```typescript
// Create logger with context
const logger = log.with({ 
  userId: "user-123",
  requestId: "req-456" 
});

// All logs include the context
logger.info("processing order");           // includes userId and requestId
logger.info("payment completed", { 
  amount: 99.99 
});  // includes userId, requestId, and amount
```

### API Endpoint Logging

```typescript
import { api } from "encore.dev/api";
import log from "encore.dev/log";

export const processOrder = api(
  { method: "POST", path: "/order" },
  async (order: Order) => {
    log.info("processing order", { 
      orderId: order.id,
      userId: order.userId,
      amount: order.amount 
    });
    
    try {
      const result = await processPayment(order);
      log.info("order completed", { 
        orderId: order.id,
        transactionId: result.transactionId 
      });
      return result;
    } catch (err) {
      log.error(err, "order failed", { orderId: order.id });
      throw err;
    }
  }
);
```

## Application Metadata

Access environment and application information through metadata API.

### App Metadata

```typescript
import { appMeta } from "encore.dev";

const meta = appMeta();

// Available fields:
// - appId: Application name
// - apiBaseUrl: Public API access URL
// - environment: Current running environment
// - build: Version control revision information
// - deploy: Deployment ID and timestamp
```

### Environment Information

```typescript
import { appMeta } from "encore.dev";

const env = appMeta().environment;

// Environment type: "production" | "development" | "test" | "local"
console.log(env.type);

// Cloud provider: "aws" | "gcp" | "azure" | "local"
console.log(env.cloud);

// Environment name
console.log(env.name);
```

### Request Metadata

Get information about the current request:

```typescript
import { currentRequest } from "encore.dev";

export const myEndpoint = api({}, async () => {
  const req = currentRequest();
  
  if (!req) {
    // Called during service initialization
    return;
  }
  
  if (req.type === "api-call") {
    console.log("API:", req.api);
    console.log("Method:", req.method);
    console.log("Path:", req.path);
    console.log("Headers:", req.headers);
    console.log("Path params:", req.pathParams);
  } else if (req.type === "pubsub-message") {
    console.log("Topic:", req.topic);
    console.log("Subscription:", req.subscription);
    console.log("Message ID:", req.messageId);
    console.log("Delivery attempt:", req.deliveryAttempt);
  }
});
```

## Monitoring Patterns

### Environment-Based Behavior

```typescript
import { appMeta } from "encore.dev";

async function sendNotification(userId: string, message: string) {
  const env = appMeta().environment;
  
  switch (env.type) {
    case "test":
    case "development":
      // Skip actual notification in dev/test
      console.log(`Would send notification to ${userId}: ${message}`);
      break;
    
    case "production":
      // Send real notification
      await emailService.send(userId, message);
      log.info("notification sent", { userId });
      break;
  }
}
```

### Cloud-Specific Logic

```typescript
import { appMeta } from "encore.dev";

async function getStorageClient() {
  const cloud = appMeta().environment.cloud;
  
  switch (cloud) {
    case "aws":
      return new S3Client();
    case "gcp":
      return new GCSClient();
    case "azure":
      return new AzureBlobClient();
    case "local":
      return new LocalStorageClient();
    default:
      throw new Error(`Unsupported cloud: ${cloud}`);
  }
}
```

### Request Tracking

```typescript
import { currentRequest } from "encore.dev";
import log from "encore.dev/log";

export const trackedEndpoint = api({}, async () => {
  const req = currentRequest();
  
  if (req?.type === "api-call") {
    const logger = log.with({
      path: req.path,
      method: req.method,
      requestId: req.headers["x-request-id"]
    });
    
    logger.info("request started");
    
    try {
      const result = await performOperation();
      logger.info("request completed", { result });
      return result;
    } catch (err) {
      logger.error(err, "request failed");
      throw err;
    }
  }
});
```

### Performance Monitoring

```typescript
import log from "encore.dev/log";

async function monitoredOperation<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  
  try {
    const result = await operation();
    const duration = Date.now() - start;
    
    log.info("operation completed", {
      operation: name,
      duration,
      success: true
    });
    
    return result;
  } catch (err) {
    const duration = Date.now() - start;
    
    log.error(err, "operation failed", {
      operation: name,
      duration,
      success: false
    });
    
    throw err;
  }
}

// Usage
export const processData = api({}, async (data: Data) => {
  return await monitoredOperation("process-data", async () => {
    return await heavyProcessing(data);
  });
});
```

### Error Tracking

```typescript
import log from "encore.dev/log";
import { APIError } from "encore.dev/api";

class ErrorTracker {
  private errorCounts = new Map<string, number>();
  
  track(error: Error, context: Record<string, any>) {
    const errorKey = error.constructor.name;
    const count = (this.errorCounts.get(errorKey) || 0) + 1;
    this.errorCounts.set(errorKey, count);
    
    log.error(error, "tracked error", {
      ...context,
      errorType: errorKey,
      errorCount: count
    });
    
    // Alert if error threshold exceeded
    if (count > 10) {
      this.sendAlert(errorKey, count);
    }
  }
  
  private sendAlert(errorType: string, count: number) {
    log.warn("error threshold exceeded", {
      errorType,
      count,
      alert: true
    });
  }
}

const errorTracker = new ErrorTracker();

export const riskyOperation = api({}, async (data: Data) => {
  try {
    return await performRiskyOperation(data);
  } catch (err) {
    errorTracker.track(err as Error, { operation: "risky", data });
    throw APIError.internal("operation failed");
  }
});
```

## CLI Logging Commands

### Stream Application Logs

```bash
# Stream logs from local development
encore run

# Stream logs from cloud environment
encore logs --env=prod

# Stream logs in JSON format
encore logs --env=prod --json
```

## Best Practices

1. **Use appropriate log levels**: Reserve `error` for actual errors, use `info` for normal operations
2. **Include context**: Add relevant key-value pairs to make logs searchable
3. **Use contextual loggers**: Create loggers with shared context for related operations
4. **Don't log sensitive data**: Avoid logging passwords, tokens, or personal information
5. **Log at boundaries**: Log at API entry/exit, service calls, and database operations
6. **Use structured data**: Prefer key-value pairs over string interpolation
7. **Be consistent**: Use consistent field names across your application
8. **Include error details**: Always pass the error object to `log.error()`
9. **Monitor log volume**: Be mindful of log verbosity in production
10. **Use environment checks**: Adjust logging behavior based on environment

## Common Logging Patterns

### Request/Response Logging

```typescript
import { api, middleware } from "encore.dev/api";
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

### Database Query Logging

```typescript
async function loggedQuery<T>(
  sql: string,
  queryFn: () => AsyncIterableIterator<T>
): Promise<T[]> {
  const start = Date.now();
  
  log.debug("executing query", { sql });
  
  try {
    const results: T[] = [];
    for await (const row of queryFn()) {
      results.push(row);
    }
    
    const duration = Date.now() - start;
    log.debug("query completed", { 
      sql, 
      duration,
      rowCount: results.length 
    });
    
    return results;
  } catch (err) {
    log.error(err as Error, "query failed", { sql });
    throw err;
  }
}
```

### Business Event Logging

```typescript
// Track important business events
function logBusinessEvent(
  event: string,
  details: Record<string, any>
) {
  log.info("business event", {
    event,
    ...details,
    timestamp: new Date().toISOString()
  });
}

// Usage
export const completeOrder = api({}, async (order: Order) => {
  // ... process order ...
  
  logBusinessEvent("order_completed", {
    orderId: order.id,
    userId: order.userId,
    amount: order.amount,
    items: order.items.length
  });
});
```

