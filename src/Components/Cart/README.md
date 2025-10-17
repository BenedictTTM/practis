# Shopping Cart - Frontend

## Overview

Enterprise-grade shopping cart frontend built with Next.js 14, TypeScript, and Tailwind CSS. Implements best practices including type safety, error handling, loading states, optimistic UI updates, and accessibility.

## Architecture

### Layer Structure

```
frontend/src/
├── types/cart.ts                     # TypeScript interfaces
├── lib/cart.ts                       # API service layer
├── app/
│   ├── api/cart/                     # Next.js API routes (proxy)
│   │   ├── route.ts                  # GET/POST/DELETE cart
│   │   ├── count/route.ts            # GET cart count
│   │   └── [itemId]/route.ts         # PATCH/DELETE item
│   └── main/cart/page.tsx            # Full cart page
└── Components/Cart/
    ├── CartBadge.tsx                 # Header badge with count
    ├── CartDrawer.tsx                # Sliding sidebar
    ├── AddToCartButton.tsx           # Reusable add button
    └── index.ts                      # Component exports
```

### Design Principles

1. **Separation of Concerns**: API logic (lib/cart.ts) separated from UI (Components)
2. **Type Safety**: Full TypeScript coverage with strict types
3. **Error Handling**: Graceful degradation with user-friendly messages
4. **Loading States**: Visual feedback for all async operations
5. **Accessibility**: ARIA labels, keyboard navigation, semantic HTML
6. **Responsive Design**: Mobile-first, works on all screen sizes
7. **Performance**: Optimized re-renders, lazy loading, API caching

## Components

### 1. CartBadge

**Location**: `Components/Cart/CartBadge.tsx`

**Purpose**: Display cart icon with item count in header

**Features**:

- Auto-refreshes every 30 seconds
- Shows badge only when count > 0
- Animated pulse effect
- Links to cart page

**Usage**:

```tsx
import { CartBadge } from "@/Components/Cart";

<nav>
  <CartBadge />
</nav>;
```

**Props**: None (self-contained)

---

### 2. AddToCartButton

**Location**: `Components/Cart/AddToCartButton.tsx`

**Purpose**: Reusable button for adding products to cart

**Features**:

- Three variants: default, icon, small
- Loading and success states
- Error handling with callbacks
- Disabled state management

**Usage**:

```tsx
import { AddToCartButton } from '@/Components/Cart';

// Default variant (full-width)
<AddToCartButton
  productId={123}
  quantity={2}
  onSuccess={() => console.log('Added!')}
  onError={(msg) => alert(msg)}
/>

// Icon variant (circular button)
<AddToCartButton
  productId={123}
  variant="icon"
/>

// Small variant (compact)
<AddToCartButton
  productId={123}
  variant="small"
  className="mt-4"
/>
```

**Props**:

```typescript
{
  productId: number;        // Required
  quantity?: number;         // Default: 1
  variant?: 'default' | 'icon' | 'small';  // Default: 'default'
  className?: string;        // Additional CSS classes
  onSuccess?: () => void;    // Success callback
  onError?: (message: string) => void;  // Error callback
}
```

---

### 3. CartDrawer

**Location**: `Components/Cart/CartDrawer.tsx`

**Purpose**: Sliding sidebar for quick cart view

**Features**:

- Smooth slide-in animation
- Backdrop overlay
- Quantity controls
- Item removal
- Links to full cart page
- Empty state with CTA

**Usage**:

```tsx
import { useState } from "react";
import { CartDrawer } from "@/Components/Cart";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Cart</button>
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

**Props**:

```typescript
{
  isOpen: boolean;           // Control drawer visibility
  onClose: () => void;       // Close callback
}
```

---

### 4. Cart Page

**Location**: `app/main/cart/page.tsx`

**Purpose**: Full-page cart view with checkout

**Features**:

- Complete item list with images
- Quantity controls with validation
- Remove individual items
- Clear all items
- Real-time subtotal calculation
- Stock availability display
- Discount pricing
- Empty state with CTA
- Loading skeleton
- Error messages
- Responsive design

**Route**: `/main/cart`

**State Management**:

- Cart data (items, subtotal, count)
- Loading states (page load, item updates)
- Error states (API failures)
- Optimistic UI updates

---

## API Service Layer

**Location**: `lib/cart.ts`

### Functions

#### 1. `addToCart(productId, quantity)`

```typescript
const result = await addToCart(5, 2);
if (result.success) {
  console.log("Cart:", result.data);
}
```

#### 2. `fetchCart()`

```typescript
const result = await fetchCart();
if (result.success && result.data) {
  console.log("Items:", result.data.items);
}
```

#### 3. `getCartItemCount()`

```typescript
const result = await getCartItemCount();
console.log("Count:", result.count);
```

#### 4. `updateCartItem(itemId, quantity)`

```typescript
const result = await updateCartItem(5, 3);
```

#### 5. `removeCartItem(itemId)`

```typescript
const result = await removeCartItem(5);
```

#### 6. `clearCart()`

```typescript
const result = await clearCart();
```

### Response Format

All functions return:

```typescript
{
  success: boolean;
  data?: Cart | null;
  message?: string;
}
```

## API Routes (Proxy)

### 1. GET /api/cart

Fetch user's cart

**Response**:

```json
{
  "id": 1,
  "userId": 1,
  "items": [...],
  "subtotal": 150.00,
  "totalItems": 5
}
```

### 2. POST /api/cart

Add item to cart

**Request**:

```json
{
  "productId": 5,
  "quantity": 2
}
```

**Response**: Updated cart (201 Created)

### 3. GET /api/cart/count

Get item count

**Response**:

```json
{
  "count": 5
}
```

### 4. PATCH /api/cart/:itemId

Update quantity

**Request**:

```json
{
  "quantity": 3
}
```

**Response**: Updated cart (200 OK)

### 5. DELETE /api/cart/:itemId

Remove item

**Response**: Updated cart (200 OK)

### 6. DELETE /api/cart

Clear all items

**Response**: Empty cart (200 OK)

## Type Definitions

**Location**: `types/cart.ts`

```typescript
interface CartItem {
  id: number;
  quantity: number;
  product: Product;
  itemTotal: number;
}

interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

interface CartResponse {
  success: boolean;
  data?: Cart | null;
  message?: string;
}

interface CartCountResponse {
  success: boolean;
  count?: number;
  message?: string;
}
```

## Styling Guidelines

### Colors

- Primary: `bg-red-500` / `text-red-500`
- Hover: `hover:bg-red-600`
- Success: `text-green-600`
- Error: `text-red-600` / `bg-red-50`
- Gray scale: `gray-50`, `gray-100`, `gray-300`, `gray-600`, `gray-800`

### Spacing

- Container: `max-w-lg mx-auto`
- Padding: `p-2`, `p-4`, `p-6`
- Gaps: `gap-2`, `gap-3`, `gap-4`

### Typography

- Heading: `text-3xl font-bold`
- Price: `text-2xl font-bold`
- Body: `text-md`, `text-sm`

### Buttons

- Primary: `bg-red-500 hover:bg-red-600 text-white font-semibold`
- Icon: `w-10 h-10 rounded`
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`

## User Experience

### Loading States

1. **Page Load**: Full-screen spinner with message
2. **Item Update**: Opacity overlay on item
3. **Button Action**: Spinner icon in button
4. **Badge Load**: No badge until loaded

### Success Feedback

1. **Add to Cart**: Button shows checkmark for 2 seconds
2. **Update Quantity**: Immediate UI update
3. **Remove Item**: Smooth removal animation

### Error Handling

1. **Network Errors**: Toast notification with retry
2. **Auth Errors**: Redirect to login
3. **Stock Errors**: Display available quantity
4. **Validation Errors**: Inline form errors

### Empty States

1. **Empty Cart**: Large icon + message + CTA button
2. **Zero Count**: No badge displayed
3. **Failed Load**: Error message with refresh button

## Responsive Design

### Mobile (<640px)

- Full-width cart page
- Stacked layout
- Touch-friendly buttons (min 44px)
- Bottom-fixed checkout button

### Tablet (640px-1024px)

- Max-width container
- Larger product images
- Side-by-side layout where possible

### Desktop (>1024px)

- Centered container (max-w-lg)
- Hover states enabled
- Cart drawer from right side

## Performance Optimization

### API Calls

- Debounce quantity updates (300ms)
- Cache cart count (30s TTL)
- Optimistic UI updates
- Request deduplication

### Rendering

- React.memo for expensive components
- useCallback for event handlers
- Key-based list rendering
- Lazy load cart drawer

### Bundle Size

- Tree-shaking imports
- Dynamic imports for drawer
- Minimize dependencies
- Compress images

## Accessibility

### Keyboard Navigation

- Tab through all interactive elements
- Enter to activate buttons
- Escape to close drawer

### Screen Readers

- ARIA labels on icon buttons
- Role attributes on custom controls
- Alt text on all images
- Semantic HTML structure

### Focus Management

- Visible focus indicators
- Focus trap in drawer
- Return focus after close
- Skip links for cart

## Security

### Authentication

- HTTP-only cookies (not accessible to JS)
- CSRF protection via same-site cookies
- No tokens in localStorage
- Automatic token refresh

### Input Validation

- Client-side validation (immediate feedback)
- Server-side validation (security)
- Type checking (TypeScript)
- XSS prevention (React escaping)

### Data Privacy

- No sensitive data in URLs
- Secure API endpoints
- HTTPS only in production
- No user data in logs

## Testing Strategy

### Unit Tests

```typescript
describe("CartService", () => {
  it("should add item to cart", async () => {
    const result = await addToCart(1, 2);
    expect(result.success).toBe(true);
  });

  it("should handle API errors", async () => {
    // Mock fetch failure
    const result = await addToCart(999, 1);
    expect(result.success).toBe(false);
  });
});
```

### Component Tests

```typescript
describe("AddToCartButton", () => {
  it("should show loading state", () => {
    render(<AddToCartButton productId={1} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText(/adding/i)).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
describe("Cart Flow", () => {
  it("should complete full cart journey", async () => {
    // 1. Add item
    // 2. Update quantity
    // 3. View cart
    // 4. Proceed to checkout
  });
});
```

## Common Issues & Solutions

### Issue: Cart count not updating

**Cause**: Badge not refreshing after cart change
**Solution**: Implement event system or state management (Context API)

### Issue: Stale cart data

**Cause**: User modifies cart in another tab
**Solution**: Add visibility change listener to refresh

### Issue: Quantity update race condition

**Cause**: Multiple rapid clicks
**Solution**: Debounce updates and disable during request

### Issue: Image not loading

**Cause**: Missing or invalid image URL
**Solution**: Fallback to placeholder image

## Future Enhancements

### Phase 1 (High Priority)

- [ ] Context API for global cart state
- [ ] Toast notifications for actions
- [ ] Cart persistence (localStorage backup)
- [ ] Saved for later feature

### Phase 2 (Medium Priority)

- [ ] Guest cart (merge on login)
- [ ] Product recommendations in cart
- [ ] Promo code input
- [ ] Shipping calculator

### Phase 3 (Low Priority)

- [ ] Cart sharing (collaborative shopping)
- [ ] Wishlist integration
- [ ] Price drop alerts
- [ ] Recently removed items

## Integration Examples

### Adding CartBadge to Header

```tsx
// Components/Header/Header.tsx
import { CartBadge } from "@/Components/Cart";

export default function Header() {
  return (
    <header>
      <nav className="flex items-center gap-4">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <CartBadge />
      </nav>
    </header>
  );
}
```

### Using AddToCartButton in ProductCard

```tsx
// Components/Products/ProductCard.tsx
import { AddToCartButton } from "@/Components/Cart";

export default function ProductCard({ product }) {
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="product-card">
      <img src={product.imageUrl[0]} alt={product.title} />
      <h3>{product.title}</h3>
      <p>{formatGhs(product.discountedPrice)}</p>

      <AddToCartButton
        productId={product.id}
        variant="small"
        onSuccess={() => setShowToast(true)}
        onError={(msg) => alert(msg)}
      />

      {showToast && <Toast>Added to cart!</Toast>}
    </div>
  );
}
```

### Implementing CartDrawer Toggle

```tsx
// app/layout.tsx or Header component
import { useState } from "react";
import { CartDrawer } from "@/Components/Cart";
import { ShoppingCart } from "lucide-react";

export default function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header>
        <button onClick={() => setDrawerOpen(true)}>
          <ShoppingCart />
        </button>
      </header>

      <main>{children}</main>

      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
```

## Maintenance

### Updating Dependencies

```bash
# Update Next.js
npm install next@latest react@latest react-dom@latest

# Update types
npm install -D @types/react@latest @types/node@latest
```

### Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format
```

## Contributing

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write JSDoc comments

### Component Checklist

- [ ] TypeScript props interface
- [ ] Loading states
- [ ] Error handling
- [ ] Accessibility attributes
- [ ] Responsive design
- [ ] JSDoc documentation

## License

MIT

---

**Version**: 1.0.0  
**Last Updated**: January 9, 2025  
**Maintained By**: Sellr Development Team
