/**
 * Category API Client Utilities
 * 
 * Enterprise-grade client-side API functions for category operations
 * 
 * Architecture: Service Layer Pattern
 * - Provides clean API for frontend components
 * - Handles request/response transformation
 * - Implements error handling
 * - Type-safe with TypeScript
 * 
 * Usage in components:
 * ```tsx
 * import { categoryAPI } from '@/app/api/products/categories/client';
 * 
 * // Get all categories
 * const categories = await categoryAPI.getAll();
 * 
 * // Get products by category
 * const products = await categoryAPI.getProducts('clothes', { page: 1, limit: 20 });
 * ```
 */

'use client';

import React from 'react';
import {
  ProductCategory,
  CategoryProductsParams,
  CategoryProductsResponse,
  CategoryStatsResponse,
  FeaturedProductsResponse,
  CategoriesListResponse,
  CategoryAPIError,
  CategoryMetadata,
  CategoryProduct,
  PaginationMetadata,
  CategorySortOption,
} from './types';

/**
 * Base configuration for API requests
 */
const API_CONFIG = {
  baseURL: '/api/products/categories',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * Utility: Build query string from parameters
 */
function buildQueryString(params: Record<string, any>): string {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return filtered ? `?${filtered}` : '';
}

/**
 * Utility: Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: CategoryAPIError = await response.json().catch(() => ({
      success: false,
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));
    
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

/**
 * Category API Client
 * 
 * Provides type-safe methods for all category operations
 */
export const categoryAPI = {
  /**
   * Get all categories with product counts
   * 
   * @returns Promise<CategoriesListResponse>
   * @throws Error if request fails
   * 
   * @example
   * const { data } = await categoryAPI.getAll();
   * console.log(data); // Array of categories
   */
  async getAll(): Promise<CategoriesListResponse> {
    const response = await fetch(`${API_CONFIG.baseURL}`, {
      method: 'GET',
      headers: API_CONFIG.defaultHeaders,
    });

    return handleResponse<CategoriesListResponse>(response);
  },

  /**
   * Get products for a specific category
   * 
   * @param category - Category to fetch products for
   * @param params - Optional filtering and pagination parameters
   * @returns Promise<CategoryProductsResponse>
   * @throws Error if request fails
   * 
   * @example
   * const { data, pagination } = await categoryAPI.getProducts('clothes', {
   *   page: 1,
   *   limit: 20,
   *   sortBy: 'price-asc',
   *   minPrice: 10,
   *   maxPrice: 100,
   * });
   */
  async getProducts(
    category: ProductCategory | string,
    params: Omit<CategoryProductsParams, 'category'> = {}
  ): Promise<CategoryProductsResponse> {
    const queryString = buildQueryString(params);
    const response = await fetch(
      `${API_CONFIG.baseURL}/${category}${queryString}`,
      {
        method: 'GET',
        headers: API_CONFIG.defaultHeaders,
      }
    );

    return handleResponse<CategoryProductsResponse>(response);
  },

  /**
   * Get statistics for a specific category
   * 
   * @param category - Category to get statistics for
   * @returns Promise<CategoryStatsResponse>
   * @throws Error if request fails
   * 
   * @example
   * const { data } = await categoryAPI.getStats('clothes');
   * console.log(data.totalProducts); // 234
   * console.log(data.averagePrice); // 67.89
   */
  async getStats(
    category: ProductCategory | string
  ): Promise<CategoryStatsResponse> {
    const response = await fetch(
      `${API_CONFIG.baseURL}/${category}/stats`,
      {
        method: 'GET',
        headers: API_CONFIG.defaultHeaders,
      }
    );

    return handleResponse<CategoryStatsResponse>(response);
  },

  /**
   * Get featured products for a specific category
   * 
   * @param category - Category to get featured products for
   * @param limit - Number of featured products (default: 10, max: 50)
   * @returns Promise<FeaturedProductsResponse>
   * @throws Error if request fails
   * 
   * @example
   * const { data } = await categoryAPI.getFeatured('clothes', 5);
   * console.log(data); // 5 featured products
   */
  async getFeatured(
    category: ProductCategory | string,
    limit: number = 10
  ): Promise<FeaturedProductsResponse> {
    const queryString = buildQueryString({ limit });
    const response = await fetch(
      `${API_CONFIG.baseURL}/${category}/featured${queryString}`,
      {
        method: 'GET',
        headers: API_CONFIG.defaultHeaders,
      }
    );

    return handleResponse<FeaturedProductsResponse>(response);
  },

  /**
   * Clear category caches (admin operation)
   * 
   * @returns Promise<{ success: boolean; message: string }>
   * @throws Error if request fails
   * 
   * @example
   * await categoryAPI.clearCache();
   */
  async clearCache(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_CONFIG.baseURL}`, {
      method: 'DELETE',
      headers: API_CONFIG.defaultHeaders,
    });

    return handleResponse(response);
  },
};

/**
 * React Hook: useCategories
 * 
 * Custom hook for fetching categories with loading state
 * 
 * @example
 * ```tsx
 * import { useCategories } from '@/app/api/products/categories/client';
 * 
 * function CategoriesNav() {
 *   const { categories, loading, error, refetch } = useCategories();
 *   
 *   if (loading) return <Spinner />;
 *   if (error) return <Error message={error} />;
 *   
 *   return (
 *     <nav>
 *       {categories.map(cat => (
 *         <CategoryLink key={cat.category} {...cat} />
 *       ))}
 *     </nav>
 *   );
 * }
 * ```
 */
export function useCategories() {
  const [categories, setCategories] = React.useState<CategoryMetadata[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCategories = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

/**
 * React Hook: useCategoryProducts
 * 
 * Custom hook for fetching category products with pagination
 * 
 * @example
 * ```tsx
 * import { useCategoryProducts } from '@/app/api/products/categories/client';
 * 
 * function CategoryPage({ category }) {
 *   const {
 *     products,
 *     pagination,
 *     loading,
 *     error,
 *     setPage,
 *     setSort,
 *   } = useCategoryProducts(category, { limit: 20 });
 *   
 *   return (
 *     <div>
 *       <ProductGrid products={products} />
 *       <Pagination {...pagination} onPageChange={setPage} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useCategoryProducts(
  category: ProductCategory | string,
  initialParams: Omit<CategoryProductsParams, 'category'> = {}
) {
  const [products, setProducts] = React.useState<CategoryProduct[]>([]);
  const [pagination, setPagination] = React.useState<PaginationMetadata | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [params, setParams] = React.useState(initialParams);

  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryAPI.getProducts(category, params);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [category, params]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    pagination,
    loading,
    error,
    refetch: fetchProducts,
    setPage: (page: number) => setParams(prev => ({ ...prev, page })),
    setSort: (sortBy: CategorySortOption) => setParams(prev => ({ ...prev, sortBy })),
    setFilters: (filters: Partial<CategoryProductsParams>) => 
      setParams(prev => ({ ...prev, ...filters })),
  };
}

// Re-export types and enums for convenience
export { ProductCategory } from './types';
export type {
  CategoryMetadata,
  CategoryProduct,
  PaginationMetadata,
  CategorySortOption,
  CategoryProductsParams,
  CategoryProductsResponse,
  CategoryStatsResponse,
  FeaturedProductsResponse,
  CategoriesListResponse,
} from './types';
