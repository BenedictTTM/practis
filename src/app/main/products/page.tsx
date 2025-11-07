/**
 * Products page component
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { Product } from '../../../types/products';
import type { ProductsGridLayoutProps } from '../../../Components/Products/layouts/ProductsGridLayout';
import type { FlashSalesSectionProps } from '../../../Components/Products/layouts/FlashSale/FlashSalesSection';
import { MultipleSchemas } from '../../../Components/Schema';
import {
  generateProductListSchema,
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateFlashSalesSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from '../../../lib/schemas/productSchemas';
import '../../../Components/Products/styles/products.css';

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

const CONFIG = {
  INITIAL_PRODUCTS_DISPLAY: 12,
  API: {
    PRODUCTS: '/api/products',
    FLASH_SALES: '/api/products/flash-sales',
  },
  RETRY_DELAY: 3000,
} as const;

const SectionSkeleton = () => (
  <div className="w-full px-4 max-w-7xl mx-auto" aria-hidden="true">
    <div className="h-32 sm:h-36 md:h-44 rounded-2xl bg-gray-100 animate-pulse" />
  </div>
);

const FlashSalesSkeleton = () => (
  <section className="flash-sales-section" aria-hidden="true">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-12 w-52 bg-gray-200 rounded-lg animate-pulse mb-6" />
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`flash-skeleton-${index}`}
            className="flex-none w-[160px] sm:w-[180px] md:w-[200px]"
          >
            <div className="bg-gray-200 aspect-square rounded-lg mb-3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProductsGridSkeleton = () => (
  <div className="w-full" aria-hidden="true">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={`grid-skeleton-${index}`} className="animate-pulse">
          <div className="bg-gray-200 aspect-square rounded-lg mb-3" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

const HowToSection = dynamic(() => import('../../../Components/HowTo').then(mod => mod.HowToSection), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const Categories = dynamic(() => import('../../../Components/Products/layouts/Categories'), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const ServiceFeatures = dynamic(() => import('../../../Components/Products/layouts/serviceFeatures'), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const FlashSalesSection = dynamic<FlashSalesSectionProps>(
  () => import('../../../Components/Products/layouts').then(mod => mod.FlashSalesSection),
  {
    ssr: false,
    loading: () => <FlashSalesSkeleton />,
  }
);

const ProductsGridLayout = dynamic<ProductsGridLayoutProps>(
  () => import('../../../Components/Products/layouts').then(mod => mod.ProductsGridLayout),
  {
    loading: () => <ProductsGridSkeleton />,
  }
);

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

export default function ProductsPage() {
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

  useEffect(() => {
    fetchProducts().catch(console.error);
    fetchFlashSales().catch(console.error);
  }, [fetchProducts, fetchFlashSales]);

  const handleFiltersChange = useCallback((filters: FilterState) => {
    setActiveFilters(filters);
    // Reset pagination when filters change
    setShowAllProducts(false);
  }, []);

  const toggleViewAll = useCallback(() => {
    setShowAllProducts(prev => !prev);
  }, []);

  const handleRetry = useCallback(() => {
    fetchProducts().catch(console.error);
  }, [fetchProducts]);

  const displayProducts = useMemo(() => {
    const filtered = applyProductFilters(products, activeFilters);
    return showAllProducts ? filtered : filtered.slice(0, CONFIG.INITIAL_PRODUCTS_DISPLAY);
  }, [products, activeFilters, showAllProducts]);

  const totalFilteredCount = useMemo(() => {
    return applyProductFilters(products, activeFilters).length;
  }, [products, activeFilters]);

  const shouldShowViewAllButton = totalFilteredCount > CONFIG.INITIAL_PRODUCTS_DISPLAY;

  const schemas = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sellr.com';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : `${baseUrl}/main/products`;

    // Critical schemas that must load immediately (no images)
    const criticalSchemas = [
      // Organization Schema (critical for entity recognition)
      generateOrganizationSchema(
        'Sellr',
        baseUrl,
        `${baseUrl}/logo.png`
      ),

      // Website Schema with SearchAction (critical for search)
      generateWebsiteSchema('Sellr', baseUrl, '/search?q={search_term_string}'),

      // WebPage Schema (critical for page identity)
      generateWebPageSchema(
        'Browse Products - Sellr',
        'Discover amazing products with great deals and flash sales. Shop electronics, fashion, home goods, and more.',
        currentUrl
      ),

      // Breadcrumb Schema (high priority for navigation)
      generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/main/products' },
      ], baseUrl),
    ];

    // Deferred schemas (image-heavy, will lazy load)
    const deferredSchemas = [
      // Product List Schema (contains images - deferred)
      ...(displayProducts.length > 0 ? [generateProductListSchema(displayProducts, baseUrl, 'GHS')] : []),

      // Flash Sales Schema (contains images - deferred)
      ...(flashSalesData?.products && flashSalesData.products.length > 0
        ? [generateFlashSalesSchema(flashSalesData.products, flashSalesData.nextRefreshAt)]
        : []
      ),
    ];

    // Combine all schemas (MultipleSchemas will handle prioritization)
    return [...criticalSchemas, ...deferredSchemas];
  }, [displayProducts, flashSalesData]);



  

  if (error) return <><div>Error loading products please refresh...</div></>;

  return (
    <>
      {/* 
        Progressive Schema Loading:
        - Critical schemas (Organization, Website, WebPage) load immediately
        - Image-heavy schemas (ProductList, FlashSales) are deferred
        - Improves First Contentful Paint and Largest Contentful Paint
      */}
      <MultipleSchemas schemas={schemas} deferImageSchemas={true} />

      <div className="min-h-screen bg-gray-50">
      <HowToSection />

      <main className="max-w-7xl mx-auto  ">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          
          <div className="flex-1 space-y-8">
            
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

            <section aria-label="Product categories">
              <Categories />
            </section>

            <section aria-labelledby="products-heading" className="px-4">
              
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
                
                {!loading && totalFilteredCount > 0 && (
                  <p className="text-gray-600 mt-2 text-sm">
                    Showing {displayProducts.length} of {totalFilteredCount} products
                  </p>
                )}
              </header>

              {loading ? (
                <ProductsGridLayout products={[]} loading />
              ) : displayProducts.length > 0 ? (
                <ProductsGridLayout products={displayProducts} loading={false} />
              ) : (
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

              {shouldShowViewAllButton && displayProducts.length > 0 && (
                <div className="flex justify-center mt-8">
                  {/* eslint-disable-next-line jsx-a11y/aria-proptypes */}
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

            <section aria-label="Service features">
              <ServiceFeatures />
            </section>

          </div>

        </div>
      </main>

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

