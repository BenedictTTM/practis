import { User, LoginRequest, SignupRequest, AuthResponse } from '@/types/auth';
// Use Next.js API proxy routes so cookies are scoped to :3000
const API_URL = '/api';

type PasswordResetRequest = { email: string };
type PasswordResetPayload = { token: string; newPassword: string };

export class AuthService {
  // Login user with email and password
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🚀 [AUTH] Login attempt:', {
        url: `${API_URL}/auth/login`,
        email: credentials.email
      });

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // allow browser to store cookies set by Next route
        body: JSON.stringify(credentials),
      });

      console.log('📡 [AUTH] Login response status:', response.status, response.statusText);

      // Get response text first to handle both JSON and HTML responses
      const responseText = await response.text();
      console.log('📄 [AUTH] Raw response (first 200 chars):', responseText.substring(0, 200));

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('✅ [AUTH] Parsed JSON response:', data);
      } catch (parseError) {
        console.error('❌ [AUTH] Failed to parse response as JSON');
        console.error('📄 [AUTH] Full response:', responseText);
        
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
          throw new Error(
            `API returned HTML instead of JSON. Status: ${response.status}\n` +
            `This usually means the endpoint doesn't exist or backend is not running.`
          );
        }
        
        throw new Error(`Invalid response from server: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        console.error('❌ [AUTH] Login failed:', data);
        throw new Error(data.message || `Login failed with status ${response.status}`);
      }

      console.log('✅ [AUTH] Login successful');
      return data;
    } catch (error) {
      console.error('💥 [AUTH] Login error:', error);
      throw error;
    }
  }

  // Register new user
  static async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      console.log('🚀 [AUTH] Signup attempt:', {
        url: `${API_URL}/auth/signup`,
        userData: { ...userData, password: '***' } // Hide password in logs
      });

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      console.log('📡 [AUTH] Signup response status:', response.status, response.statusText);
      console.log('📡 [AUTH] Response headers:', Object.fromEntries(response.headers.entries()));

      // Get response text first to handle both JSON and HTML responses
      const responseText = await response.text();
      console.log('📄 [AUTH] Raw response (first 200 chars):', responseText.substring(0, 200));

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('✅ [AUTH] Parsed JSON response:', data);
      } catch (parseError) {
        console.error('❌ [AUTH] Failed to parse response as JSON');
        console.error('📄 [AUTH] Full response:', responseText);
        
        // If response is HTML (likely 404 or error page)
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
          throw new Error(
            `API returned HTML instead of JSON. This usually means:\n` +
            `1. The endpoint doesn't exist (404)\n` +
            `2. Backend is not running\n` +
            `3. Wrong API URL\n` +
            `Status: ${response.status} ${response.statusText}\n` +
            `URL: ${API_URL}/auth/signup`
          );
        }
        
        throw new Error(`Invalid response from server: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        console.error('❌ [AUTH] Signup failed:', data);
        throw new Error(data.message || `Signup failed with status ${response.status}`);
      }

      console.log('✅ [AUTH] Signup successful');
      return data;
    } catch (error) {
      console.error('💥 [AUTH] Signup error:', error);
      throw error;
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      // Call logout endpoint to clear server-side session
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always redirect to login
      window.location.href = '/auth/login';
    }
  }

  static async requestPasswordReset(data: PasswordResetRequest): Promise<{ message?: string }> {
    const response = await fetch(`${API_URL}/auth/password-reset/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    let payload: any = {};

    if (responseText.trim()) {
      try {
        payload = JSON.parse(responseText);
      } catch (error) {
        console.error('❌ [AUTH] Failed to parse password reset request response:', responseText);
        throw new Error('Unexpected response from server while requesting password reset');
      }
    }

    if (!response.ok) {
      throw new Error(payload?.message || 'Password reset request failed');
    }

    return payload;
  }

  static async resetPassword(data: PasswordResetPayload): Promise<{ message?: string }> {
    const response = await fetch(`${API_URL}/auth/password-reset/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    let payload: any = {};

    if (responseText.trim()) {
      try {
        payload = JSON.parse(responseText);
      } catch (error) {
        console.error('❌ [AUTH] Failed to parse password reset response:', responseText);
        throw new Error('Unexpected response from server while resetting password');
      }
    }

    if (!response.ok) {
      throw new Error(payload?.message || 'Password reset failed');
    }

    return payload;
  }

  // Get authentication token
  static getToken(): string | null {
    // With cookie-based auth, token isn't readable client-side (httpOnly)
    return null;
  }

  // Get current user data
  static async getUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user || null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        credentials: 'include',
        cache: 'no-store',
      });

      return response.ok;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  // Make authenticated API request
  static async authFetch(url: string, options: RequestInit = {}): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    } as Record<string, string>;

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: 'include',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        this.logout();
      }

      throw new Error(data.message || 'Request failed');
    }

    return data;

  }
}