# 🌐 **FRONTEND CATEGORY API DOCUMENTATION**

## **Enterprise-Grade Next.js Category Routes**

**Version:** 1.0.0  
**Last Updated:** November 6, 2025  
**Architecture:** Backend-for-Frontend (BFF) Pattern  
**Framework:** Next.js 14+ App Router

---

## 📋 **TABLE OF CONTENTS**

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [API Routes](#api-routes)
4. [Client Usage](#client-usage)
5. [React Hooks](#react-hooks)
6. [Caching Strategy](#caching-strategy)
7. [Error Handling](#error-handling)
8. [Examples](#examples)
9. [Testing](#testing)

---

## 🎯 **OVERVIEW**

The frontend category API provides a **Backend-for-Frontend (BFF)** layer that:

✅ **Proxies requests** to the backend category service  
✅ **Implements caching** using Redis for high performance  
✅ **Handles errors gracefully** with fallbacks  
✅ **Provides type safety** with TypeScript  
✅ **Offers React hooks** for easy component integration  
✅ **Follows clean architecture** principles

### **Key Features**

🚀 **High Performance** - Redis caching with configurable TTL  
🔒 **Type Safety** - Full TypeScript support  
📊 **Observability** - Structured logging  
⚡ **Optimized** - Parallel requests, cache hits  
🎨 **Developer Experience** - Easy-to-use hooks and utilities

---

## 🏛️ **ARCHITECTURE**

### **BFF Pattern**

```
┌──────────────┐
│   Frontend   │ (React/Next.js Components)
│  Components  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────┐
│      Frontend API Routes (BFF)           │
│  /api/products/categories/*              │
│  - Request validation                    │
│  - Caching layer (Redis)                 │
│  - Error handling                        │
│  - Response transformation               │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│      Backend API (NestJS)                │
│  /products/categories/*                  │
│  - Business logic                        │
│  - Database queries                      │
└──────────────────────────────────────────┘
```

### **File Structure**

```
frontend/src/app/api/products/categories/
├── route.ts                          # GET /api/products/categories
├── types.ts                          # TypeScript definitions
├── client.ts                         # Client utilities & hooks
├── [category]/
│   ├── route.ts                      # GET /api/products/categories/:category
│   ├── stats/
│   │   └── route.ts                  # GET /api/products/categories/:category/stats
│   └── featured/
│       └── route.ts                  # GET /api/products/categories/:category/featured
└── README.md                         # This file
```

---

## 🌐 **API ROUTES**

### **1. Get All Categories**

**Endpoint:** `GET /api/products/categories`

**Purpose:** Retrieve all available categories with product counts

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "category": "clothes",
      "label": "Clothes & Fashion",
      "description": "Clothing, apparel, and fashion items",
      "icon": "shirt",
      "productCount": 234
    }
  ],
  "cached": true,
  "timestamp": "2025-11-06T10:30:00Z"
}
```

**Caching:** 15 minutes

---

### **2. Get Products by Category**

**Endpoint:** `GET /api/products/categories/:category`

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `sortBy` (string, default: newest)
- `condition` (string, optional)
- `minPrice` (number, optional)
- `maxPrice` (number, optional)
- `inStock` (boolean, default: true)

**Example:**

```
GET /api/products/categories/clothes?page=1&limit=20&sortBy=price-asc&minPrice=10&maxPrice=100
```

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 234,
    "totalPages": 12,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "category": {
    "key": "clothes",
    "label": "Clothes & Fashion",
    "description": "..."
  },
  "filters": { "sortBy": "price-asc", "minPrice": 10, "maxPrice": 100 },
  "cached": false,
  "timestamp": "2025-11-06T10:30:00Z"
}
```

**Caching:** 5 minutes

---

### **3. Get Category Statistics**

**Endpoint:** `GET /api/products/categories/:category/stats`

**Response:**

```json
{
  "success": true,
  "data": {
    "category": "clothes",
    "totalProducts": 250,
    "activeProducts": 234,
    "averagePrice": 67.89,
    "priceRange": { "min": 5.0, "max": 500.0 },
    "popularTags": ["vintage", "casual", "summer"]
  },
  "cached": true,
  "timestamp": "2025-11-06T10:30:00Z"
}
```

**Caching:** 10 minutes

---

### **4. Get Featured Products**

**Endpoint:** `GET /api/products/categories/:category/featured`

**Query Parameters:**

- `limit` (number, default: 10, max: 50)

**Response:**

```json
{
  "success": true,
  "data": [...],
  "category": { "key": "clothes", "label": "...", "description": "..." },
  "total": 10,
  "cached": false,
  "timestamp": "2025-11-06T10:30:00Z"
}
```

**Caching:** 15 minutes

---

## 💻 **CLIENT USAGE**

### **Using the API Client**

```tsx
import { categoryAPI } from "@/app/api/products/categories/client";

// 1. Get all categories
async function loadCategories() {
  const { data } = await categoryAPI.getAll();
  console.log(data); // Array of categories
}

// 2. Get products by category
async function loadClothes() {
  const { data, pagination } = await categoryAPI.getProducts("clothes", {
    page: 1,
    limit: 20,
    sortBy: "price-asc",
    minPrice: 10,
    maxPrice: 100,
  });

  console.log(data); // Array of products
  console.log(pagination); // Pagination metadata
}

// 3. Get category statistics
async function loadStats() {
  const { data } = await categoryAPI.getStats("clothes");
  console.log(data.totalProducts); // 234
  console.log(data.averagePrice); // 67.89
}

// 4. Get featured products
async function loadFeatured() {
  const { data } = await categoryAPI.getFeatured("clothes", 5);
  console.log(data); // 5 featured products
}

// 5. Clear cache (admin)
async function clearCache() {
  await categoryAPI.clearCache();
}
```

---

## ⚛️ **REACT HOOKS**

### **useCategories Hook**

Fetch all categories with loading state:

```tsx
"use client";

import { useCategories } from "@/app/api/products/categories/client";

function CategoriesNav() {
  const { categories, loading, error, refetch } = useCategories();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <nav className="categories">
      {categories.map((cat) => (
        <CategoryLink
          key={cat.category}
          href={`/category/${cat.category}`}
          label={cat.label}
          count={cat.productCount}
        />
      ))}
    </nav>
  );
}
```

---

### **useCategoryProducts Hook**

Fetch category products with pagination:

```tsx
"use client";

import { useCategoryProducts } from "@/app/api/products/categories/client";

function CategoryPage({ category }: { category: string }) {
  const { products, pagination, loading, error, setPage, setSort, setFilters } =
    useCategoryProducts(category, {
      limit: 20,
      sortBy: "newest",
    });

  if (loading) return <ProductSkeleton />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {/* Sort Controls */}
      <SortDropdown
        value={sortBy}
        onChange={setSort}
        options={[
          "newest",
          "oldest",
          "price-asc",
          "price-desc",
          "popular",
          "rating",
        ]}
      />

      {/* Filters */}
      <PriceRangeFilter
        onFilter={(min, max) => setFilters({ minPrice: min, maxPrice: max })}
      />

      {/* Products Grid */}
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          current={pagination.page}
          total={pagination.totalPages}
          hasNext={pagination.hasNextPage}
          hasPrev={pagination.hasPreviousPage}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
```

---

## 🚀 **CACHING STRATEGY**

### **Cache Configuration**

```typescript
const CACHE_CONFIG = {
  CATEGORIES_LIST: { ttl: 60 * 15 }, // 15 minutes
  CATEGORY_STATS: { ttl: 60 * 10 }, // 10 minutes
  CATEGORY_PRODUCTS: { ttl: 60 * 5 }, // 5 minutes
  FEATURED_PRODUCTS: { ttl: 60 * 15 }, // 15 minutes
};
```

### **Cache Keys**

```
categories:all
categories:stats:{category}
categories:products:{category}:page:1:limit:20:sort:newest
categories:featured:{category}:limit:10
```

### **Cache Invalidation**

Caches are automatically invalidated after TTL expires.

Manual cache clearing:

```tsx
import { categoryAPI } from "@/app/api/products/categories/client";

await categoryAPI.clearCache(); // DELETE /api/products/categories
```

---

## 🛡️ **ERROR HANDLING**

### **Graceful Degradation**

All routes implement graceful degradation:

```typescript
// If backend fails, return empty data with error message
return NextResponse.json({
  success: false,
  message: "Failed to fetch categories",
  data: [], // Empty array instead of null
});
```

### **Error Response Structure**

```json
{
  "success": false,
  "message": "Invalid category: invalid_cat",
  "error": "Detailed error (development only)"
}
```

### **Client-Side Error Handling**

```tsx
try {
  const { data } = await categoryAPI.getProducts("clothes");
  // Use data
} catch (error) {
  console.error("Failed to load products:", error.message);
  // Show error UI
}
```

---

## 📝 **EXAMPLES**

### **Example 1: Category Landing Page**

```tsx
"use client";

import { useCategoryProducts } from "@/app/api/products/categories/client";
import { ProductCategory } from "@/app/api/products/categories/types";

export default function CategoryPage({
  params,
}: {
  params: { category: ProductCategory };
}) {
  const { products, pagination, loading, error, setPage, setSort } =
    useCategoryProducts(params.category, {
      limit: 24,
      sortBy: "newest",
    });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="container">
      <CategoryHeader category={params.category} />

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <CategoryFilters onFilter={setFilters} />

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between mb-4">
            <p>{pagination?.totalCount} products found</p>
            <SortSelect value={sortBy} onChange={setSort} />
          </div>

          <ProductGrid products={products} />

          <Pagination {...pagination} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
```

---

### **Example 2: Homepage Featured Categories**

```tsx
"use client";

import { categoryAPI } from "@/app/api/products/categories/client";
import { useEffect, useState } from "react";

export default function FeaturedCategories() {
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const categories = ["clothes", "accessories", "home"];
      const results = await Promise.all(
        categories.map((cat) => categoryAPI.getFeatured(cat, 6))
      );

      setFeatured(
        results.map((r, i) => ({
          category: categories[i],
          products: r.data,
        }))
      );
    }

    load();
  }, []);

  return (
    <div>
      {featured.map(({ category, products }) => (
        <section key={category}>
          <h2>{getCategoryLabel(category)}</h2>
          <ProductCarousel products={products} />
        </section>
      ))}
    </div>
  );
}
```

---

### **Example 3: Category Statistics Dashboard**

```tsx
"use client";

import { categoryAPI } from "@/app/api/products/categories/client";
import { useEffect, useState } from "react";

export default function CategoryDashboard() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data: categories } = await categoryAPI.getAll();

      const statsData = await Promise.all(
        categories.map((cat) => categoryAPI.getStats(cat.category))
      );

      setStats(statsData.map((s) => s.data));
    }

    load();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.category} className="card">
          <h3>{stat.category}</h3>
          <p>Total: {stat.totalProducts}</p>
          <p>Active: {stat.activeProducts}</p>
          <p>Avg Price: ${stat.averagePrice.toFixed(2)}</p>
          <p>
            Range: ${stat.priceRange.min} - ${stat.priceRange.max}
          </p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🧪 **TESTING**

### **Manual Testing**

```bash
# 1. Get all categories
curl http://localhost:3000/api/products/categories

# 2. Get clothes products
curl http://localhost:3000/api/products/categories/clothes

# 3. Get with filters
curl "http://localhost:3000/api/products/categories/clothes?minPrice=10&maxPrice=100&sortBy=price-asc"

# 4. Get category stats
curl http://localhost:3000/api/products/categories/clothes/stats

# 5. Get featured products
curl "http://localhost:3000/api/products/categories/clothes/featured?limit=5"

# 6. Clear cache
curl -X DELETE http://localhost:3000/api/products/categories
```

### **Browser Testing**

1. Open browser console
2. Test API client:

```javascript
// In browser console
const { categoryAPI } = await import("/app/api/products/categories/client");

// Get all categories
const categories = await categoryAPI.getAll();
console.log(categories);

// Get products
const products = await categoryAPI.getProducts("clothes", { limit: 5 });
console.log(products);
```

---

## 📊 **PERFORMANCE METRICS**

### **Target Metrics**

| Metric              | Target  | With Cache | Without Cache |
| ------------------- | ------- | ---------- | ------------- |
| Response Time (P50) | < 100ms | ~20ms      | ~150ms        |
| Response Time (P95) | < 300ms | ~50ms      | ~300ms        |
| Cache Hit Rate      | > 80%   | -          | -             |
| Error Rate          | < 1%    | -          | -             |

### **Monitoring**

Check server logs for performance metrics:

```
⚡ Cache HIT: categories:products:clothes:page:1... | Duration: 23ms
💨 Cache MISS: categories:stats:accessories | Duration: 145ms
✅ Category products retrieved | Category: clothes | Products: 20 | Duration: 138ms
```

---

## 🔧 **TROUBLESHOOTING**

### **Issue: No cache hits**

**Cause:** Redis not configured or connection failed  
**Solution:** Check Redis configuration in `.env`

### **Issue: Stale data**

**Cause:** Cache TTL too long  
**Solution:** Clear cache manually or reduce TTL

### **Issue: Slow response times**

**Cause:** Backend API slow or cache disabled  
**Solution:** Check backend performance, verify Redis connection

---

## 🎯 **SUMMARY**

✅ **4 API routes created** - All categories, products, stats, featured  
✅ **Type-safe client utilities** - Full TypeScript support  
✅ **React hooks** - Easy integration with components  
✅ **Redis caching** - High performance with configurable TTL  
✅ **Error handling** - Graceful degradation  
✅ **Comprehensive docs** - This file + inline comments

**Status:** ✅ **PRODUCTION READY**

---

**Last Updated:** November 6, 2025  
**Version:** 1.0.0  
**Maintainer:** Engineering Team
