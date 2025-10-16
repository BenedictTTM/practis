/**
 * Product Filtering Utilities
 * 
 * Pure functions for filtering and sorting product collections.
 * Follows immutability principles and single responsibility.
 * 
 * @module productFilters
 */

import { Product } from '@/types/products';
import { hasMinimumDiscount } from './discountCalculator';

/**
 * Configuration for flash sales filtering
 */
export interface FlashSalesConfig {
  /** Minimum discount percentage to qualify (default: 20) */
  minDiscountPercentage: number;
  /** Maximum number of products to return (default: 8) */
  maxProducts: number;
  /** Sort order for products */
  sortBy: 'date' | 'discount' | 'price' | 'none';
}

/**
 * Default configuration for flash sales
 */
export const DEFAULT_FLASH_SALES_CONFIG: FlashSalesConfig = {
  minDiscountPercentage: 20,
  maxProducts: 8,
  sortBy: 'none', // Preserves original order (first 8 by date/ID)
};

/**
 * Filters products that qualify for flash sales
 * 
 * A product qualifies if:
 * - Has valid original and discounted prices
 * - Discount percentage meets or exceeds minimum threshold
 * - Is active and in stock (if applicable)
 * 
 * @param products - Array of products to filter
 * @param config - Configuration for filtering (optional)
 * @returns Filtered and limited array of flash sale products
 * 
 * @example
 * const flashSales = getFlashSalesProducts(allProducts, {
 *   minDiscountPercentage: 25,
 *   maxProducts: 5,
 *   sortBy: 'discount'
 * });
 */
export function getFlashSalesProducts(
  products: Product[],
  config: Partial<FlashSalesConfig> = {}
): Product[] {
  // Merge with defaults
  const finalConfig: FlashSalesConfig = {
    ...DEFAULT_FLASH_SALES_CONFIG,
    ...config,
  };

  // Input validation
  if (!Array.isArray(products)) {
    console.error('[FlashSales] Invalid products array provided');
    return [];
  }

  // Filter pipeline: pure, composable, testable
  let filtered = products
    .filter(isActiveProduct)
    .filter(product => 
      hasMinimumDiscount(
        product.originalPrice,
        product.discountedPrice,
        finalConfig.minDiscountPercentage
      )
    );

  // Apply sorting if specified
  filtered = applySorting(filtered, finalConfig.sortBy);

  // Limit to max products (slice creates new array, maintains immutability)
  return filtered.slice(0, finalConfig.maxProducts);
}

/**
 * Type guard to check if product is active and available
 * Defensive programming - handles missing properties gracefully
 */
function isActiveProduct(product: Product): boolean {
  // If product doesn't have these fields, assume it's active
  // This makes the function resilient to schema changes
  const isActive = product.isActive !== false;
  const hasStock = product.stock === undefined || product.stock > 0;
  
  return isActive && hasStock;
}

/**
 * Applies sorting to products based on specified criteria
 * Pure function - does not mutate input array
 */
function applySorting(
  products: Product[],
  sortBy: FlashSalesConfig['sortBy']
): Product[] {
  // Create shallow copy to avoid mutating original
  const sorted = [...products];

  switch (sortBy) {
    case 'discount':
      return sorted.sort((a, b) => {
        const discountA = calculateDiscount(a);
        const discountB = calculateDiscount(b);
        return discountB - discountA; // Descending order (highest discount first)
      });

    case 'price':
      return sorted.sort((a, b) => {
        const priceA = a.discountedPrice || a.originalPrice || 0;
        const priceB = b.discountedPrice || b.originalPrice || 0;
        return priceA - priceB; // Ascending order (lowest price first)
      });

    case 'date':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Descending order (newest first)
      });

    case 'none':
    default:
      return sorted; // Preserve original order
  }
}

/**
 * Helper to calculate discount for a single product
 */
function calculateDiscount(product: Product): number {
  if (!product.originalPrice || !product.discountedPrice) return 0;
  return ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100;
}

/**
 * Validates if products array contains any flash sale eligible items
 * Useful for conditional rendering
 */
export function hasFlashSalesProducts(
  products: Product[],
  minDiscount: number = 20
): boolean {
  return getFlashSalesProducts(products, { 
    minDiscountPercentage: minDiscount,
    maxProducts: 1 
  }).length > 0;
}
