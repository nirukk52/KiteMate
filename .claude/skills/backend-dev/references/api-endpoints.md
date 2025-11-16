# API Endpoints Reference

This reference covers creating type-safe TypeScript API endpoints with Encore.ts, including request validation and response handling.

## Core Concepts

- Encore.ts provides type-safe TypeScript API endpoints with built-in request validation
- APIs are async functions with TypeScript interfaces defining request/response types
- Source code parsing enables automatic request validation against schemas

## Basic Endpoint Syntax

```typescript
import { api } from "encore.dev/api";

interface PingParams {
  name: string;
}

interface PingResponse {
  message: string;
}

export const ping = api(
  { method: "POST" },
  async (p: PingParams): Promise<PingResponse> => {
    return { message: `Hello ${p.name}!` };
  }
);
```

## API Options

- **method**: HTTP method (GET, POST, PUT, DELETE, etc.)
- **expose**: Boolean controlling public access (default: false)
- **auth**: Boolean requiring authentication (optional)
- **path**: URL path pattern (optional)

## Schema Patterns

### Full Schema (Request + Response)
```typescript
api({ ... }, async (params: Params): Promise<Response> => {})
```

### Response Only
```typescript
api({ ... }, async (): Promise<Response> => {})
```

### Request Only
```typescript
api({ ... }, async (params: Params): Promise<void> => {})
```

### No Data
```typescript
api({ ... }, async (): Promise<void> => {})
```

## Parameter Types

### Header Parameters
Maps field to HTTP header:
```typescript
fieldName: Header<"Header-Name">
```

### Query Parameters
Maps field to URL query parameter:
```typescript
fieldName: Query<type>
```

### Path Parameters
Maps to URL path parameters using :param or *wildcard syntax:
```typescript
{ path: "/route/:param/*wildcard" }
```

## Service-to-Service API Calls

Services are imported from `~encore/clients` module:

```typescript
import { hello } from "~encore/clients";

export const myOtherAPI = api({}, async (): Promise<void> => {
  const resp = await hello.ping({ name: "World" });
  console.log(resp.message); // "Hello World!"
});
```

Benefits:
- Compile-time type checking
- IDE autocompletion
- Simple function call syntax

## Raw Endpoints

For lower-level HTTP request access (webhook implementations, custom HTTP handling):

```typescript
import { api } from "encore.dev/api";

export const myRawEndpoint = api.raw(
  { expose: true, path: "/raw", method: "GET" },
  async (req, resp) => {
    resp.writeHead(200, { "Content-Type": "text/plain" });
    resp.end("Hello, raw world!");
  }
);
```

## API Errors

### Error Format
```typescript
import { APIError, ErrCode } from "encore.dev/api";

// Explicit error
throw new APIError(ErrCode.NotFound, "sprocket not found");

// Shorthand version
throw APIError.notFound("sprocket not found");
```

### Common Error Codes

- **OK**: 200 OK
- **InvalidArgument**: 400 Bad Request
- **Unauthenticated**: 401 Unauthorized
- **PermissionDenied**: 403 Forbidden
- **NotFound**: 404 Not Found
- **AlreadyExists**: 409 Conflict
- **ResourceExhausted**: 429 Too Many Requests
- **Internal**: 500 Internal Server Error
- **Unavailable**: 503 Unavailable

### Additional Error Details
Use `withDetails` method to attach structured details:
```typescript
throw APIError.notFound("user not found").withDetails({ userId: 123 });
```

## Validation

Built-in request validation using TypeScript types:

```typescript
import { Header, Query, api } from "encore.dev/api";

interface Request {
  limit?: Query<number>;               // Optional query parameter
  myHeader: Header<"X-My-Header">;     // Required header
  type: "sprocket" | "widget";         // Required enum in body
}
```

### Validation Rules

**Min/Max**: Validate number ranges
```typescript
count: number & (Min<3> & Max<1000>);
```

**MinLen/MaxLen**: Validate string/array lengths
```typescript
username: string & (MinLen<5> & MaxLen<20>);
```

**Format**: Validate string formats
```typescript
contact: string & (IsURL | IsEmail);
```

## Static Assets

Serve static files (images, HTML, CSS, JavaScript):

```typescript
import { api } from "encore.dev/api";

export const assets = api.static(
  { expose: true, path: "/frontend/*path", dir: "./assets" }
);
```

### Root Serving
Use fallback routes for domain root:
```typescript
export const assets = api.static(
  { expose: true, path: "/!path", dir: "./assets" }
);
```

### Custom 404
```typescript
export const assets = api.static(
  { 
    expose: true, 
    path: "/!path", 
    dir: "./assets", 
    notFound: "./not_found.html" 
  }
);
```

## Streaming APIs

Enable data streaming via WebSocket connections:

### Stream In (Client to Server)
```typescript
import { api } from "encore.dev/api";

interface Message {
  data: string;
  done: boolean;
}

export const uploadStream = api.streamIn<Message>(
  { path: "/upload", expose: true },
  async (stream) => {
    for await (const data of stream) {
      // Process incoming data
      if (data.done) break;
    }
  }
);
```

### Stream Out (Server to Client)
```typescript
export const dataStream = api.streamOut<Message>(
  { path: "/stream", expose: true },
  async (stream) => {
    await stream.send({ data: "message" });
    await stream.close();
  }
);
```

### Bidirectional Streaming
```typescript
export const chatStream = api.streamInOut<InMessage, OutMessage>(
  { path: "/chat", expose: true },
  async (stream) => {
    for await (const msg of stream) {
      await stream.send(/* response */);
    }
  }
);
```

