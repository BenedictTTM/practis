/**
 * Discount Calculator Utility
 * 
 * Pure functions for calculating and validating product discounts.
 * Following functional programming principles for testability and reliability.
 * 
 * @module discountCalculator
 */

/**
 * Calculates the discount percentage between original and discounted price
 * 
 * @param originalPrice - The original price before discount
 * @param discountedPrice - The current discounted price
 * @returns The discount percentage (0-100), or 0 if invalid inputs
 * 
 * @example
 * calculateDiscountPercentage(100, 80) // returns 20
 * calculateDiscountPercentage(50, 40) // returns 20
 * calculateDiscountPercentage(100, null) // returns 0 (no discount)
 */
export function calculateDiscountPercentage(
  originalPrice?: number | null,
  discountedPrice?: number | null
): number {
  // Guard clauses for invalid inputs
  if (!isValidPrice(originalPrice) || !isValidPrice(discountedPrice)) {
    return 0;
  }

  // No discount if discounted price >= original price
  if (discountedPrice! >= originalPrice!) {
    return 0;
  }

  // Calculate percentage: ((original - discounted) / original) * 100
  const discount = ((originalPrice! - discountedPrice!) / originalPrice!) * 100;

  // Round to nearest integer and ensure it's within valid range
  return Math.max(0, Math.min(100, Math.round(discount)));
}

/**
 * Validates if a price value is valid for calculations
 * 
 * @param price - The price to validate
 * @returns true if price is a valid positive number
 */
export function isValidPrice(price?: number | null): price is number {
  return typeof price === 'number' && 
         !isNaN(price) && 
         isFinite(price) && 
         price > 0;
}

/**
 * Checks if a product has a discount meeting the minimum threshold
 * 
 * @param originalPrice - The original price
 * @param discountedPrice - The discounted price
 * @param minDiscount - Minimum discount percentage required (default: 20)
 * @returns true if discount meets or exceeds threshold
 * 
 * @example
 * hasMinimumDiscount(100, 75, 20) // returns true (25% discount)
 * hasMinimumDiscount(100, 85, 20) // returns false (15% discount)
 */
export function hasMinimumDiscount(
  originalPrice?: number | null,
  discountedPrice?: number | null,
  minDiscount: number = 20
): boolean {
  const discount = calculateDiscountPercentage(originalPrice, discountedPrice);
  return discount >= minDiscount;
}

/**
 * Type guard to check if product has valid pricing for discount calculation
 */
export function hasValidPricing(product: {
  originalPrice?: number | null;
  discountedPrice?: number | null;
}): boolean {
  return isValidPrice(product.originalPrice) && 
         isValidPrice(product.discountedPrice);
}

/**
 * Formats a discount percentage for display
 * 
 * @param discount - The discount percentage
 * @returns Formatted string (e.g., "-25%")
 */
export function formatDiscountLabel(discount: number): string {
  return `-${discount}%`;
}
