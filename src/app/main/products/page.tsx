/**
 * Products Page - Main E-commerce Product Listing
 * 
 * Senior Frontend Engineering Principles Applied:
 * - Separation of Concerns (Custom hooks for data fetching)
 * - Performance Optimization (useMemo, useCallback, code splitting)
 * - Error Boundaries and Resilient Error Handling
 * - Accessibility (ARIA labels, semantic HTML, keyboard navigation)
 * - Type Safety (Strict TypeScript interfaces)
 * - Clean Code (Single Responsibility, DRY, KISS principles)
 * 
 * @module ProductsPage
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '../../../types/products';
import { 
  ProductsGridLayout, 
  FlashSalesSection 
} from '../../../Components/Products/layouts';
import { HowToSection } from '../../../Components/HowTo';
import Categories from '../../../Components/Products/layouts/Categories';
import ServiceFeatures from '../../../Components/Products/layouts/serviceFeatures';
import { DotLoader } from '../../../Components/Loaders';
import { MultipleSchemas } from '../../../Components/Schema';
import {
  generateProductListSchema,
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateFlashSalesSchema,
  generateOrganizationSchema,
} from '../../../lib/schemas/productSchemas';
import '../../../Components/Products/styles/products.css';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
}

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
}

interface FlashSalesData {
  products: Product[];
  nextRefreshAt: string;
  refreshesIn: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CONFIG = {
  INITIAL_PRODUCTS_DISPLAY: 12,
  API: {
    PRODUCTS: '/api/products',
    FLASH_SALES: '/api/products/flash-sales',
  },
  RETRY_DELAY: 3000,
} as const;

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Custom hook for fetching and managing products
 * Follows Single Responsibility Principle
 */
function useProducts() {
  const [state, setState] = useState<ProductsState>({
    products: [],
    filteredProducts: [],
    loading: true,
    error: null,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(CONFIG.API.PRODUCTS, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch products`);
      }

      const data = await response.json();
      const productsArray = Array.isArray(data) ? data : data.data || [];

      setState({
        products: productsArray,
        filteredProducts: productsArray,
        loading: false,
        error: null,
      });

      return productsArray;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      console.error('[ProductsPage] Fetch error:', err);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      throw err;
    }
  }, []);

  return { ...state, fetchProducts };
}

/**
 * Custom hook for managing flash sales with countdown
 */
function useFlashSales() {
  const [flashSalesData, setFlashSalesData] = useState<FlashSalesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFlashSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(CONFIG.API.FLASH_SALES, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch flash sales`);
      }

      const data: FlashSalesData = await response.json();
      setFlashSalesData(data);
      
      return data;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error');
      console.error('[FlashSales] Fetch error:', errorObj);
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh when timer expires
  useEffect(() => {
    if (!flashSalesData?.refreshesIn) return;

    const timeoutId = setTimeout(() => {
      console.log('[FlashSales] Auto-refreshing...');
      fetchFlashSales();
    }, flashSalesData.refreshesIn);

    return () => clearTimeout(timeoutId);
  }, [flashSalesData?.refreshesIn, fetchFlashSales]);

  return { flashSalesData, loading, error, fetchFlashSales };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Apply filters to products
 * Pure function for testability
 */
function applyProductFilters(products: Product[], filters: FilterState): Product[] {
  let filtered = [...products];

  // Filter by category
  if (filters.category && filters.category !== 'All Categories') {
    filtered = filtered.filter(product => 
      product.category?.toLowerCase() === filters.category.toLowerCase()
    );
  }

  // Filter by price range
  const [minPrice, maxPrice] = filters.priceRange;
  filtered = filtered.filter(product => {
    const price = product.discountedPrice || product.originalPrice || 0;
    return price >= minPrice && price <= maxPrice;
  });

  // Filter by rating
  if (filters.rating > 0) {
    filtered = filtered.filter(product => {
      const rating = product.averageRating || 0;
      return rating >= filters.rating;
    });
  }

  return filtered;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProductsPage() {
  // ==========================================================================
  // STATE AND HOOKS
  // ==========================================================================
  
  const { 
    products, 
    filteredProducts, 
    loading, 
    error, 
    fetchProducts 
  } = useProducts();

  const { 
    flashSalesData, 
    loading: flashSalesLoading, 
    error: flashSalesError,
    fetchFlashSales 
  } = useFlashSales();

  const [showAllProducts, setShowAllProducts] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    category: 'All Categories',
    priceRange: [0, Number.MAX_SAFE_INTEGER],
    rating: 0,
  });

  // ==========================================================================
  // EFFECTS
  // ==========================================================================
  
  // Initial data fetch
  useEffect(() => {
    fetchProducts().catch(console.error);
    fetchFlashSales().catch(console.error);
  }, [fetchProducts, fetchFlashSales]);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  /**
   * Handle filter changes
   * Uses useCallback to prevent unnecessary re-renders
   */
  const handleFiltersChange = useCallback((filters: FilterState) => {
    setActiveFilters(filters);
    // Reset pagination when filters change
    setShowAllProducts(false);
  }, []);

  /**
   * Toggle view all products
   */
  const toggleViewAll = useCallback(() => {
    setShowAllProducts(prev => !prev);
  }, []);

  /**
   * Retry fetch on error
   */
  const handleRetry = useCallback(() => {
    fetchProducts().catch(console.error);
  }, [fetchProducts]);

  // ==========================================================================
  // MEMOIZED VALUES
  // ==========================================================================

  /**
   * Apply filters only when products or filters change
   */
  const displayProducts = useMemo(() => {
    const filtered = applyProductFilters(products, activeFilters);
    return showAllProducts ? filtered : filtered.slice(0, CONFIG.INITIAL_PRODUCTS_DISPLAY);
  }, [products, activeFilters, showAllProducts]);

  const totalFilteredCount = useMemo(() => {
    return applyProductFilters(products, activeFilters).length;
  }, [products, activeFilters]);

  const shouldShowViewAllButton = totalFilteredCount > CONFIG.INITIAL_PRODUCTS_DISPLAY;

  // ==========================================================================
  // SEO SCHEMAS (Structured Data for Rich Results)
  // ==========================================================================

  /**
   * Generate JSON-LD schemas for SEO
   * Memoized to prevent regeneration on every render
   */
  const schemas = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sellr.com';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : `${baseUrl}/main/products`;

    return [
      // Organization Schema
      generateOrganizationSchema(
        'Sellr',
        baseUrl,
        `${baseUrl}/logo.png`
      ),

      // WebPage Schema
      generateWebPageSchema(
        'Browse Products - Sellr',
        'Discover amazing products with great deals and flash sales. Shop electronics, fashion, home goods, and more.',
        currentUrl
      ),

      // Breadcrumb Schema
      generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/main/products' },
      ], baseUrl),

      // Product List Schema (for main products)
      ...(displayProducts.length > 0 ? [generateProductListSchema(displayProducts, baseUrl)] : []),

      // Flash Sales Schema (if available)
      ...(flashSalesData?.products && flashSalesData.products.length > 0
        ? [generateFlashSalesSchema(flashSalesData.products, flashSalesData.nextRefreshAt)]
        : []
      ),
    ];
  }, [displayProducts, flashSalesData]);

  // ==========================================================================
  // RENDER HELPERS (Components as pure functions)
  // ==========================================================================

  /**
   * Loading state component
   * Extracted for reusability and testing
   */
  const LoadingState = () => (
    <div 
      className="min-h-screen bg-gray-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading products"
    >
      <div className="text-center">
        <DotLoader 
          size={60}
          color="#E43C3C"
          ariaLabel="Loading amazing products"
        />
        <p className="text-[#2E2E2E] font-medium mt-6">Loading amazing products...</p>
        <p className="text-gray-500 text-sm mt-2">This won't take long</p>
      </div>
    </div>
  );

  /**
   * Error state component with retry logic
   * Follows accessibility best practices
   */
  const ErrorState = () => (
    <div 
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="text-center max-w-md">
        <svg 
          className="w-16 h-16 text-red-400 mx-auto mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-red-600 mb-4 text-sm">{error}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRetry}
            className="bg-[#E43C3C] text-white px-6 py-3 rounded-lg hover:bg-red-600 
                     transition-all duration-200 shadow-md hover:shadow-lg 
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Retry loading products"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 
                     transition-all duration-200 focus:outline-none focus:ring-2 
                     focus:ring-gray-400 focus:ring-offset-2"
            aria-label="Refresh page"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );

  // ==========================================================================
  // EARLY RETURNS
  // ==========================================================================

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  return (
    <>
      {/* SEO: Structured Data (JSON-LD Schemas) */}
      <MultipleSchemas schemas={schemas} />

      <div className="min-h-screen bg-gray-50">
      {/* How To Section - Hero/Guide */}
      <HowToSection />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto  ">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          
          {/* Primary Content Column */}
          <div className="flex-1 space-y-8">
            
            {/* Flash Sales Section with Countdown */}
            <section aria-labelledby="flash-sales-heading">
              <FlashSalesSection
                apiEndpoint={CONFIG.API.FLASH_SALES}
                minDiscount={30}
                maxProducts={20}
                onProductsLoaded={(flashProducts) => {
                  console.log(`[FlashSales] Loaded ${flashProducts.length} products`);
                }}
                onError={(err) => {
                  console.error('[FlashSales] Error:', err);
                }}
                className="mb-8"
              />
            </section>

            {/* Categories Navigation */}
            <section aria-label="Product categories">
              <Categories />
            </section>

            {/* Main Products Grid */}
            <section aria-labelledby="products-heading" className="px-4">
              
              {/* Section Header */}
              <header className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-1 h-6 bg-red-500 rounded" 
                    aria-hidden="true"
                  />
                  <span className="text-red-500 font-semibold text-sm uppercase tracking-wide">
                    Products
                  </span>
                </div>
                <h2 
                  id="products-heading"
                  className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900"
                >
                  Browse Our Products
                </h2>
                
                {/* Results count */}
                {totalFilteredCount > 0 && (
                  <p className="text-gray-600 mt-2 text-sm">
                    Showing {displayProducts.length} of {totalFilteredCount} products
                  </p>
                )}
              </header>

              {/* Products Grid */}
              {displayProducts.length > 0 ? (
                <ProductsGridLayout
                  products={displayProducts}
                  loading={false}
                />
              ) : (
                // Empty state when filters return no results
                <div 
                  className="text-center py-12 px-4"
                  role="status"
                  aria-live="polite"
                >
                  <svg 
                    className="w-20 h-20 text-gray-300 mx-auto mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your filters to find what you're looking for
                  </p>
                </div>
              )}

              {/* View All / Show Less Toggle */}
              {shouldShowViewAllButton && displayProducts.length > 0 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={toggleViewAll}
                    className={`
                      px-8 py-3 rounded-lg font-medium 
                      transition-all duration-200 
                      shadow-md hover:shadow-lg 
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${showAllProducts
                        ? 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500'
                        : 'bg-[#E43C3C] text-white hover:bg-red-600 focus:ring-red-500'
                      }
                    `}
                    aria-expanded={showAllProducts ? 'true' : 'false'}
                    aria-label={showAllProducts ? 'Show less products' : 'View all products'}
                  >
                    {showAllProducts ? (
                      <>
                        <svg 
                          className="inline-block w-5 h-5 mr-2" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 15l7-7 7 7" 
                          />
                        </svg>
                        Show Less
                      </>
                    ) : (
                      <>
                        View All Products
                        <svg 
                          className="inline-block w-5 h-5 ml-2" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 9l-7 7-7-7" 
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </section>

            {/* Service Features Section */}
            <section aria-label="Service features">
              <ServiceFeatures />
            </section>

          </div>
          {/* End Primary Content Column */}

        </div>
      </main>

      {/* Accessibility: Skip to top link */}
      <a 
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                   bg-white px-4 py-2 rounded-lg shadow-lg z-50"
      >
        Skip to top
      </a>
      </div>
    </>
  );
}

