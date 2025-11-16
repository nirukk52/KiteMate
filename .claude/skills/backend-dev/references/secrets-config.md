# Secrets & Configuration Reference

This reference covers secure management of secrets, API keys, and configuration in Encore.ts applications.

## Secrets Management

Built-in secrets manager for secure storage of API keys, passwords, and private keys.

### Defining Secrets

Define secrets as top-level variables using the `secret` function:

```typescript
import { secret } from "encore.dev/config";

const githubToken = secret("GitHubAPIToken");
const databasePassword = secret("DatabasePassword");
const apiKey = secret("ThirdPartyAPIKey");
```

**Note**: Secret keys are globally unique across the application.

### Using Secrets

Call the secret function to retrieve the value:

```typescript
import { secret } from "encore.dev/config";

const githubToken = secret("GitHubAPIToken");

async function callGitHub() {
  const resp = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${githubToken()}`,
    },
  });
  return await resp.json();
}
```

### Setting Secrets

#### Method 1: Cloud Dashboard

1. Open app in Encore Cloud dashboard: https://app.encore.cloud
2. Navigate to **Settings > Secrets**
3. Create and manage secrets for different environments
4. Set values for production, development, preview, or local

#### Method 2: CLI

```bash
# Set secret for specific environment type
encore secret set --type <types> <secret-name>

# Examples
encore secret set --type prod GitHubAPIToken
encore secret set --type dev DatabasePassword
encore secret set --type local,dev ThirdPartyAPIKey
```

**Available Types**:
- `production` (or `prod`): Production environments
- `development` (or `dev`): Development environments
- `preview` (or `pr`): Preview/PR environments
- `local`: Local development

**Interactive Input**:
The CLI will prompt you to enter the secret value securely.

#### Method 3: Local Override File

Override secrets locally using `.secrets.local.cue` file:

```cue
GitHubAPIToken: "my-local-override-token"
SSHPrivateKey: "custom-ssh-private-key"
DatabasePassword: "local-dev-password"
```

**Note**: Add `.secrets.local.cue` to `.gitignore` to prevent committing secrets.

### Listing Secrets

```bash
# List all secrets
encore secret list

# List specific secrets
encore secret list GitHubAPIToken DatabasePassword
```

### Archiving Secrets

```bash
# Archive a secret value (hide but keep)
encore secret archive <id>

# Unarchive a secret value
encore secret unarchive <id>
```

## Environment Configuration

### Environment Settings

Rules:
- One secret value per environment type (prod, dev, preview, local)
- Environment-specific values override environment type values
- Secrets inherit from environment type if not overridden

### Environment Hierarchy

```
local → development → preview → production
  ↓         ↓           ↓           ↓
Least restrictive    Most restrictive
```

## Configuration Patterns

### Service-Specific Configuration

```typescript
import { secret } from "encore.dev/config";

// Database credentials
const dbHost = secret("DB_HOST");
const dbPort = secret("DB_PORT");
const dbUser = secret("DB_USER");
const dbPassword = secret("DB_PASSWORD");

function getDatabaseConfig() {
  return {
    host: dbHost(),
    port: parseInt(dbPort()),
    user: dbUser(),
    password: dbPassword(),
  };
}
```

### API Key Management

```typescript
import { secret } from "encore.dev/config";

// Third-party API keys
const stripeKey = secret("STRIPE_SECRET_KEY");
const sendgridKey = secret("SENDGRID_API_KEY");
const twilioKey = secret("TWILIO_AUTH_TOKEN");

export async function processPayment(amount: number) {
  const stripe = new Stripe(stripeKey());
  return await stripe.charges.create({ amount });
}
```

### Environment-Based Configuration

```typescript
import { appMeta } from "encore.dev";
import { secret } from "encore.dev/config";

const apiKey = secret("API_KEY");

function getApiConfig() {
  const env = appMeta().environment;
  
  return {
    apiKey: apiKey(),
    timeout: env.type === "production" ? 5000 : 30000,
    retries: env.type === "production" ? 3 : 1,
    debug: env.type !== "production",
  };
}
```

### Feature Flags

```typescript
import { secret } from "encore.dev/config";

const featureNewCheckout = secret("FEATURE_NEW_CHECKOUT");
const featureBetaAccess = secret("FEATURE_BETA_ACCESS");

export function isFeatureEnabled(feature: string): boolean {
  switch (feature) {
    case "new-checkout":
      return featureNewCheckout() === "true";
    case "beta-access":
      return featureBetaAccess() === "true";
    default:
      return false;
  }
}
```

## Best Practices

1. **Never commit secrets**: Always use secret management, never hardcode
2. **Use descriptive names**: Make secret names clear and meaningful
3. **Rotate secrets regularly**: Update production secrets periodically
4. **Limit secret access**: Only grant access to necessary environments
5. **Use environment-specific values**: Different secrets for prod/dev
6. **Validate secret format**: Check that secrets have expected format
7. **Document secret requirements**: Note which secrets are required
8. **Use strong values**: Generate strong, random secret values
9. **Monitor secret usage**: Track when and where secrets are used
10. **Have recovery plan**: Know how to rotate secrets if compromised

## Security Considerations

### What to Store as Secrets
- API keys and tokens
- Database passwords
- Private keys and certificates
- OAuth client secrets
- Webhook signing keys
- Encryption keys

### What NOT to Store as Secrets
- Public configuration values
- Feature flags (unless sensitive)
- Non-sensitive URLs
- Public API endpoints
- Application version numbers

### Secret Rotation

When rotating secrets:

1. **Generate new secret**: Create new value
2. **Update in Encore**: Set new secret value
3. **Deploy application**: Deploy with new secret
4. **Verify functionality**: Test that new secret works
5. **Revoke old secret**: Disable old value at provider

### Handling Secret Changes

```typescript
import { secret } from "encore.dev/config";
import log from "encore.dev/log";

const apiKey = secret("API_KEY");

async function callExternalAPI() {
  try {
    const response = await fetch("https://api.example.com/data", {
      headers: {
        Authorization: `Bearer ${apiKey()}`,
      },
    });
    
    if (response.status === 401) {
      log.error("API key authentication failed - may need rotation");
      throw new Error("Invalid API key");
    }
    
    return await response.json();
  } catch (err) {
    log.error(err as Error, "External API call failed");
    throw err;
  }
}
```

## Common Patterns

### Database Connection String

```typescript
import { secret } from "encore.dev/config";

const dbUrl = secret("DATABASE_URL");

export function getDatabaseConnectionString(): string {
  return dbUrl();
}
```

### JWT Secret

```typescript
import { secret } from "encore.dev/config";
import jwt from "jsonwebtoken";

const jwtSecret = secret("JWT_SECRET");

export function signToken(payload: any): string {
  return jwt.sign(payload, jwtSecret(), { expiresIn: "1h" });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, jwtSecret());
}
```

### OAuth Configuration

```typescript
import { secret } from "encore.dev/config";

const oauthClientId = secret("OAUTH_CLIENT_ID");
const oauthClientSecret = secret("OAUTH_CLIENT_SECRET");

export function getOAuthConfig() {
  return {
    clientId: oauthClientId(),
    clientSecret: oauthClientSecret(),
    redirectUri: "https://myapp.com/oauth/callback",
  };
}
```

### Webhook Signature Verification

```typescript
import { secret } from "encore.dev/config";
import crypto from "crypto";

const webhookSecret = secret("WEBHOOK_SECRET");

export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret())
    .update(payload)
    .digest("hex");
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## Testing with Secrets

### Local Development

Create `.secrets.local.cue` file:

```cue
STRIPE_SECRET_KEY: "sk_test_..."
SENDGRID_API_KEY: "SG.test..."
DATABASE_URL: "postgresql://localhost:5432/testdb"
JWT_SECRET: "local-dev-secret-change-in-prod"
```

### Test Environment

Use mock or test values:

```typescript
import { appMeta } from "encore.dev";
import { secret } from "encore.dev/config";

const apiKey = secret("API_KEY");

export function getAPIClient() {
  const env = appMeta().environment;
  
  if (env.type === "test") {
    // Return mock client for tests
    return new MockAPIClient();
  }
  
  return new RealAPIClient(apiKey());
}
```

## Troubleshooting

### Secret Not Found

```typescript
import { secret } from "encore.dev/config";
import log from "encore.dev/log";

const apiKey = secret("API_KEY");

export function safeGetSecret(): string | null {
  try {
    return apiKey();
  } catch (err) {
    log.error(err as Error, "Secret not found: API_KEY");
    return null;
  }
}
```

### Secret Validation

```typescript
import { secret } from "encore.dev/config";

const apiKey = secret("API_KEY");

export function validateSecrets(): boolean {
  const key = apiKey();
  
  if (!key || key.length < 20) {
    console.error("Invalid API_KEY: must be at least 20 characters");
    return false;
  }
  
  return true;
}

// Call on application startup
validateSecrets();
```

