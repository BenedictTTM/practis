'use client';

import React from 'react';
import ProductCard from '../cards/ProductCard';
import { Product } from '@/types/products';

/**
 * Props for ProductsGridLayout component
 */
export interface ProductsGridLayoutProps {
  /** Array of products to display in grid */
  products: Product[];
  /** Optional CSS class for additional styling */
  className?: string;
  /** Show loading state */
  loading?: boolean;
  /** Number of columns on different breakpoints */
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
}

/**
 * ProductsGridLayout - Renders products in a responsive grid that fills the page width
 * 
 * Features:
 * - Fully responsive grid (1-4+ columns based on screen size)
 * - Extends horizontally to fill available width
 * - No horizontal scrolling - wraps to new rows
 * - Configurable column count per breakpoint
 * - Loading state support
 * - Empty state handling
 * 
 * @param props - ProductsGridLayoutProps
 * @returns JSX.Element representing the products grid layout
 */
export default function ProductsGridLayout({ 
  products, 
  className = '',
  loading = false,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4
  }
}: ProductsGridLayoutProps) {
  
  // Loading state
  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse" role="listitem">
              <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center">
            <svg 
              className="mx-auto h-24 w-24 text-gray-300 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500">
              There are no products to display at the moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Build grid column classes based on configuration
  const gridColsClass = `
    grid-cols-${columns.mobile || 1}
    sm:grid-cols-${columns.tablet || 2}
    lg:grid-cols-${columns.desktop || 3}
    xl:grid-cols-${columns.wide || 4}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`w-full ${className}`}>
      {/* Responsive Grid - Extends to fill page width */}
      <div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4"
        role="list"
        aria-label="Products grid"
      >
        {products.map((product) => (
          <div 
            key={product.id} 
            role="listitem"
            className="w-full"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Product count indicator */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-700">{products.length}</span> product{products.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}

/**
 * Alternative compact grid layout with smaller cards
 */
export function CompactProductsGrid({ 
  products, 
  className = '',
  loading = false 
}: Omit<ProductsGridLayoutProps, 'columns'>) {
  return (
    <ProductsGridLayout
      products={products}
      className={className}
      loading={loading}
      columns={{
        mobile: 2,
        tablet: 3,
        desktop: 4,
        wide: 6
      }}
    />
  );
}

/**
 * Wide grid layout for large displays
 */
export function WideProductsGrid({ 
  products, 
  className = '',
  loading = false 
}: Omit<ProductsGridLayoutProps, 'columns'>) {
  return (
    <ProductsGridLayout
      products={products}
      className={className}
      loading={loading}
      columns={{
        mobile: 1,
        tablet: 2,
        desktop: 4,
        wide: 5
      }}
    />
  );
}
