Run comprehensive security audit on KiteMate codebase with focus on financial data handling.

**Usage:** `/security-audit [scope]`

**Scopes:**
- `full` - Complete codebase audit (recommended before releases)
- `auth` - Authentication and authorization only
- `payments` - Payment processing and subscriptions
- `data` - PII and financial data handling
- `api` - API security (rate limiting, validation, CORS)

## Checks Performed

### 1. Secrets in Code
Scans for hardcoded API keys, tokens, passwords

**Patterns Detected:**
- `ZERODHA_API_KEY = "xyz"` ❌
- `const password = "admin123"` ❌
- `secret("ZERODHA_API_KEY")` ✅

### 2. SQL Injection
Validates database query patterns

**Unsafe:**
```typescript
const user = await db.queryRow(`SELECT * FROM users WHERE email = '${email}'`);
```

**Safe:**
```typescript
const user = await db.queryRow`SELECT * FROM users WHERE email = ${email}`;
```

### 3. XSS Vulnerabilities
Checks input sanitization in frontend

**Unsafe:**
```svelte
{@html userInput}
```

**Safe:**
```typescript
import DOMPurify from 'isomorphic-dompurify';
const safeHtml = DOMPurify.sanitize(userInput);
```

### 4. Token Exposure
Ensures Zerodha tokens encrypted at rest

**Checks:**
- Tokens stored with encryption ✅
- No tokens in logs ✅
- Tokens in HTTP-only cookies ✅

### 5. Rate Limiting
Verifies rate limits on public endpoints

**Required on:**
- `/chat/query` - Chat queries (free tier limit)
- `/auth/login` - Prevent brute force
- All webhook endpoints
- Public profile endpoints

### 6. HTTPS Enforcement
Checks for HTTP fallbacks

**Production Requirements:**
- All endpoints HTTPS only ✅
- Secure cookies (`secure: true`) ✅
- HSTS header set ✅

### 7. Input Validation
Validates all user inputs with proper types

**Example:**
```typescript
interface CreateWidgetParams {
  title: string & MinLen<1> & MaxLen<100>;  // ✅ Validated
  type: "chart" | "table" | "card";          // ✅ Enum
}
```

### 8. Authorization Checks
Ensures users can only access their own data

**Pattern:**
```typescript
const authData = await getAuthData();
if (authData.userId !== requestedUserId) {
  throw APIError.permissionDenied("cannot access another user's data");
}
```

## Output Format

```
CRITICAL Issues: 2
HIGH Issues: 5
MEDIUM Issues: 12
LOW Issues: 8

═══════════════════════════════════════
CRITICAL: Zerodha token stored in plain text
File: backend/auth/tokens.ts:45
Issue: Access token stored without encryption
Fix: Use encrypt() function before storing
═══════════════════════════════════════

═══════════════════════════════════════
HIGH: Missing rate limit on chat endpoint
File: backend/chat/chat.ts:23
Issue: Free tier can send unlimited queries
Fix: Add rate limiting middleware
═══════════════════════════════════════
```

## Compliance Notes

### GDPR Compliance
- ✅ Data export endpoint exists
- ✅ Account deletion endpoint exists
- ⚠️  Cookie consent needed for EU users
- ✅ Privacy policy updated

### PCI DSS (Payments)
- ✅ Using Razorpay/Stripe (no raw card data)
- ✅ Webhook signature verification
- ✅ No payment credentials logged

### Zerodha API Terms
- ⚠️  Check data retention policy
- ✅ API rate limits respected
- ✅ Tokens revoked on disconnect

## Remediation Priority

1. **CRITICAL** - Fix immediately, block deployment
2. **HIGH** - Fix before next release
3. **MEDIUM** - Schedule for upcoming sprint
4. **LOW** - Address when refactoring

## Agent Used

This command invokes: **fintech-security-specialist**

## When to Run

- ✅ Before every production deployment
- ✅ After adding authentication/payment code
- ✅ When adding new API endpoints
- ✅ After dependency updates
- ✅ Monthly security review
