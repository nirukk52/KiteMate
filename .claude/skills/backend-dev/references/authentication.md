# Authentication Reference

This reference covers the authentication system in Encore.ts for identifying API callers in both consumer and B2B applications.

## Core Concepts

- Authentication identifies API callers
- Activated by setting `auth: true` in API endpoint options
- Uses auth handlers to validate credentials
- Automatically propagates authentication in service-to-service calls

## Auth Handler Implementation

Required for APIs with `auth: true`:

```typescript
import { Header, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

interface AuthParams {
  authorization: Header<"Authorization">;
}

interface AuthData {
  userID: string;
}

export const auth = authHandler<AuthParams, AuthData>(
  async (params) => {
    // Authenticate user based on params
    // Validate token, check database, etc.
    return { userID: "my-user-id" };
  }
);

export const gateway = new Gateway({
  authHandler: auth,
});
```

## Authentication Process

### Step 1: Determine Authentication

**Triggers**:
- Any request containing auth parameters
- Runs regardless of endpoint authentication requirements

**Outcomes**:
1. **Success**: Returns AuthData → request is authenticated
2. **Unauthenticated**: Throws Unauthenticated error → treated as no auth
3. **Error**: Throws other error → request is aborted

### Step 2: Endpoint Call

**Rules**:
- If endpoint requires auth AND request not authenticated → reject with 401
- If authenticated, auth data passed to endpoint regardless of requirements
- Auth data available to all endpoints in request chain

## Rejecting Authentication

Throw an unauthenticated error from the auth handler:

```typescript
import { APIError } from "encore.dev/api";

export const auth = authHandler<AuthParams, AuthData>(
  async (params) => {
    if (!isValidToken(params.authorization)) {
      throw APIError.unauthenticated("bad credentials");
    }
    return { userID: getUserIdFromToken(params.authorization) };
  }
);
```

## Using Auth Data in Endpoints

### Import getAuthData
Type-safe resolution of auth data:

```typescript
import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

export const getUserProfile = api(
  { method: "GET", path: "/profile", auth: true },
  async (): Promise<UserProfile> => {
    const authData = getAuthData()!; // Non-null because auth: true
    const userID = authData.userID;
    
    // Fetch and return user profile
    return await fetchUserProfile(userID);
  }
);
```

### Optional Authentication
Endpoint doesn't require auth, but uses it if available:

```typescript
export const getContent = api(
  { method: "GET", path: "/content" },
  async (): Promise<Content> => {
    const authData = getAuthData(); // May be undefined
    
    if (authData) {
      // Return personalized content
      return await getPersonalizedContent(authData.userID);
    } else {
      // Return public content
      return await getPublicContent();
    }
  }
);
```

## Auth Data Propagation

### Automatic Propagation
Auth data automatically propagates in internal API calls:

```typescript
import { userService } from "~encore/clients";

export const getOrderHistory = api(
  { method: "GET", auth: true },
  async () => {
    // Auth data automatically passed to userService.getProfile
    const profile = await userService.getProfile();
    return profile;
  }
);
```

### Constraints
Calls to auth-required endpoints will fail if the original request lacks authentication:

```typescript
// This endpoint requires auth
export const protectedEndpoint = api(
  { method: "GET", auth: true },
  async () => {
    // If this was called from a non-authenticated request, it will fail
    return { message: "Protected data" };
  }
);
```

## Common Authentication Patterns

### JWT Token Authentication

```typescript
import { Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import jwt from "jsonwebtoken";

interface AuthParams {
  authorization: Header<"Authorization">;
}

interface AuthData {
  userID: string;
  role: string;
}

export const auth = authHandler<AuthParams, AuthData>(
  async (params) => {
    const token = params.authorization.replace("Bearer ", "");
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      return {
        userID: decoded.sub,
        role: decoded.role,
      };
    } catch (err) {
      throw APIError.unauthenticated("invalid token");
    }
  }
);
```

### API Key Authentication

```typescript
import { Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

interface AuthParams {
  apiKey: Header<"X-API-Key">;
}

interface AuthData {
  clientID: string;
  permissions: string[];
}

export const auth = authHandler<AuthParams, AuthData>(
  async (params) => {
    const client = await validateApiKey(params.apiKey);
    
    if (!client) {
      throw APIError.unauthenticated("invalid API key");
    }
    
    return {
      clientID: client.id,
      permissions: client.permissions,
    };
  }
);
```

### Session Cookie Authentication

```typescript
import { Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

interface AuthParams {
  cookie: Header<"Cookie">;
}

interface AuthData {
  userID: string;
  sessionID: string;
}

export const auth = authHandler<AuthParams, AuthData>(
  async (params) => {
    const sessionID = extractSessionFromCookie(params.cookie);
    const session = await validateSession(sessionID);
    
    if (!session) {
      throw APIError.unauthenticated("invalid or expired session");
    }
    
    return {
      userID: session.userID,
      sessionID: session.id,
    };
  }
);
```

## Best Practices

1. **Keep auth handlers lightweight**: Validate quickly to avoid slowing down all requests
2. **Cache auth lookups**: Use in-memory caching for frequently validated tokens
3. **Use strong typing**: Define clear AuthData interfaces for type safety
4. **Handle expiration**: Check token/session expiration in auth handler
5. **Provide clear error messages**: Help clients understand why authentication failed
6. **Don't log sensitive data**: Avoid logging tokens, passwords, or API keys
7. **Use HTTPS in production**: Always encrypt authentication credentials in transit

