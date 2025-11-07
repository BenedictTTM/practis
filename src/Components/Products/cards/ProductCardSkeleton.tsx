/**
 * ProductCardSkeleton Component
 * 
 * Enterprise-grade skeleton loader for product cards
 * Implements progressive content loading with immediate text render
 * 
 * Architecture Principles:
 * - Single Responsibility: Only handles skeleton UI state
 * - Open/Closed: Extensible via props, closed for modification
 * - Liskov Substitution: Can replace ProductCard during loading
 * - Interface Segregation: Minimal, focused interface
 * - Dependency Inversion: Depends on abstractions (variant types)
 * 
 * Performance Optimizations:
 * - CSS-only animations (no JS)
 * - Reduced DOM complexity
 * - Optimized for high-traffic scenarios
 * - Minimal repaints/reflows
 * 
 * @author Senior Frontend Architect
 * @version 2.0.0
 */

'use client';

import React, { memo } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Skeleton variant types for different use cases
 */
export type SkeletonVariant = 'default' | 'compact' | 'wide' | 'minimal';

/**
 * Props interface following Interface Segregation Principle
 */
export interface ProductCardSkeletonProps {
  /** Variant style for different layouts */
  variant?: SkeletonVariant;
  /** Custom CSS classes for extensibility */
  className?: string;
  /** Accessibility label */
  ariaLabel?: string;
  /** Show price section skeleton */
  showPrice?: boolean;
  /** Show rating section skeleton */
  showRating?: boolean;
  /** Show action button skeleton */
  showAction?: boolean;
}

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

/**
 * Immutable configuration following Open/Closed Principle
 */
const SKELETON_CONFIG = Object.freeze({
  animation: {
    duration: '1.5s',
    timingFunction: 'ease-in-out',
    iterationCount: 'infinite',
  },
  colors: {
    base: 'bg-gray-200',
    shimmer: 'bg-gray-300',
  },
  heights: {
    image: 'aspect-[1/1]',
    title: 'h-4',
    price: 'h-4',
    rating: 'h-3',
    button: 'h-8',
  },
} as const);

// ============================================================================
// SKELETON COMPONENTS (Composition over Inheritance)
// ============================================================================

/**
 * Base skeleton element with shimmer animation
 * Follows Single Responsibility Principle
 */
const SkeletonElement = memo<{
  className?: string;
}>(({ className = '' }) => (
  <div
    className={`${SKELETON_CONFIG.colors.base} rounded animate-pulse ${className}`}
    aria-hidden="true"
    role="presentation"
  />
));
SkeletonElement.displayName = 'SkeletonElement';

/**
 * Image skeleton placeholder
 * Optimized for aspect ratio preservation
 */
const ImageSkeleton = memo<{ variant?: SkeletonVariant }>(({ variant = 'default' }) => {
  const heightClass = variant === 'compact' 
    ? 'max-h-[180px]' 
    : variant === 'wide'
    ? 'max-h-[240px]'
    : 'max-h-[200px]';

  return (
    <div className={`relative ${SKELETON_CONFIG.heights.image} overflow-hidden bg-neutral-50 ${heightClass}`}>
      <SkeletonElement className="absolute inset-0" />
    </div>
  );
});
ImageSkeleton.displayName = 'ImageSkeleton';

/**
 * Text content skeleton
 * Reusable for different text sections
 */
const TextSkeleton = memo<{
  width?: string;
  height?: string;
  className?: string;
}>(({ width = 'w-3/4', height = 'h-4', className = '' }) => (
  <SkeletonElement className={`${width} ${height} ${className}`} />
));
TextSkeleton.displayName = 'TextSkeleton';

/**
 * Price section skeleton
 */
const PriceSkeleton = memo(() => (
  <div className="flex items-center gap-1">
    <TextSkeleton width="w-20" height="h-4" />
    <TextSkeleton width="w-16" height="h-3" />
  </div>
));
PriceSkeleton.displayName = 'PriceSkeleton';

/**
 * Rating section skeleton
 */
const RatingSkeleton = memo(() => (
  <div className="flex items-center gap-1">
    <TextSkeleton width="w-16" height="h-3" />
  </div>
));
RatingSkeleton.displayName = 'RatingSkeleton';

/**
 * Action button skeleton
 */
const ActionSkeleton = memo(() => (
  <SkeletonElement className={`w-full ${SKELETON_CONFIG.heights.button} rounded-md`} />
));
ActionSkeleton.displayName = 'ActionSkeleton';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ProductCardSkeleton - Main skeleton component
 * 
 * Design Pattern: Composite Pattern for skeleton composition
 * Performance: Memoized to prevent unnecessary re-renders
 * Accessibility: ARIA attributes for screen readers
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ProductCardSkeleton />
 * 
 * // Custom variant
 * <ProductCardSkeleton variant="compact" />
 * 
 * // Selective sections
 * <ProductCardSkeleton showPrice={false} />
 * ```
 */
export const ProductCardSkeleton = memo<ProductCardSkeletonProps>(({
  variant = 'default',
  className = '',
  ariaLabel = 'Loading product...',
  showPrice = true,
  showRating = true,
  showAction = true,
}) => {
  return (
    <div
      className={`
        group flex flex-col bg-white rounded-xl overflow-hidden 
        shadow-xs border border-neutral-200 w-full h-full
        ${className}
      `}
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
    >
      {/* Image Skeleton */}
      <ImageSkeleton variant={variant} />

      {/* Content Skeleton */}
      <div className="flex flex-col justify-between flex-1 p-2.5 sm:p-3">
        {/* Title Skeleton */}
        <div className="mb-2 space-y-1">
          <TextSkeleton width="w-full" height="h-3" />
          <TextSkeleton width="w-4/5" height="h-3" />
        </div>

        {/* Price & Rating Section */}
        <div className="flex flex-col gap-1 mb-2">
          {showPrice && <PriceSkeleton />}
          {showRating && <RatingSkeleton />}
        </div>

        {/* Action Button Skeleton */}
        {showAction && (
          <div className="mt-auto pt-1">
            <ActionSkeleton />
          </div>
        )}
      </div>

      {/* Screen Reader Only Text */}
      <span className="sr-only">Loading product information</span>
    </div>
  );
});

ProductCardSkeleton.displayName = 'ProductCardSkeleton';

// ============================================================================
// GRID SKELETON COMPONENT
// ============================================================================

/**
 * ProductsGridSkeleton - Renders multiple skeleton cards in a grid
 * 
 * Optimized for initial page load performance
 * Follows DRY principle with configurable count
 * 
 * @example
 * ```tsx
 * <ProductsGridSkeleton count={12} variant="compact" />
 * ```
 */
export const ProductsGridSkeleton = memo<{
  count?: number;
  variant?: SkeletonVariant;
  className?: string;
}>(({ count = 12, variant = 'default', className = '' }) => {
  // Generate stable array for skeleton items
  const skeletonItems = React.useMemo(
    () => Array.from({ length: count }, (_, i) => i),
    [count]
  );

  return (
    <div
      className={`
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-5 
        xl:grid-cols-6 
        2xl:grid-cols-7 
        gap-2 sm:gap-3 md:gap-4
        ${className}
      `}
      role="status"
      aria-label="Loading products"
      aria-busy="true"
    >
      {skeletonItems.map((index) => (
        <ProductCardSkeleton
          key={`skeleton-${index}`}
          variant={variant}
          ariaLabel={`Loading product ${index + 1}`}
        />
      ))}
    </div>
  );
});

ProductsGridSkeleton.displayName = 'ProductsGridSkeleton';

// ============================================================================
// EXPORTS
// ============================================================================

export default ProductCardSkeleton;
