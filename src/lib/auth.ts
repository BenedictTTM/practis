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
  static logout(): void {
    window.location.href = '/auth/login';
  }

  // Get authentication token
  static getToken(): string | null {
    // With cookie-based auth, token isn't readable client-side (httpOnly)
    return null;
  }

  // Get current user data
  static getUser(): User | null {
    // Consider fetching user from a /api/auth/me endpoint if needed
    return null;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    // With cookie auth, rely on server checks or a /api/auth/session endpoint
    return false;
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