/**
 * Category System TypeScript Definitions
 * 
 * Enterprise-grade type definitions for the category system
 * Ensures type safety across the frontend application
 * 
 * Following principles:
 * - Type Safety: Strict typing for all category operations
 * - DRY: Single source of truth for types
 * - Documentation: JSDoc comments for IntelliSense
 */

/**
 * Product Category Enumeration
 * Matches backend ProductCategory enum
 */
export enum ProductCategory {
  CLOTHES = 'clothes',
  ACCESSORIES = 'accessories',
  HOME = 'home',
  BOOKS = 'books',
  SPORTS_AND_OUTING = 'sports_and_outing',
  OTHERS = 'others',
}

/**
 * Category Metadata
 * Display information for each category
 */
export interface CategoryMetadata {
  category: ProductCategory;
  label: string;
  description: string;
  icon?: string;
  productCount: number;
}

/**
 * Category Products Request Parameters
 */
export interface CategoryProductsParams {
  category: ProductCategory;
  page?: number;
  limit?: number;
  sortBy?: CategorySortOption;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

/**
 * Sort Options for Category Products
 */
export type CategorySortOption = 
  | 'newest'
  | 'oldest'
  | 'price-asc'
  | 'price-desc'
  | 'popular'
  | 'rating';

/**
 * Pagination Metadata
 */
export interface PaginationMetadata {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Category Information
 */
export interface CategoryInfo {
  key: string;
  label: string;
  description: string;
}

/**
 * Product in Category List
 */
export interface CategoryProduct {
  id: number;
  title: string;
  description?: string;
  imageUrl: string[];
  category: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage?: number;
  stock: number;
  condition: string;
  tags: string[];
  views: number;
  averageRating: number;
  totalReviews: number;
  inStock: boolean;
  isSold: boolean;
  createdAt: string;
  updatedAt: string;
  seller: {
    id: number;
    username: string;
    fullName: string;
    profilePic?: string;
    rating: number;
    premiumTier: string;
  };
  images: Array<{
    id: number;
    url: string;
  }>;
  delivery?: {
    method: string;
    fee: number;
  };
}

/**
 * Category Products Response
 */
export interface CategoryProductsResponse {
  success: boolean;
  data: CategoryProduct[];
  pagination: PaginationMetadata;
  category: CategoryInfo;
  filters?: Record<string, any>;
  cached?: boolean;
  timestamp?: string;
}

/**
 * Category Statistics Response
 */
export interface CategoryStatsResponse {
  success: boolean;
  data: {
    category: ProductCategory;
    totalProducts: number;
    activeProducts: number;
    averagePrice: number;
    priceRange: {
      min: number;
      max: number;
    };
    popularTags: string[];
  };
  cached?: boolean;
  timestamp?: string;
}

/**
 * Featured Products Response
 */
export interface FeaturedProductsResponse {
  success: boolean;
  data: CategoryProduct[];
  category: CategoryInfo;
  total: number;
  cached?: boolean;
  timestamp?: string;
}

/**
 * Categories List Response
 */
export interface CategoriesListResponse {
  success: boolean;
  data: CategoryMetadata[];
  cached?: boolean;
  timestamp?: string;
}

/**
 * API Error Response
 */
export interface CategoryAPIError {
  success: false;
  message: string;
  error?: string;
}

/**
 * Type guard to check if category is valid
 */
export function isValidCategory(value: string): value is ProductCategory {
  return Object.values(ProductCategory).includes(value as ProductCategory);
}

/**
 * Get category display label
 */
export function getCategoryLabel(category: ProductCategory): string {
  const labels: Record<ProductCategory, string> = {
    [ProductCategory.CLOTHES]: 'Clothes & Fashion',
    [ProductCategory.ACCESSORIES]: 'Accessories',
    [ProductCategory.HOME]: 'Home & Living',
    [ProductCategory.BOOKS]: 'Books & Media',
    [ProductCategory.SPORTS_AND_OUTING]: 'Sports & Outdoors',
    [ProductCategory.OTHERS]: 'Other Items',
  };
  return labels[category];
}

/**
 * Get all valid categories
 */
export function getAllCategories(): ProductCategory[] {
  return Object.values(ProductCategory);
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'GHS'): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(original: number, discounted: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
}
