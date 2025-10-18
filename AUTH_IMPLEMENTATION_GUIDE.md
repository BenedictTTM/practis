# Authentication Implementation Examples

## Quick Start: Protecting Your Pages

### Example 1: Protect Cart Page

```tsx
// src/app/main/cart/page.tsx
'use client';

import ProtectedRoute from '@/Components/Auth/ProtectedRoute';
import { useState, useEffect } from 'react';
// ... other imports

export default function CartPage() {
  return (
    <ProtectedRoute>
      {/* Your existing cart component */}
      <ShoppingCart />
    </ProtectedRoute>
  );
}
```

### Example 2: Protect Products Page

```tsx
// src/app/main/products/page.tsx
'use client';

import { withAuth } from '@/Components/Auth/ProtectedRoute';
// ... other imports

function ProductsPage() {
  // Your existing products logic
  return (
    <div>
      <h1>Products</h1>
      {/* ... */}
    </div>
  );
}

// Wrap with HOC for protection
export default withAuth(ProductsPage);
```

### Example 3: Protect User Account Pages

```tsx
// src/app/accounts/addProducts/page.tsx
'use client';

import ProtectedRoute from '@/Components/Auth/ProtectedRoute';

export default function AddProductsPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Add Your Products</h1>
        {/* Your form */}
      </div>
    </ProtectedRoute>
  );
}
```

### Example 4: Header with Auth Status

```tsx
// src/Components/Header/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const auth = await AuthService.isAuthenticated();
    setIsAuthenticated(auth);
  };

  const handleLogout = async () => {
    await AuthService.logout();
  };

  return (
    <header>
      {/* ... */}
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={() => router.push('/auth/login')}>
          Login
        </button>
      )}
    </header>
  );
}
```

## Testing Checklist

### ✅ Test 1: Middleware Protection
```bash
1. Clear all cookies
2. Visit: http://localhost:3000/main/cart
3. Expected: Redirect to /auth/login?redirect=/main/cart
4. Log in
5. Expected: Redirect back to /main/cart
```

### ✅ Test 2: Client Protection
```bash
1. Add <ProtectedRoute> to a page
2. Clear cookies
3. Visit the page
4. Expected: Loading spinner → Redirect to login
```

### ✅ Test 3: API Protection
```bash
1. Clear cookies
2. Try: fetch('/api/cart')
3. Expected: 401 Unauthorized
4. Log in
5. Try: fetch('/api/cart')
6. Expected: 200 OK with cart data
```

### ✅ Test 4: Already Logged In
```bash
1. Log in
2. Visit: /auth/login
3. Expected: Redirect to /main/products
```

## Common Patterns

### Pattern 1: Conditional Rendering Based on Auth

```tsx
'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';

export default function ProductCard({ product }) {
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    checkOwnership();
  }, []);

  const checkOwnership = async () => {
    const user = await AuthService.getUser();
    setCanEdit(user?.id === product.userId);
  };

  return (
    <div>
      <h3>{product.title}</h3>
      {canEdit && (
        <button>Edit Product</button>
      )}
    </div>
  );
}
```

### Pattern 2: Fetch with Auto-Retry on 401

```tsx
async function fetchWithAuth(url: string) {
  try {
    const response = await fetch(url, {
      credentials: 'include',
    });

    if (response.status === 401) {
      // Token expired, redirect to login
      const currentPath = window.location.pathname;
      window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
```

### Pattern 3: Protected API Route

```tsx
// src/app/api/user/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  // Check authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Fetch user's products from backend
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(`${BACKEND_URL}/products/me`, {
    headers: {
      'Cookie': `access_token=${token.value}`,
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}
```

## Deployment Checklist

### Development ✅
- [x] Middleware created
- [x] ProtectedRoute component created
- [x] Session API created
- [x] Login page updated
- [x] Auth service enhanced

### Testing ✅
- [ ] Test middleware redirects
- [ ] Test client-side protection
- [ ] Test API protection
- [ ] Test redirect after login
- [ ] Test logout functionality

### Production 🚀
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Set up monitoring
- [ ] Configure error logging

## Support

For questions or issues:
1. Check AUTH_SYSTEM_README.md
2. Review this implementation guide
3. Test in development first
4. Check browser console for errors
5. Verify cookies are being set

---

**Remember:** Always test authentication in an incognito window to ensure cookies are properly cleared between tests!
