/**
 * User profile data interface
 */
export interface UserProfile {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  storeName?: string;
  profilePic?: string;
  role: string;
  rating?: number;
  totalRatings?: number;
  premiumTier?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Update profile data interface
 */
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  storeName?: string;
}

/**
 * API response interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
