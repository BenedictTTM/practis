import { User, LoginRequest, SignupRequest, AuthResponse } from '@/types/auth';
import { fetchWithTokenRefresh } from './token-refresh';

// Use Next.js API proxy routes for all auth requests
// This ensures cookies are properly scoped to the frontend domain
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
      console.log('🚪 [AUTH] Logging out...');
      
      // Call logout endpoint to clear server-side session and cookies
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      console.log('📡 [AUTH] Logout response:', response.status);

      if (response.ok) {
        console.log('✅ [AUTH] Logout successful');
      } else {
        console.warn('⚠️ [AUTH] Logout endpoint returned error, but continuing cleanup');
      }
    } catch (error) {
      console.error('💥 [AUTH] Logout error:', error);
      console.log('⚠️ [AUTH] Continuing with local cleanup despite error');
    } finally {
      // Clear local storage (cart items, etc.)
      console.log('🧹 [AUTH] Clearing local storage...');
      localStorage.clear();
      
      // Clear session storage
      sessionStorage.clear();
      
      console.log('✅ [AUTH] Local cleanup complete');
      
      // Always redirect to login page
      console.log('🔄 [AUTH] Redirecting to login page...');
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
      console.log('🔐 [AUTH] Fetching current user via /api/auth/me');
      
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      });

      console.log('📡 [AUTH] Response status:', response.status);

      if (!response.ok) {
        console.warn('⚠️ [AUTH] Failed to fetch user:', response.status);
        return null;
      }

      const data = await response.json();
      console.log('✅ [AUTH] User data received:', data);
      return data.user || null;
    } catch (error) {
      console.error('💥 [AUTH] Get user error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      console.log('🔐 [AUTH] Checking authentication via /api/auth/session');
      
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
        cache: 'no-store',
      });

      console.log('📡 [AUTH] Session check status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('💥 [AUTH] Auth check error:', error);
      return false;
    }
  }

  // Make authenticated API request with automatic token refresh
  static async authFetch(url: string, options: RequestInit = {}): Promise<any> {
    console.log('🔐 [AUTH-FETCH] Making authenticated request:', {
      url: `${API_URL}${url}`,
      method: options.method || 'GET',
    });

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    } as Record<string, string>;

    try {
      // Use fetchWithTokenRefresh for automatic 401 handling
      const response = await fetchWithTokenRefresh(`${API_URL}${url}`, {
        ...options,
        credentials: 'include',
        headers,
      });

      console.log('📡 [AUTH-FETCH] Response received:', {
        status: response.status,
        statusText: response.statusText,
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      if (!response.ok) {
        let errorMessage = 'Request failed';
        
        if (isJson) {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } else {
          errorMessage = response.statusText || errorMessage;
        }

        console.error('❌ [AUTH-FETCH] Request failed:', {
          status: response.status,
          error: errorMessage,
        });

        // If still 401 after token refresh attempts, logout
        if (response.status === 401) {
          console.error('🚫 [AUTH-FETCH] Authentication failed, logging out...');
          this.logout();
        }

        throw new Error(errorMessage);
      }

      // Parse JSON response
      const data = isJson ? await response.json() : null;
      console.log('✅ [AUTH-FETCH] Request successful');
      
      return data;
    } catch (error) {
      console.error('💥 [AUTH-FETCH] Request error:', error);
      throw error;
    }
  }
}