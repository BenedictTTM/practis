# ProductsGridLayout Component

A specialized, full-width responsive grid component for displaying products in an e-commerce application.

## Features

- ✅ **Responsive Grid Layout** - Automatically adjusts columns based on screen size
- ✅ **Full-Width Display** - Extends to fill available page width (no horizontal scrolling)
- ✅ **Configurable Columns** - Customize column count per breakpoint
- ✅ **Loading States** - Built-in skeleton loading animation
- ✅ **Empty State** - Beautiful empty state when no products available
- ✅ **Accessibility** - ARIA labels and semantic HTML
- ✅ **Performance Optimized** - Efficient rendering with proper React keys

## Usage

### Basic Usage

```tsx
import { ProductsGridLayout } from "@/Components/Products/layouts";

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  return <ProductsGridLayout products={products} />;
}
```

### With Loading State

```tsx
<ProductsGridLayout products={products} loading={isLoading} />
```

### Custom Column Configuration

```tsx
<ProductsGridLayout
  products={products}
  columns={{
    mobile: 1, // 1 column on mobile
    tablet: 2, // 2 columns on tablet
    desktop: 3, // 3 columns on desktop
    wide: 4, // 4 columns on wide screens
  }}
/>
```

### With Custom Styling

```tsx
<ProductsGridLayout products={products} className="my-8 px-4" />
```

## Variants

### CompactProductsGrid

More columns for smaller card displays:

```tsx
import { CompactProductsGrid } from "@/Components/Products/layouts";

<CompactProductsGrid products={products} />;
// Mobile: 2 cols, Tablet: 3 cols, Desktop: 4 cols, Wide: 6 cols
```

### WideProductsGrid

Optimized for large displays:

```tsx
import { WideProductsGrid } from "@/Components/Products/layouts";

<WideProductsGrid products={products} />;
// Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols, Wide: 5 cols
```

## Props

| Prop        | Type           | Default   | Description                         |
| ----------- | -------------- | --------- | ----------------------------------- |
| `products`  | `Product[]`    | Required  | Array of products to display        |
| `className` | `string`       | `''`      | Additional CSS classes              |
| `loading`   | `boolean`      | `false`   | Show loading skeleton               |
| `columns`   | `ColumnConfig` | See below | Column configuration per breakpoint |

### ColumnConfig

```typescript
{
  mobile?: number;   // Columns on mobile (<640px)
  tablet?: number;   // Columns on tablet (640px-1024px)
  desktop?: number;  // Columns on desktop (1024px-1280px)
  wide?: number;     // Columns on wide screens (>1280px)
}
```

Default configuration:

```typescript
{
  mobile: 1,
  tablet: 2,
  desktop: 3,
  wide: 4
}
```

## Responsive Breakpoints

| Breakpoint | Screen Size     | Default Columns |
| ---------- | --------------- | --------------- |
| Mobile     | < 640px         | 1               |
| Tablet     | 640px - 1024px  | 2               |
| Desktop    | 1024px - 1280px | 3               |
| Wide       | > 1280px        | 4               |
| Ultra-wide | > 1536px        | 5               |

## Comparison with ProductsGrid

| Feature   | ProductsGrid                | ProductsGridLayout    |
| --------- | --------------------------- | --------------------- |
| Layout    | Horizontal scroll           | Responsive grid       |
| Width     | Fixed card widths           | Full-width responsive |
| Scrolling | Horizontal                  | Vertical (wraps)      |
| Best for  | Flash sales, featured items | Main product listings |
| Columns   | Fixed                       | Responsive (1-5+)     |

## Examples

### Complete Product Page Example

```tsx
"use client";

import { useState, useEffect } from "react";
import { ProductsGridLayout } from "@/Components/Products/layouts";
import { ProductsGrid } from "@/Components/Products/cards";
import FlashSales from "@/Components/Products/layouts/FlashSales";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Flash Sales - Horizontal Scroll */}
      <FlashSales />

      {/* Main Products - Full Width Grid */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6">All Products</h2>
        <ProductsGridLayout products={products} loading={loading} />
      </section>
    </div>
  );
}
```

### With Filters and Pagination

```tsx
function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const productsPerPage = 12;

  const paginatedProducts = products.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  return (
    <>
      <ProductsGridLayout products={paginatedProducts} />

      <div className="flex justify-center gap-2 mt-8">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </>
  );
}
```

## Styling

The component uses Tailwind CSS classes and can be customized:

```tsx
<ProductsGridLayout
  products={products}
  className="
    bg-white 
    rounded-lg 
    shadow-lg 
    p-6
  "
/>
```

## Accessibility

- Uses semantic HTML (`role="list"`, `role="listitem"`)
- Includes ARIA labels for screen readers
- Keyboard navigable
- Focus indicators on interactive elements

## Performance Tips

1. **Memoize products array** if it doesn't change frequently
2. **Use pagination** for large product lists (>50 items)
3. **Lazy load images** in ProductCard component
4. **Virtual scrolling** for extremely large datasets (1000+ items)

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ✅ IE11 (with polyfills)

## Related Components

- `ProductCard` - Individual product display
- `ProductsGrid` - Horizontal scrolling product list
- `FlashSales` - Flash sales with countdown
- `ProductSidebar` - Filters and categories

## Migration Guide

### From ProductsGrid to ProductsGridLayout

**Before:**

```tsx
<ProductsGrid products={products} />
```

**After:**

```tsx
<ProductsGridLayout products={products} />
```

The main difference is that `ProductsGrid` creates a horizontal scroller (good for flash sales), while `ProductsGridLayout` creates a full-width responsive grid (good for main product listings).

## Changelog

### v1.0.0

- Initial release
- Responsive grid layout
- Loading states
- Empty state handling
- Configurable columns
- Accessibility features
