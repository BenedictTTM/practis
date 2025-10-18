import { User, LoginRequest, SignupRequest, AuthResponse } from '@/types/auth';
// Use Next.js API proxy routes so cookies are scoped to :3000
const API_URL = '/api';

export class AuthService {
  // Login user with email and password
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // allow browser to store cookies set by Next route
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  static async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      return data;
    } catch (error) {
      console.error('Signup error:', error);
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