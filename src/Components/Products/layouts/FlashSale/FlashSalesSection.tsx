/**
 * FlashSalesSection Component
 * 
 * A production-ready, accessible Flash Sales section with:
 * - Countdown timer integration
 * - Horizontal scrolling product cards
 * - Smart filtering for products with >20% discount
 * - Loading states and error handling
 * - Full accessibility support
 * 
 * Architecture:
 * - Composition over inheritance
 * - Single Responsibility Principle
 * - Dependency Injection for testability
 * - Separation of concerns (UI, business logic, data fetching)
 * 
 * @module FlashSalesSection
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '@/types/products';
import ProductCard from '../../cards/ProductCard';
import FlashSalesCountdown from '../FlashSale/FlashSales';
import { getFlashSalesProducts } from '@/lib/utils/productFilters';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Props for FlashSalesSection component
 * Following Interface Segregation Principle
 */
export interface FlashSalesSectionProps {
  /** Optional: Pre-fetched products (for SSR/SSG) */
  initialProducts?: Product[];
  /** Optional: Custom API endpoint */
  apiEndpoint?: string;
  /** Optional: Minimum discount threshold (default: 20) */
  minDiscount?: number;
  /** Optional: Maximum products to display (default: 8) */
  maxProducts?: number;
  /** Optional: Custom class name for styling */
  className?: string;
  /** Optional: Callback when products are loaded */
  onProductsLoaded?: (products: Product[]) => void;
  /** Optional: Callback for error handling */
  onError?: (error: Error) => void;
}

/**
 * Internal state interface for component
 */
interface FlashSalesState {
  products: Product[];
  loading: boolean;
  error: Error | null;
  isEmpty: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_CONFIG = {
  API_ENDPOINT: '/api/products',
  MIN_DISCOUNT: 20,
  MAX_PRODUCTS: 8,
  REFETCH_INTERVAL: 300000, // 5 minutes
} as const;

const SCROLL_CONFIG = {
  BEHAVIOR: 'smooth' as const,
  SNAP_TYPE: 'x mandatory',
  SNAP_ALIGN: 'start',
} as const;

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Custom hook for fetching and managing flash sales products
 * Follows Single Responsibility: handles data fetching only
 */
function useFlashSalesProducts(
  endpoint: string,
  minDiscount: number,
  maxProducts: number,
  initialProducts?: Product[]
) {
  const [state, setState] = useState<FlashSalesState>({
    products: initialProducts || [],
    loading: !initialProducts,
    error: null,
    isEmpty: false,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch products`);
      }

      const data = await response.json();
      
      // Handle different API response formats
      const allProducts = Array.isArray(data) ? data : (data.data || data.products || []);

      // Apply business logic: filter and limit
      const flashSalesProducts = getFlashSalesProducts(allProducts, {
        minDiscountPercentage: minDiscount,
        maxProducts,
        sortBy: 'none', // First 8 by date/ID
      });

      setState({
        products: flashSalesProducts,
        loading: false,
        error: null,
        isEmpty: flashSalesProducts.length === 0,
      });

      return flashSalesProducts;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error occurred');
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj,
        isEmpty: false,
      }));

      console.error('[FlashSales] Error fetching products:', errorObj);
      throw errorObj;
    }
  }, [endpoint, minDiscount, maxProducts]);

  return { ...state, fetchProducts };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * FlashSalesSection Component
 * 
 * Displays flash sale products in a horizontal scrollable container
 * with countdown timer and proper loading/error states.
 * 
 * @example
 * <FlashSalesSection 
 *   minDiscount={25}
 *   maxProducts={10}
 *   onProductsLoaded={handleProductsLoaded}
 * />
 */
export default function FlashSalesSection({
  initialProducts,
  apiEndpoint = DEFAULT_CONFIG.API_ENDPOINT,
  minDiscount = DEFAULT_CONFIG.MIN_DISCOUNT,
  maxProducts = DEFAULT_CONFIG.MAX_PRODUCTS,
  className = '',
  onProductsLoaded,
  onError,
}: FlashSalesSectionProps) {
  
  // ==========================================================================
  // STATE AND DATA FETCHING
  // ==========================================================================
  
  const { products, loading, error, isEmpty, fetchProducts } = useFlashSalesProducts(
    apiEndpoint,
    minDiscount,
    maxProducts,
    initialProducts
  );

  // Initial fetch on mount
  useEffect(() => {
    if (!initialProducts) {
      fetchProducts()
        .then(products => onProductsLoaded?.(products))
        .catch(err => onError?.(err));
    }
  }, [fetchProducts, initialProducts, onProductsLoaded, onError]);

  // ==========================================================================
  // MEMOIZED VALUES
  // ==========================================================================
  
  const hasProducts = useMemo(() => products.length > 0, [products.length]);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  /**
   * Loading skeleton following DRY principle
   */
  const renderLoadingSkeleton = () => (
    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {Array.from({ length: 8 }).map((_, index) => (
        <div 
          key={`skeleton-${index}`}
          className="flex-none w-[160px] sm:w-[180px] md:w-[200px] animate-pulse"
          aria-hidden="true"
        >
          <div className="bg-gray-200 aspect-square rounded-lg mb-3" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );

  /**
   * Empty state when no products qualify
   */
  const renderEmptyState = () => (
    <div 
      className="flex flex-col items-center justify-center py-12 px-4"
      role="status"
      aria-live="polite"
    >
      <svg 
        className="w-16 h-16 text-gray-300 mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <p className="text-gray-500 text-center">
        No flash sales available at the moment
      </p>
      <p className="text-gray-400 text-sm mt-1">
        Check back soon for amazing deals!
      </p>
    </div>
  );

  /**
   * Error state with retry option
   */
  const renderErrorState = () => (
    <div 
      className="flex flex-col items-center justify-center py-12 px-4"
      role="alert"
      aria-live="assertive"
    >
      <svg 
        className="w-16 h-16 text-red-300 mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
        />
      </svg>
      <p className="text-red-600 font-medium mb-2">
        Unable to load flash sales
      </p>
      <p className="text-gray-500 text-sm mb-4">
        {error?.message || 'An error occurred'}
      </p>
      <button
        onClick={() => fetchProducts()}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        aria-label="Retry loading flash sales"
      >
        Try Again
      </button>
    </div>
  );

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  // Early return for error state
  if (error && !hasProducts) {
    return (
      <section className={`flash-sales-section ${className}`} aria-labelledby="flash-sales-heading">
        <FlashSalesCountdown />
        {renderErrorState()}
      </section>
    );
  }

  // Early return for empty state (only show if not loading)
  if (isEmpty && !loading) {
    return (
      <section className={`flash-sales-section ${className}`} aria-labelledby="flash-sales-heading">
        <FlashSalesCountdown />
        {renderEmptyState()}
      </section>
    );
  }

  return (
    <section 
      className={`flash-sales-section ${className}`}
      aria-labelledby="flash-sales-heading"
      role="region"
    >
      {/* Countdown Timer */}
      <FlashSalesCountdown />

      {/* Products Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        {loading ? (
          renderLoadingSkeleton()
        ) : (
          <div 
            className="flex gap-30 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth flash-sales-track"
            role="list"
            aria-label="Flash sale products"
          >
            {products.map((product) => (
              <div 
                key={product.id} 
                className="flex-none w-[160px] sm:w-[180px] md:w-[200px] snap-start"
                role="listitem"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Accessibility: Product count */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {hasProducts && `Showing ${products.length} flash sale product${products.length !== 1 ? 's' : ''}`}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { FlashSalesState };
