# Pub/Sub Messaging Reference

This reference covers asynchronous event broadcasting between services using Encore.ts Pub/Sub system.

## Overview

Pub/Sub (Publish/Subscribe) is a system for asynchronous event broadcasting between services.

**Benefits**:
- Decouples services for better reliability
- Improves system responsiveness
- Cloud-agnostic implementation
- Enables event-driven architectures

## Topics

### Creating Topics

**Rules**:
- Must be package level variables
- Cannot be created inside functions
- Accessible from any service

```typescript
import { Topic } from "encore.dev/pubsub";

export interface SignupEvent {
  userID: string;
}

export const signups = new Topic<SignupEvent>("signups", {
  deliveryGuarantee: "at-least-once",
});
```

### Publishing Events

Publish events using the `publish` method:

```typescript
const messageID = await signups.publish({ userID: id });
```

**Returns**: Message ID that can be used for tracking

## Subscriptions

### Creating Subscriptions

**Requirements**:
- Topic to subscribe to
- Unique name for subscription
- Handler function
- Configuration object

```typescript
import { Subscription } from "encore.dev/pubsub";

const _ = new Subscription(signups, "send-welcome-email", {
  handler: async (event) => {
    // Send a welcome email using the event data
    await sendWelcomeEmail(event.userID);
  },
});
```

### Handler Function

The handler function receives the event data:

```typescript
const _ = new Subscription(signups, "update-analytics", {
  handler: async (event: SignupEvent) => {
    console.log(`New signup: ${event.userID}`);
    await updateAnalytics(event);
  },
});
```

## Error Handling

### Retry Policy
- Failed events are automatically retried based on retry policy
- After max retries, events move to dead-letter queue (DLQ)
- Configure retry behavior in subscription options

### Making Handlers Idempotent
Since messages may be delivered more than once, handlers must be idempotent:

```typescript
const _ = new Subscription(signups, "create-user-record", {
  handler: async (event: SignupEvent) => {
    // Use upsert or check existence to ensure idempotency
    await db.exec`
      INSERT INTO user_records (user_id, created_at)
      VALUES (${event.userID}, NOW())
      ON CONFLICT (user_id) DO NOTHING
    `;
  },
});
```

## Delivery Guarantees

### At-Least-Once (Default)
- Default delivery mode
- Messages may be delivered multiple times
- Higher throughput
- **Requirement**: Handlers must be idempotent

```typescript
export const events = new Topic<Event>("events", {
  deliveryGuarantee: "at-least-once",
});
```

### Exactly-Once
- Stronger delivery guarantees
- Minimizes (but doesn't eliminate) duplicates
- Performance limitations:
  - **AWS**: 300 messages per second per topic
  - **GCP**: 3,000+ messages per second per region

```typescript
export const events = new Topic<Event>("events", {
  deliveryGuarantee: "exactly-once",
});
```

**Note**: Does not deduplicate on publish side—only on delivery side.

## Advanced Features

### Message Attributes

Key-value pairs for filtering or ordering:

```typescript
import { Topic, Attribute } from "encore.dev/pubsub";

export interface SignupEvent {
  userID: string;
  source: Attribute<string>;
}

export const signups = new Topic<SignupEvent>("signups", {
  deliveryGuarantee: "at-least-once",
});

// Publishing with attributes
await signups.publish({
  userID: "user-123",
  source: "web",
});
```

### Ordered Delivery

Messages delivered in order by ordering attribute:

```typescript
import { Topic, Attribute } from "encore.dev/pubsub";

export interface CartEvent {
  shoppingCartID: Attribute<number>;
  event: string;
}

export const cartEvents = new Topic<CartEvent>("cart-events", {
  deliveryGuarantee: "at-least-once",
  orderingAttribute: "shoppingCartID",
});
```

**Performance Limitations**:
- **AWS**: 300 messages per second per topic
- **GCP**: 1 MBps per ordering key

**Note**: No effect in local development environments.

### Subscription Configuration

```typescript
const _ = new Subscription(events, "processor", {
  handler: async (event) => {
    // Process event
  },
  retryPolicy: {
    maxRetries: 5,
    minBackoff: "1s",
    maxBackoff: "1h",
  },
  ackDeadline: "30s",
});
```

## Common Patterns

### Fan-Out Pattern
One publisher, multiple subscribers:

```typescript
// Publisher
export const orderPlaced = new Topic<OrderEvent>("order-placed", {
  deliveryGuarantee: "at-least-once",
});

// Multiple subscribers for different concerns
const _ = new Subscription(orderPlaced, "send-confirmation-email", {
  handler: async (event) => await sendEmail(event),
});

const __ = new Subscription(orderPlaced, "update-inventory", {
  handler: async (event) => await decrementStock(event),
});

const ___ = new Subscription(orderPlaced, "analytics-tracking", {
  handler: async (event) => await trackOrder(event),
});
```

### Event Sourcing
Capture all state changes as events:

```typescript
export interface UserEvent {
  type: "created" | "updated" | "deleted";
  userID: string;
  data: any;
}

export const userEvents = new Topic<UserEvent>("user-events", {
  deliveryGuarantee: "at-least-once",
});

// Publish all user changes
await userEvents.publish({
  type: "created",
  userID: "user-123",
  data: { email: "user@example.com" },
});
```

### Dead Letter Queue Handling
Process failed messages:

```typescript
const _ = new Subscription(signups, "critical-handler", {
  handler: async (event) => {
    try {
      await criticalOperation(event);
    } catch (err) {
      // Log error for DLQ investigation
      console.error("Failed to process event", { event, error: err });
      throw err; // Re-throw to trigger retry
    }
  },
});
```

## Best Practices

1. **Design for idempotency**: Always assume messages may be delivered multiple times
2. **Use appropriate delivery guarantees**: Choose based on throughput needs and consistency requirements
3. **Keep handlers fast**: Avoid long-running operations; consider using queues for heavy work
4. **Monitor DLQs**: Set up alerts for messages in dead-letter queues
5. **Version your events**: Include version fields in event structures for backward compatibility
6. **Use descriptive names**: Make topic and subscription names clear and meaningful
7. **Handle errors gracefully**: Log errors with context for debugging
8. **Test subscriber handlers**: Unit test handlers independently of pub/sub infrastructure
9. **Consider ordering requirements**: Only use ordered delivery when necessary due to performance impact
10. **Use attributes strategically**: Leverage attributes for filtering without loading full message

