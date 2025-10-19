/**
 * User Service
 * Handles all user-related API calls
 * Senior-level implementation with proper error handling and type safety
 */

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  storeName?: string;
  profilePic?: string;
  phone?: string;
  role: string;
  premiumTier: string;
  availableSlots: number;
  usedSlots: number;
  rating: number;
  totalRatings: number;
  createdAt: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  storeName?: string;
}

export interface UpdateUserDto {
  phone?: string;
  username?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  user?: T;
  data?: T;
  error?: string;
}

class UserService {
  private baseUrl = '/api/user';

  /**
   * Fetches user by ID
   */
  async getUserById(userId: number): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  }

  /**
   * Fetches detailed user profile
   */
  async getUserProfile(userId: number): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch user profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw error;
    }
  }

  /**
   * Updates user general information (phone, username)
   */
  async updateUser(
    userId: number,
    data: UpdateUserDto
  ): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }

  /**
   * Updates user profile (firstName, lastName, storeName)
   */
  async updateProfile(
    userId: number,
    data: UpdateProfileDto
  ): Promise<ApiResponse<UserProfile>> {
    try {
      // Client-side validation
      if (data.firstName && (data.firstName.length < 2 || data.firstName.length > 50)) {
        throw new Error('First name must be between 2 and 50 characters');
      }
      if (data.lastName && (data.lastName.length < 2 || data.lastName.length > 50)) {
        throw new Error('Last name must be between 2 and 50 characters');
      }
      if (data.storeName && (data.storeName.length < 2 || data.storeName.length > 100)) {
        throw new Error('Store name must be between 2 and 100 characters');
      }

      const response = await fetch(`${this.baseUrl}/${userId}/profile`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }

  /**
   * Updates profile picture URL
   */
  async updateProfilePictureUrl(
    userId: number,
    imageUrl: string
  ): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}/profile-picture`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile picture');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in updateProfilePictureUrl:', error);
      throw error;
    }
  }

  /**
   * Uploads profile picture file
   */
  async uploadProfilePicture(
    userId: number,
    file: File
  ): Promise<ApiResponse<UserProfile & { imageUrl: string }>> {
    try {
      // Client-side validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, and WebP images are allowed');
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${this.baseUrl}/${userId}/upload-profile-picture`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload profile picture');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in uploadProfilePicture:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
