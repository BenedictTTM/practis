# 🧪 Quick Test Guide: Cart Authentication Redirect

## ⚡ 30-Second Test

### Test Without Login

```bash
1. Open incognito window
2. Go to: http://localhost:3000/main/products
3. Click "Add to Cart" on any product
4. ✅ Should redirect to: /auth/login?redirect=/main/products
5. Login
6. ✅ Should redirect back to: /main/products
7. Click "Add to Cart" again
8. ✅ Should add to cart successfully
```

---

## 📋 Detailed Test Cases

### Test 1: Product Grid - Not Logged In ❌→✅

**Starting State**: Not logged in (incognito mode)

1. Navigate to `/main/products`
2. Click "Add to Cart" on ProductCard
3. **Check Browser Console**: Should see "🔐 User not authenticated, redirecting to login..."
4. **Check URL**: Should redirect to `/auth/login?redirect=/main/products`
5. Login with valid credentials
6. **Check URL**: Should redirect to `/main/products`
7. Click "Add to Cart" again
8. **Check Result**: Item added successfully ✅

---

### Test 2: Product Detail Page - Not Logged In ❌→✅

**Starting State**: Not logged in

1. Navigate to `/main/products/1` (or any product ID)
2. Click "Add to Cart" button
3. **Check Console**: "🔐 User not authenticated, redirecting to login..."
4. **Check URL**: `/auth/login?redirect=/main/products/1`
5. Login
6. **Check URL**: Back to `/main/products/1`
7. Click "Add to Cart"
8. **Check Result**: Item added successfully ✅

---

### Test 3: Multiple Pages - Preserve Context ✅

**Purpose**: Verify return URL works from different pages

1. Open incognito
2. Try adding to cart from:
   - `/main/products` → Login → Return to `/main/products` ✅
   - `/main/products/5` → Login → Return to `/main/products/5` ✅
   - `/main/products/20` → Login → Return to `/main/products/20` ✅

---

### Test 4: Already Logged In ✅

**Starting State**: Already logged in

1. Navigate to `/main/products`
2. Click "Add to Cart"
3. **Check**: No redirect, stays on page ✅
4. **Check**: Item added to cart ✅
5. **Check**: Cart count updates ✅

---

### Test 5: Session Expired Mid-Browse 🔄

**Purpose**: Test token expiration handling

1. Login
2. Browse products (wait 15+ minutes for token expiry)
3. Click "Add to Cart"
4. **Check**: Redirects to login (token expired)
5. Login again
6. **Check**: Returns to product page
7. **Check**: Can add to cart

---

## 🎯 Expected Behaviors

### When NOT Logged In (401)

| Action              | Expected Result                             |
| ------------------- | ------------------------------------------- |
| Click "Add to Cart" | Show loading → Redirect to login            |
| Console Message     | "🔐 User not authenticated, redirecting..." |
| URL After Redirect  | `/auth/login?redirect=<current-page>`       |
| After Login         | Return to `<current-page>`                  |
| Can Add to Cart     | ✅ Yes, after login                         |

### When Logged In (200)

| Action              | Expected Result                      |
| ------------------- | ------------------------------------ |
| Click "Add to Cart" | Show loading → Show success          |
| Console Message     | "✅ Item added to cart successfully" |
| URL                 | Stays on current page (no redirect)  |
| Cart Count          | Updates immediately                  |

### Other Errors (400, 500, etc.)

| Status           | Expected Result                       |
| ---------------- | ------------------------------------- |
| 400 Bad Request  | Show error message, no redirect       |
| 500 Server Error | Show error message, no redirect       |
| 0 Network Error  | Show "Unable to connect", no redirect |

---

## 🔍 Debugging Checklist

### If Redirect Doesn't Work

1. **Check Browser Console**:

   ```
   Should see: "🔐 User not authenticated, redirecting to login..."
   ```

2. **Check Network Tab** (DevTools):

   ```
   POST /api/cart → Status: 401 Unauthorized
   ```

3. **Check Middleware**:

   ```typescript
   // src/middleware.ts
   const PROTECTED_ROUTES = [
     "/api/cart", // ← Should be here
   ];
   ```

4. **Check StatusCode**:
   ```typescript
   // In component
   console.log("Status:", result.statusCode); // Should be 401
   ```

### If It Redirects But Doesn't Return

1. **Check URL After Login**:

   ```
   Should have: ?redirect=/main/products
   ```

2. **Check Login Page**:
   ```typescript
   // src/app/auth/login/page.tsx
   const redirect = searchParams.get("redirect");
   // Should read and use this parameter
   ```

### If Already Logged In But Still Redirects

1. **Check Cookies**:

   - Open DevTools → Application → Cookies
   - Look for `access_token`
   - If missing, login again

2. **Check Token Expiration**:
   - Tokens expire after 15 minutes
   - Need to login again

---

## ✅ Success Criteria

All these should pass:

- [ ] Not logged in → Redirects to login
- [ ] Login → Returns to original page
- [ ] Can add to cart after login
- [ ] Logged in users don't get redirected
- [ ] Other errors don't trigger redirect
- [ ] Console messages appear correctly
- [ ] No error alerts for 401 (just redirect)
- [ ] Cart count updates after success

---

## 🛠️ Testing Tools

### Browser Console Commands

```javascript
// Check if logged in
document.cookie.includes("access_token");

// Test add to cart (while on product page)
// (Open browser console and run)
fetch("/api/cart", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ productId: 1, quantity: 1 }),
}).then((r) => console.log("Status:", r.status));

// Clear cookies (logout)
document.cookie.split(";").forEach((c) => {
  document.cookie = c
    .replace(/^ +/, "")
    .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
});
```

### cURL Commands

```bash
# Test API without auth
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 1}' \
  -v

# Expected: 401 Unauthorized
```

---

## 📊 Test Report Template

```markdown
## Test Report

**Date**: ****\_\_\_****
**Tester**: ****\_\_\_****
**Environment**: Dev / Staging / Production

### Test Results

| Test Case                | Status  | Notes |
| ------------------------ | ------- | ----- |
| Not logged in → Redirect | ✅ / ❌ |       |
| Return after login       | ✅ / ❌ |       |
| Add to cart after login  | ✅ / ❌ |       |
| Already logged in        | ✅ / ❌ |       |
| Console messages         | ✅ / ❌ |       |

### Issues Found

1. ***
2. ***

### Overall Status

✅ All tests passed
⚠️ Some issues found
❌ Major issues blocking
```

---

## 🎓 Pro Tips

1. **Use Incognito Mode**: Easiest way to test "not logged in" state
2. **Check Console First**: Logs tell you exactly what's happening
3. **Test Multiple Products**: Ensure consistent behavior
4. **Test Both Components**: ProductCard AND ProductDetailPage
5. **Clear Cookies**: Use DevTools → Application → Clear site data

---

**Testing Time**: ~5 minutes for complete test suite  
**Critical Tests**: Test 1 & Test 2 (must pass)  
**Updated**: October 19, 2025
