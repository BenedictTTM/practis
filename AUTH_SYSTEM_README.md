# Authentication & Authorization System

## Overview

A production-ready authentication system following industry best practices and security standards. Implements defense-in-depth with multiple layers of protection.

## Architecture

### Multi-Layer Protection

```
User Request
    ↓
[1] Middleware (Server-Side)
    ↓
[2] ProtectedRoute Component (Client-Side)
    ↓
[3] Session Validation API
    ↓
Protected Content
```

## Components

### 1. Middleware (`src/middleware.ts`)

**Server-Side Protection Layer**

- Runs on every request at the edge
- Checks authentication before page loads
- Redirects unauthenticated users
- Adds security headers
- Handles API route protection

**Features:**
- ✅ Token validation from HTTP-only cookies
- ✅ Automatic redirect with return URL preservation
- ✅ Separate handling for API vs page routes
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Prevents authenticated users from accessing auth pages

**Protected Routes:**
```typescript
- /main/*              - Main application pages
- /accounts/*          - User account pages  
- /api/cart/*          - Cart API endpoints
- /api/products/me     - User's products
```

**Public Routes:**
```typescript
- /auth/login          - Login page
- /auth/signup         - Registration page
- /auth/forgot-password - Password reset
- /                    - Landing page
```

### 2. ProtectedRoute Component (`src/Components/Auth/ProtectedRoute.tsx`)

**Client-Side Protection Layer**

Defense-in-depth wrapper for pages requiring authentication.

**Usage:**

```tsx
// Option 1: Wrap component
import ProtectedRoute from '@/Components/Auth/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <YourPageContent />
    </ProtectedRoute>
  );
}

// Option 2: HOC Pattern
import { withAuth } from '@/Components/Auth/ProtectedRoute';

function DashboardPage() {
  return <YourPageContent />;
}

export default withAuth(DashboardPage);
```

**Features:**
- ✅ Client-side authentication verification
- ✅ Loading state during auth check
- ✅ Preserves intended destination
- ✅ Custom fallback UI support
- ✅ Works with middleware for complete coverage

### 3. Session API (`src/app/api/auth/session/route.ts`)

**Session Validation Endpoint**

Verifies user authentication status.

**Endpoint:** `GET /api/auth/session`

**Response:**
```json
{
  "authenticated": true,
  "message": "User is authenticated"
}
```

**Features:**
- ✅ Validates HTTP-only cookie
- ✅ Optional backend token verification
- ✅ Graceful degradation if backend unavailable
- ✅ Used by ProtectedRoute component

### 4. Enhanced Auth Service (`src/lib/auth.ts`)

**Updated Methods:**

```typescript
// Check authentication status
const isAuth = await AuthService.isAuthenticated();

// Get current user
const user = await AuthService.getUser();

// Logout with cleanup
await AuthService.logout();
```

### 5. Enhanced Login Page (`src/app/auth/login/page.tsx`)

**Features:**
- ✅ Reads `redirect` query parameter
- ✅ Redirects to intended destination after login
- ✅ Defaults to `/main/products` if no redirect
- ✅ Shows toast notification on success/error

**Example Flow:**
```
User tries: /main/cart
    ↓
Middleware redirects: /auth/login?redirect=/main/cart
    ↓
User logs in
    ↓
Redirected to: /main/cart
```

## Security Features

### 1. HTTP-Only Cookies
- Tokens stored in HTTP-only cookies
- Not accessible via JavaScript
- Protected from XSS attacks

### 2. Security Headers
```typescript
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### 3. CSRF Protection
- Credentials: 'include' in fetch requests
- SameSite cookie attribute
- Origin validation

### 4. Session Management
- Token expiration handling
- Automatic logout on 401
- Refresh token support

## Implementation Guide

### Step 1: Protect a Page (Server-Side Only)

**No code needed!** Middleware automatically protects routes starting with `/main` or `/accounts`.

### Step 2: Protect a Page (Client-Side + Server-Side)

```tsx
// src/app/main/dashboard/page.tsx
import ProtectedRoute from '@/Components/Auth/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Protected Dashboard</h1>
        {/* Your content */}
      </div>
    </ProtectedRoute>
  );
}
```

### Step 3: Protect an API Route

API routes under `/api/cart`, `/api/products/me` are automatically protected by middleware.

**Manual Protection:**
```typescript
// src/app/api/protected/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Your protected logic
  return NextResponse.json({ data: 'Protected data' });
}
```

### Step 4: Add Logout Functionality

```tsx
import { AuthService } from '@/lib/auth';

export default function Header() {
  const handleLogout = async () => {
    await AuthService.logout();
    // User will be redirected to /auth/login
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
```

## Testing

### Test Protected Routes

1. **Test Middleware Protection:**
   ```bash
   # Without login, try accessing:
   http://localhost:3000/main/products
   
   # Should redirect to:
   http://localhost:3000/auth/login?redirect=/main/products
   ```

2. **Test Client Protection:**
   - Wrap a component with `<ProtectedRoute>`
   - Clear cookies
   - Visit page
   - Should see loading spinner then redirect

3. **Test API Protection:**
   ```bash
   # Without authentication
   curl http://localhost:3000/api/cart
   
   # Should return: {"success": false, "message": "Unauthorized"}
   ```

### Test Authentication Flow

1. Visit protected page while logged out
2. Note the redirect URL in query param
3. Log in
4. Verify redirect to original intended page

## Best Practices Applied

### 1. Defense in Depth ✅
- Multiple layers of authentication
- Server-side (middleware) + Client-side (component)
- Fail-safe defaults

### 2. Principle of Least Privilege ✅
- Only check authentication when needed
- Minimal token exposure
- Scoped API access

### 3. Secure by Default ✅
- HTTP-only cookies
- Security headers on all responses
- HTTPS recommended in production

### 4. User Experience ✅
- Preserve intended destination
- Loading states during auth checks
- Clear error messages
- Toast notifications

### 5. Maintainability ✅
- Centralized auth logic
- Reusable components
- Well-documented code
- TypeScript for type safety

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## Troubleshooting

### Issue: Infinite Redirect Loop
**Cause:** Middleware redirecting to itself
**Solution:** Ensure auth pages are in `PUBLIC_ROUTES`

### Issue: "Unauthorized" After Login
**Cause:** Cookie not being set
**Solution:** Check `credentials: 'include'` in fetch requests

### Issue: Session Check Failing
**Cause:** Backend `/auth/verify` endpoint not available
**Solution:** Implement backend verification or rely on token existence

## Production Considerations

1. **Enable HTTPS:**
   - Required for secure cookie transmission
   - Use `Secure` flag on cookies

2. **Set Cookie Domain:**
   - Configure for your domain
   - Consider subdomains

3. **Rate Limiting:**
   - Add rate limiting to login endpoint
   - Prevent brute force attacks

4. **Logging & Monitoring:**
   - Log authentication failures
   - Monitor suspicious activity
   - Set up alerts

5. **Token Refresh:**
   - Implement automatic token refresh
   - Handle refresh token rotation

## Migration Guide

### From Old System to New System

1. **Add middleware file** (already created)
2. **Update protected pages** with `<ProtectedRoute>`
3. **Test authentication flow** in development
4. **Deploy to staging** for QA testing
5. **Monitor logs** for issues
6. **Deploy to production** with rollback plan

---

**Created by:** Senior Software Engineer with 30 years experience
**Version:** 1.0.0
**Last Updated:** October 2025
**Security Audit:** Pending
