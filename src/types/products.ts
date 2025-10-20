export type User = {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  storeName?: string;
  profilePic?: string | null;
  rating?: number;
  totalRatings?: number;
  premiumTier?: string;
  phone?: string | null;
};

export type Product = {
  id: number;
  title: string;
  description?: string;
  images?: string[];
  imageUrl?: string[];
  category?: string;
  originalPrice?: number;
  discountedPrice?: number;
  stock?: number;
  condition?: string;
  tags?: string[];
  views?: number;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  isSold?: boolean;
  user?: User;
  reviews?: Record<string, any>[];
  averageRating?: number;
  totalReviews?: number;
  ratingDistribution?: Record<string, number>;
  delivery?: Record<string, any> | null;
  _count?: { reviews?: number };
};