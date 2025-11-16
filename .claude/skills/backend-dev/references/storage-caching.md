# Storage & Caching Reference

This reference covers object storage (files/blobs) and caching strategies in Encore.ts applications.

## Object Storage

Simple and scalable solution for storing files and unstructured data.

### Bucket Definition

**Rules**:
- Must be package level variables
- Cannot be created inside functions
- Accessible from any service

```typescript
import { Bucket } from "encore.dev/storage/objects";

export const profilePictures = new Bucket("profile-pictures", {
  versioned: false
});
```

### Bucket Operations

#### Upload Files
```typescript
const data = Buffer.from(...); // image data
const attributes = await profilePictures.upload("my-image.jpeg", data, {
  contentType: "image/jpeg",
});
```

#### Download Files
```typescript
const data = await profilePictures.download("my-image.jpeg");
```

#### List Objects
```typescript
for await (const entry of profilePictures.list({})) {
  console.log(entry.name, entry.size);
}
```

#### Delete Objects
```typescript
await profilePictures.remove("my-image.jpeg");
```

#### Get Object Attributes
```typescript
const attrs = await profilePictures.attrs("my-image.jpeg");
const exists = await profilePictures.exists("my-image.jpeg");
```

### Public Access

Configure publicly accessible buckets:

```typescript
export const publicProfilePictures = new Bucket("public-profile-pictures", {
  public: true,
  versioned: false
});
```

Access public objects using `publicUrl`:

```typescript
const url = publicProfilePictures.publicUrl("my-image.jpeg");
// Returns: https://cdn.example.com/public-profile-pictures/my-image.jpeg
```

### Bucket References

System for controlled bucket access permissions:

**Available Permissions**:
- `Downloader`: Download objects
- `Uploader`: Upload objects
- `Lister`: List objects
- `Attrser`: Get object attributes
- `Remover`: Remove objects
- `ReadWriter`: Complete read-write access

```typescript
import { Uploader } from "encore.dev/storage/objects";

// Create a reference with limited permissions
const ref = profilePictures.ref<Uploader>();
```

**Note**: Must be called from within a service for proper permission tracking.

### Error Handling

```typescript
import { ObjectNotFound, PreconditionFailed, ObjectsError } from "encore.dev/storage/objects";

try {
  const data = await profilePictures.download("my-image.jpeg");
} catch (err) {
  if (err instanceof ObjectNotFound) {
    console.log("Object doesn't exist");
  } else if (err instanceof PreconditionFailed) {
    console.log("Upload preconditions not met");
  } else if (err instanceof ObjectsError) {
    console.log("General storage error");
  }
}
```

## Caching Strategies

While Encore.ts doesn't have a built-in caching primitive (as of the documentation), here are recommended patterns:

### In-Memory Caching

For frequently accessed data:

```typescript
const cache = new Map<string, { data: any; expiry: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

function setCache<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlMs,
  });
}

// Usage
export const getUser = api(
  { method: "GET", path: "/user/:id" },
  async ({ id }: { id: string }) => {
    const cached = getCached<User>(id);
    if (cached) return cached;
    
    const user = await fetchUserFromDB(id);
    setCache(id, user, 60000); // Cache for 1 minute
    
    return user;
  }
);
```

### Redis Caching

For distributed caching across multiple instances:

```typescript
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

async function getCached<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

async function setCache<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
  await redis.setex(key, ttlSeconds, JSON.stringify(data));
}

async function invalidateCache(key: string): Promise<void> {
  await redis.del(key);
}

// Usage
export const getProduct = api(
  { method: "GET", path: "/product/:id" },
  async ({ id }: { id: string }) => {
    const cacheKey = `product:${id}`;
    const cached = await getCached<Product>(cacheKey);
    if (cached) return cached;
    
    const product = await fetchProductFromDB(id);
    await setCache(cacheKey, product, 300); // Cache for 5 minutes
    
    return product;
  }
);
```

### Cache-Aside Pattern

```typescript
async function getOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> {
  // Try cache first
  const cached = await getCached<T>(key);
  if (cached) return cached;
  
  // Fetch from source
  const data = await fetcher();
  
  // Store in cache
  await setCache(key, data, ttl);
  
  return data;
}

// Usage
export const getUserProfile = api(
  { method: "GET", path: "/profile/:id" },
  async ({ id }: { id: string }) => {
    return await getOrFetch(
      `profile:${id}`,
      () => fetchProfileFromDB(id),
      300
    );
  }
);
```

### Write-Through Caching

Update cache whenever data is modified:

```typescript
export const updateUser = api(
  { method: "PUT", path: "/user/:id" },
  async ({ id, ...updates }: UpdateUserRequest) => {
    // Update database
    const user = await updateUserInDB(id, updates);
    
    // Update cache
    await setCache(`user:${id}`, user, 3600);
    
    return user;
  }
);
```

### Cache Invalidation

```typescript
export const deleteUser = api(
  { method: "DELETE", path: "/user/:id" },
  async ({ id }: { id: string }) => {
    // Delete from database
    await deleteUserFromDB(id);
    
    // Invalidate cache
    await invalidateCache(`user:${id}`);
    await invalidateCache(`profile:${id}`);
    
    return { success: true };
  }
);
```

## Best Practices

### Object Storage
1. **Use appropriate content types**: Always set contentType when uploading
2. **Implement retry logic**: Handle transient failures gracefully
3. **Use versioning carefully**: Enable versioning only when needed due to storage costs
4. **Secure public buckets**: Only make buckets public when absolutely necessary
5. **Clean up unused objects**: Implement lifecycle policies for old/unused files
6. **Use descriptive names**: Make object keys human-readable and organized
7. **Validate before upload**: Check file size and type before uploading

### Caching
1. **Set appropriate TTLs**: Balance freshness vs. performance
2. **Cache what's expensive**: Focus on database queries and API calls
3. **Use cache keys wisely**: Make them unique and predictable
4. **Handle cache failures**: Always have fallback to source data
5. **Monitor cache hit rates**: Track effectiveness of caching strategy
6. **Invalidate proactively**: Clear cache when data changes
7. **Avoid caching sensitive data**: Don't cache authentication tokens or personal data
8. **Use compression**: Compress large cached values
9. **Implement cache warming**: Pre-populate cache for critical data
10. **Consider memory limits**: Monitor and limit in-memory cache size

