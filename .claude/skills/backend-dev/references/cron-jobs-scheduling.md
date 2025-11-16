# Cron Jobs & Scheduling Reference

This reference covers declarative Cron Jobs in Encore.ts for periodic and recurring tasks.

## Overview

Encore.ts provides declarative Cron Jobs for running tasks on a schedule:
- Periodic intervals (every X minutes/hours)
- Complex schedules using Cron expressions
- Automatic execution and monitoring
- Cloud-agnostic implementation

## Basic Implementation

```typescript
import { CronJob } from "encore.dev/cron";
import { api } from "encore.dev/api";

const _ = new CronJob("welcome-email", {
  title: "Send welcome emails",
  every: "2h",
  endpoint: sendWelcomeEmail,
});

export const sendWelcomeEmail = api({}, async () => {
  // Send welcome emails...
  console.log("Sending welcome emails");
});
```

## Configuration Options

### Required Fields
- **id**: Unique identifier for the cron job (first parameter)
- **title**: Human-readable description
- **endpoint**: API endpoint to call
- **Schedule**: Either `every` or `schedule` (one required)

### Optional Fields
- **enabled**: Boolean to enable/disable the job (default: true)

## Scheduling Options

### Periodic Scheduling (`every`)

Runs on a periodic basis starting at midnight UTC.

**Constraint**: Interval must divide 24 hours evenly.

**Valid Examples**:
```typescript
const _ = new CronJob("backup", {
  title: "Database backup",
  every: "10m",  // Every 10 minutes
  endpoint: backupDatabase,
});

const __ = new CronJob("cleanup", {
  title: "Cleanup temp files",
  every: "6h",   // Every 6 hours
  endpoint: cleanupTempFiles,
});

const ___ = new CronJob("daily-report", {
  title: "Generate daily report",
  every: "24h",  // Every 24 hours (daily)
  endpoint: generateDailyReport,
});
```

**Invalid Examples**:
```typescript
// ❌ 7h - Does not divide 24 evenly
every: "7h"

// ❌ 90m - Does not divide 24 hours evenly
every: "90m"
```

**Valid Time Units**:
- `m`: Minutes
- `h`: Hours

### Advanced Scheduling (`schedule`)

Uses Cron expressions for complex scheduling patterns.

**Cron Expression Format**:
```
* * * * *
│ │ │ │ │
│ │ │ │ └── Day of week (0-6, Sunday = 0)
│ │ │ └──── Month (1-12)
│ │ └────── Day of month (1-31)
│ └──────── Hour (0-23)
└────────── Minute (0-59)
```

**Examples**:

```typescript
// Run at 4am UTC on the 15th of each month
const _ = new CronJob("monthly-report", {
  title: "Monthly report",
  schedule: "0 4 15 * *",
  endpoint: generateMonthlyReport,
});

// Run every weekday at 9am UTC
const __ = new CronJob("weekday-sync", {
  title: "Weekday data sync",
  schedule: "0 9 * * 1-5",
  endpoint: syncData,
});

// Run every Monday at midnight UTC
const ___ = new CronJob("weekly-cleanup", {
  title: "Weekly cleanup",
  schedule: "0 0 * * 1",
  endpoint: weeklyCleanup,
});

// Run at the start of every hour
const ____ = new CronJob("hourly-check", {
  title: "Hourly health check",
  schedule: "0 * * * *",
  endpoint: healthCheck,
});
```

## Common Patterns

### Database Cleanup

```typescript
const _ = new CronJob("cleanup-old-records", {
  title: "Delete records older than 30 days",
  every: "24h",
  endpoint: cleanupOldRecords,
});

export const cleanupOldRecords = api({}, async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  await db.exec`
    DELETE FROM temporary_data
    WHERE created_at < ${thirtyDaysAgo}
  `;
  
  console.log("Cleanup completed");
});
```

### Periodic Data Sync

```typescript
const _ = new CronJob("sync-external-data", {
  title: "Sync data from external API",
  every: "1h",
  endpoint: syncExternalData,
});

export const syncExternalData = api({}, async () => {
  const data = await fetch("https://api.example.com/data");
  const json = await data.json();
  
  // Store in database
  for (const item of json) {
    await db.exec`
      INSERT INTO external_data (id, data, synced_at)
      VALUES (${item.id}, ${JSON.stringify(item)}, NOW())
      ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data, synced_at = EXCLUDED.synced_at
    `;
  }
});
```

### Report Generation

```typescript
const _ = new CronJob("daily-sales-report", {
  title: "Generate daily sales report",
  schedule: "0 6 * * *",  // Every day at 6am UTC
  endpoint: generateSalesReport,
});

export const generateSalesReport = api({}, async () => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const results = await db.query`
    SELECT 
      COUNT(*) as order_count,
      SUM(amount) as total_revenue
    FROM orders
    WHERE created_at >= ${yesterday}
  `;
  
  const stats = await results.next();
  
  // Send report via email or store in database
  await sendReportEmail(stats);
});
```

### Reminder System

```typescript
const _ = new CronJob("send-reminders", {
  title: "Send user reminders",
  every: "30m",
  endpoint: sendReminders,
});

export const sendReminders = api({}, async () => {
  const now = new Date();
  
  const reminders = await db.query`
    SELECT user_id, message
    FROM reminders
    WHERE scheduled_at <= ${now}
    AND sent = false
  `;
  
  for await (const reminder of reminders) {
    await sendReminderEmail(reminder.user_id, reminder.message);
    
    await db.exec`
      UPDATE reminders
      SET sent = true, sent_at = NOW()
      WHERE user_id = ${reminder.user_id}
    `;
  }
});
```

### Cache Warming

```typescript
const _ = new CronJob("warm-cache", {
  title: "Warm up application cache",
  every: "1h",
  endpoint: warmCache,
});

export const warmCache = api({}, async () => {
  // Pre-load frequently accessed data
  const popularProducts = await db.query`
    SELECT * FROM products
    ORDER BY view_count DESC
    LIMIT 100
  `;
  
  for await (const product of popularProducts) {
    await setCache(`product:${product.id}`, product, 3600);
  }
  
  console.log("Cache warmed successfully");
});
```

## Error Handling

### Cron Job Failures

```typescript
export const criticalJob = api({}, async () => {
  try {
    await performCriticalTask();
  } catch (err) {
    // Log error for monitoring
    console.error("Critical job failed", err);
    
    // Optionally send alert
    await sendAlert("Critical cron job failed", err);
    
    // Re-throw to mark job as failed
    throw err;
  }
});
```

### Idempotency

Ensure cron jobs are idempotent in case they run multiple times:

```typescript
export const processOrders = api({}, async () => {
  // Use a status field to track processed orders
  const orders = await db.query`
    SELECT * FROM orders
    WHERE status = 'pending'
    AND created_at < NOW() - INTERVAL '5 minutes'
  `;
  
  for await (const order of orders) {
    // Mark as processing first
    await db.exec`
      UPDATE orders
      SET status = 'processing'
      WHERE id = ${order.id}
      AND status = 'pending'  -- Double-check status
    `;
    
    try {
      await processOrder(order);
      
      await db.exec`
        UPDATE orders
        SET status = 'completed'
        WHERE id = ${order.id}
      `;
    } catch (err) {
      await db.exec`
        UPDATE orders
        SET status = 'failed'
        WHERE id = ${order.id}
      `;
    }
  }
});
```

## Best Practices

1. **Use descriptive IDs and titles**: Make cron jobs easy to identify and understand
2. **Keep jobs fast**: Avoid long-running tasks; break them into smaller chunks
3. **Handle failures gracefully**: Always include error handling and logging
4. **Make jobs idempotent**: Design so running multiple times is safe
5. **Use appropriate intervals**: Balance frequency with resource usage
6. **Monitor job execution**: Track success/failure rates
7. **Avoid overlapping executions**: Ensure jobs complete before next run
8. **Use database locks**: For concurrent-safe operations
9. **Test locally**: Run endpoints manually to verify behavior
10. **Document dependencies**: Note external systems or services used

## Testing Cron Jobs

### Manual Testing

Call the endpoint directly:

```typescript
// In your test file or locally
import { sendWelcomeEmail } from "./cron";

// Test the cron job endpoint
await sendWelcomeEmail();
```

### Local Development

```bash
# Run the application
encore run

# Manually trigger endpoint via API
curl http://localhost:4000/send-welcome-email -X POST
```

## Monitoring

Monitor cron job executions via Encore Cloud dashboard:
- Execution history
- Success/failure rates
- Execution duration
- Error logs

## Timezone Considerations

- All cron schedules use **UTC timezone**
- Convert local times to UTC when setting schedules
- Document timezone assumptions in job descriptions

**Example**:
```typescript
// Want to run at 9am EST (UTC-5)
// Convert to UTC: 9am EST = 2pm UTC
const _ = new CronJob("daily-report", {
  title: "Daily report at 9am EST",
  schedule: "0 14 * * *",  // 2pm UTC = 9am EST
  endpoint: generateReport,
});
```

