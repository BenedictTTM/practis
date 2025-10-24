/**
 * Custom hook for paginated products
 * 
 * Usage:
 * const { products, pagination, isLoading, error, navigation } = useProducts(1, 20);
 */

import { useState, useEffect, useCallback } from 'react';
import type { Product, PaginationMeta, UsePaginatedProductsReturn } from '@/types/pagination.types';

interface UseProductsOptions {
  /** Initial page number */
  initialPage?: number;
  
  /** Items per page */
  limit?: number;
  
  /** Auto-fetch on mount */
  autoFetch?: boolean;
}

export function useProducts(
  initialPage: number = 1,
  limit: number = 20,
  options?: UseProductsOptions
): UsePaginatedProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [page, setPage] = useState(initialPage);

  const fetchProducts = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch(
        `/api/products?page=${pageNum}&limit=${limit}`,
        {
          credentials: 'include', // Include cookies for auth
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (options?.autoFetch !== false) {
      fetchProducts(page);
    }
  }, [page, fetchProducts, options?.autoFetch]);

  const navigation = {
    goToFirst: () => setPage(1),
    goToPrevious: () => setPage(p => Math.max(1, p - 1)),
    goToNext: () => setPage(p => p + 1),
    goToLast: () => pagination && setPage(pagination.totalPages),
    goToPage: (newPage: number) => {
      if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
        setPage(newPage);
      }
    },
    isFirstPage: page === 1,
    isLastPage: page === pagination?.totalPages,
  };

  return {
    products,
    pagination,
    isLoading,
    error,
    refresh: () => fetchProducts(page),
    navigation,
  };
}

/**
 * Hook for products by category
 */
export function useProductsByCategory(
  category: string,
  initialPage: number = 1,
  limit: number = 20
): UsePaginatedProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [page, setPage] = useState(initialPage);

  const fetchProducts = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch(
        `/api/products/category/${category}?page=${pageNum}&limit=${limit}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, limit]);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const navigation = {
    goToFirst: () => setPage(1),
    goToPrevious: () => setPage(p => Math.max(1, p - 1)),
    goToNext: () => setPage(p => p + 1),
    goToLast: () => pagination && setPage(pagination.totalPages),
    goToPage: (newPage: number) => {
      if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
        setPage(newPage);
      }
    },
    isFirstPage: page === 1,
    isLastPage: page === pagination?.totalPages,
  };

  return {
    products,
    pagination,
    isLoading,
    error,
    refresh: () => fetchProducts(page),
    navigation,
  };
}

/**
 * Hook for user's own products (requires auth)
 */
export function useMyProducts(
  initialPage: number = 1,
  limit: number = 20
): UsePaginatedProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [page, setPage] = useState(initialPage);

  const fetchProducts = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch(
        `/api/products/user/me?page=${pageNum}&limit=${limit}`,
        {
          credentials: 'include', // Required for auth
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const navigation = {
    goToFirst: () => setPage(1),
    goToPrevious: () => setPage(p => Math.max(1, p - 1)),
    goToNext: () => setPage(p => p + 1),
    goToLast: () => pagination && setPage(pagination.totalPages),
    goToPage: (newPage: number) => {
      if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
        setPage(newPage);
      }
    },
    isFirstPage: page === 1,
    isLastPage: page === pagination?.totalPages,
  };

  return {
    products,
    pagination,
    isLoading,
    error,
    refresh: () => fetchProducts(page),
    navigation,
  };
}

/**
 * Hook for infinite scroll products
 */
export function useInfiniteProducts(limit: number = 20) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch(
        `/api/products?page=${page}&limit=${limit}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setProducts(prev => [...prev, ...data.data]);
      setHasMore(data.pagination.hasNextPage);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more products'));
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, isLoading, hasMore]);

  const reset = useCallback(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setError(undefined);
  }, []);

  return {
    products,
    loadMore,
    hasMore,
    isLoading,
    error,
    reset,
  };
}
