export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePic?: string | null;
  role: string;
  premiumTier?: string;
  availableSlots?: number;
  usedSlots?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  access_token: string;
  remainingSlots?: number;
}