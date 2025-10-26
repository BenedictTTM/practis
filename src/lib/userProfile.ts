// Frontend API service for user profile management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: number): Promise<ApiResponse<UserProfile>> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch user profile',
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Get user profile error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}

/**
 * Update user profile (firstName, lastName, storeName)
 */
export async function updateUserProfile(
  userId: number,
  profileData: UpdateProfileData
): Promise<ApiResponse<UserProfile>> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to update profile',
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}

/**
 * Upload profile picture (multipart form-data)
 */
export async function uploadProfilePicture(
  userId: number,
  file: File
): Promise<ApiResponse<{ user: { id: number; profilePic: string }; imageUrl: string }>> {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Only JPEG, PNG, and WebP images are allowed',
      };
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 5MB',
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/users/${userId}/upload-profile-picture`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      // Don't set Content-Type header - browser will set it automatically with boundary
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to upload profile picture',
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: 'Profile picture uploaded successfully',
    };
  } catch (error) {
    console.error('Upload profile picture error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}

/**
 * Update profile picture with URL (if image already uploaded elsewhere)
 */
export async function updateProfilePictureUrl(
  userId: number,
  imageUrl: string
): Promise<ApiResponse<{ id: number; profilePic: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile-picture`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to update profile picture',
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: 'Profile picture updated successfully',
    };
  } catch (error) {
    console.error('Update profile picture URL error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}

// ---------- React Query hooks (typed, small surface) ----------

/**
 * Hook: fetch user profile
 * Returns: useQuery result where data is UserProfile | undefined
 */
export const useUserProfile = (userId?: number) => {
  return useQuery<UserProfile | undefined, Error>({
    queryKey: ['userProfile', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) throw new Error('Missing userId');
      const res = await getUserProfile(userId);
      if (!res.success) throw new Error(res.error || res.message || 'Failed to fetch user profile');
      return res.data as UserProfile;
    },
  // keep previous data behavior controlled via QueryClient defaults; avoid incompatible option name
  });
};

/**
 * Hook: update user profile with optimistic update
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, profileData }: { userId: number; profileData: UpdateProfileData }) => {
      const res = await updateUserProfile(userId, profileData);
      if (!res.success) throw new Error(res.error || res.message || 'Failed to update profile');
      return res.data as UserProfile;
    },
    // Optimistic update: snapshot previous and set new profile immediately
    onMutate: async (variables) => {
      const { userId, profileData } = variables as { userId: number; profileData: UpdateProfileData };
      await queryClient.cancelQueries({ queryKey: ['userProfile', userId] });
      const previous = queryClient.getQueryData<UserProfile>(['userProfile', userId]);

      if (previous) {
        const optimistic = { ...previous, ...profileData } as UserProfile;
        queryClient.setQueryData(['userProfile', userId], optimistic);
      }

      return { previous };
    },
    onError: (err, variables, context: any) => {
      const { userId } = variables as { userId: number; profileData: UpdateProfileData };
      if (context?.previous) {
        queryClient.setQueryData(['userProfile', userId], context.previous);
      }
    },
    onSettled: (data, error, variables) => {
      const { userId } = variables as { userId: number; profileData: UpdateProfileData };
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
    },
  });
};

/**
 * Hook: upload profile picture and refresh profile on success
 */
export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, file }: { userId: number; file: File }) => {
      const res = await uploadProfilePicture(userId, file);
      if (!res.success) throw new Error(res.error || res.message || 'Failed to upload profile picture');
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', (variables as any).userId] });
    },
  });
};

/**
 * Hook: update profile picture URL
 */
export const useUpdateProfilePictureUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, imageUrl }: { userId: number; imageUrl: string }) => {
      const res = await updateProfilePictureUrl(userId, imageUrl);
      if (!res.success) throw new Error(res.error || res.message || 'Failed to update profile picture URL');
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', (variables as any).userId] });
    },
  });
};

