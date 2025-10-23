// Search Types
export interface SearchFilters {
  categories: { name: string; count: number }[];
  priceRange: { min: number; max: number };
  conditions: { name: string; count: number }[];
}

// Product interface compatible with ProductCard component
export interface Product {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string[] | string; // Compatible with ProductCard
  category?: string;
  originalPrice?: number; // Optional for ProductCard
  discountedPrice?: number; // Optional for ProductCard
  discount?: number;
  savings?: number;
  condition?: string;
  tags?: string[];
  views?: number;
  stock?: number;
  isSold?: boolean;
  averageRating?: number; // Optional for ProductCard
  totalReviews?: number; // Optional for ProductCard
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    profilePic?: string;
    rating?: number;
    totalRatings?: number;
    premiumTier?: string;
  };
  images?: {
    id: number;
    url: string;
  }[];
  _count?: {
    reviews?: number; // Compatible with ProductCard
  };
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  filters: SearchFilters;
}

export interface SearchParams {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  tags?: string;
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface AutocompleteResult {
  suggestions: string[];
}
