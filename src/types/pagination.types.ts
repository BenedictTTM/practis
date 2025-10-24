/**
 * Pagination Types for Sellr Products API
 * 
 * Use these types in your frontend application for type safety
 * when working with paginated product endpoints.
 */

// ============================================
// Pagination Metadata
// ============================================

export interface PaginationMeta {
  /** Current page number (1-indexed) */
  page: number;
  
  /** Number of items per page */
  limit: number;
  
  /** Total number of items across all pages */
  totalCount: number;
  
  /** Total number of pages */
  totalPages: number;
  
  /** Whether there is a next page available */
  hasNextPage: boolean;
  
  /** Whether there is a previous page available */
  hasPreviousPage: boolean;
}

// ============================================
// Generic Paginated Response
// ============================================

export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  data: T[];
  
  /** Pagination metadata */
  pagination: PaginationMeta;
}

// ============================================
// Product Types
// ============================================

export interface ProductUser {
  id: number;
  firstName: string;
  lastName: string;
  profilePic: string | null;
  rating: number;
  totalRatings: number;
  premiumTier: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
}

export interface ProductImage {
  id: number;
  url: string;
}

export interface ProductDelivery {
  id: number;
  method: string;
  location: string | null;
  fee: number;
}

export interface ProductReviewer {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  profilePic?: string | null;
}

export interface ProductReview {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: ProductReviewer;
}

export interface Product {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string[];
  category: string;
  originalPrice: number;
  discountedPrice: number;
  stock: number;
  condition: string;
  tags: string[];
  views: number;
  locationLat: number | null;
  locationLng: number | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isSold: boolean;
  user: ProductUser;
  images: ProductImage[];
  delivery: ProductDelivery[];
  reviews: ProductReview[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

// ============================================
// API Response Types
// ============================================

/** Response from GET /products */
export type ProductsResponse = PaginatedResponse<Product>;

/** Response from GET /products/category/:category */
export type CategoryProductsResponse = PaginatedResponse<Product>;

/** Response from GET /products/user/:userId */
export type UserProductsResponse = PaginatedResponse<Product>;

/** Response from GET /products/user/me */
export type MyProductsResponse = PaginatedResponse<Product>;

// ============================================
// Request Parameters
// ============================================

export interface PaginationParams {
  /** Page number (default: 1, min: 1) */
  page?: number;
  
  /** Items per page (default: 20, min: 1, max: 100) */
  limit?: number;
}

export interface GetAllProductsParams extends PaginationParams {}

export interface GetCategoryProductsParams extends PaginationParams {
  category: string;
}

export interface GetUserProductsParams extends PaginationParams {
  userId: number;
}

export interface GetMyProductsParams extends PaginationParams {
  // Requires authentication via cookies
}

// ============================================
// Utility Types
// ============================================

/** Extracted data array from paginated response */
export type PaginatedData<T> = T extends PaginatedResponse<infer U> ? U[] : never;

/** Navigation helpers */
export interface PaginationNavigation {
  /** Go to first page */
  goToFirst: () => void;
  
  /** Go to previous page */
  goToPrevious: () => void;
  
  /** Go to next page */
  goToNext: () => void;
  
  /** Go to last page */
  goToLast: () => void;
  
  /** Go to specific page */
  goToPage: (page: number) => void;
  
  /** Check if on first page */
  isFirstPage: boolean;
  
  /** Check if on last page */
  isLastPage: boolean;
}

// ============================================
// Hook Return Types
// ============================================

export interface UsePaginatedProductsReturn {
  /** Product data for current page */
  products: Product[];
  
  /** Pagination metadata */
  pagination: PaginationMeta | undefined;
  
  /** Loading state */
  isLoading: boolean;
  
  /** Error state */
  error: Error | undefined;
  
  /** Refresh current page */
  refresh: () => void;
  
  /** Navigation helpers */
  navigation: PaginationNavigation;
}

// ============================================
// API Client Types
// ============================================

export interface ProductsApiClient {
  /** Get all products with pagination */
  getAll: (params?: GetAllProductsParams) => Promise<ProductsResponse>;
  
  /** Get products by category with pagination */
  getByCategory: (params: GetCategoryProductsParams) => Promise<CategoryProductsResponse>;
  
  /** Get products by user ID with pagination */
  getByUserId: (params: GetUserProductsParams) => Promise<UserProductsResponse>;
  
  /** Get authenticated user's products with pagination */
  getMyProducts: (params?: GetMyProductsParams) => Promise<MyProductsResponse>;
}

// ============================================
// Example Usage (for reference)
// ============================================

/*
// 1. Basic usage
const response: ProductsResponse = await fetch('/api/products?page=1&limit=20').then(r => r.json());
const products: Product[] = response.data;
const pagination: PaginationMeta = response.pagination;

// 2. With React hook
const { products, pagination, isLoading } = useProducts(1, 20);

// 3. Type-safe API client
const api: ProductsApiClient = {
  getAll: (params) => fetch(`/api/products?page=${params?.page || 1}&limit=${params?.limit || 20}`).then(r => r.json()),
  // ... other methods
};

// 4. Navigation
const navigation: PaginationNavigation = {
  goToFirst: () => setPage(1),
  goToPrevious: () => setPage(p => Math.max(1, p - 1)),
  goToNext: () => setPage(p => p + 1),
  goToLast: () => setPage(pagination.totalPages),
  goToPage: (page) => setPage(page),
  isFirstPage: page === 1,
  isLastPage: page === pagination.totalPages,
};
*/
