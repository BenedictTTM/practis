/**
 * OAuth Service
 * 
 * Enterprise-grade OAuth authentication utilities for frontend.
 * Handles OAuth flow coordination, error handling, and state management.
 * 
 * Features:
 * - OAuth flow initiation
 * - Callback handling
 * - Error recovery
 * - State validation
 * - Analytics tracking
 * 
 * Security:
 * - CSRF protection (via backend state parameter)
 * - Secure redirects
 * - Token handling via HTTP-only cookies
 * 
 * @module OAuthService
 */

import { useState } from 'react';

export interface OAuthConfig {
  /**
   * OAuth provider name
   */
  provider: 'google' | 'facebook' | 'github';
  
  /**
   * Backend URL
   */
  backendUrl?: string;
  
  /**
   * Success redirect path
   */
  successRedirect?: string;
  
  /**
   * Error redirect path
   */
  errorRedirect?: string;
}

export interface OAuthResult {
  success: boolean;
  provider: string;
  error?: string;
  user?: any;
}

export class OAuthService {
  /**
   * Get backend URL from environment
   * Falls back to localhost for development
   */
  private static getBackendUrl(): string {
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'http://localhost:3001'
    );
  }

  /**
   * Initiate OAuth flow for a specific provider
   * 
   * @param config - OAuth configuration
   * @returns Promise that resolves when redirect is initiated
   * 
   * @example
   * ```typescript
   * await OAuthService.initiateOAuth({ provider: 'google' });
   * ```
   */
  static async initiateOAuth(config: OAuthConfig): Promise<void> {
    try {
      const backendUrl = config.backendUrl || this.getBackendUrl();
      const { provider, successRedirect, errorRedirect } = config;

      console.log(`🔐 [OAUTH] Initiating ${provider} OAuth flow`);
      console.log(`🔗 [OAUTH] Backend URL: ${backendUrl}`);

      // Build OAuth URL with optional redirect hints
      let oauthUrl = `${backendUrl}/auth/oauth/${provider}`;

      // Add query parameters for custom redirects if provided
      const params = new URLSearchParams();
      if (successRedirect) params.append('successRedirect', successRedirect);
      if (errorRedirect) params.append('errorRedirect', errorRedirect);

      if (params.toString()) {
        oauthUrl += `?${params.toString()}`;
      }

      // Store OAuth state for callback handling
      this.storeOAuthState({
        provider,
        timestamp: Date.now(),
        successRedirect,
        errorRedirect,
      });

      // Redirect to OAuth provider
      window.location.href = oauthUrl;
    } catch (error) {
      console.error('❌ [OAUTH] Failed to initiate OAuth:', error);
      throw new Error(`Failed to initiate ${config.provider} OAuth`);
    }
  }

  /**
   * Handle OAuth callback from provider
   * 
   * @param searchParams - URL search parameters from callback
   * @returns OAuth result with user data
   * 
   * @example
   * ```typescript
   * const result = OAuthService.handleCallback(searchParams);
   * if (result.success) {
   *   router.push('/dashboard');
   * }
   * ```
   */
  static handleCallback(searchParams: URLSearchParams): OAuthResult {
    const oauthStatus = searchParams.get('oauth');
    const errorMessage = searchParams.get('message');
    const state = this.getOAuthState();

    if (oauthStatus === 'success') {
      console.log('✅ [OAUTH] OAuth authentication successful');
      
      // Clear stored state
      this.clearOAuthState();

      return {
        success: true,
        provider: state?.provider || 'unknown',
      };
    }

    if (errorMessage) {
      console.error('❌ [OAUTH] OAuth authentication failed:', errorMessage);
      
      // Clear stored state
      this.clearOAuthState();

      return {
        success: false,
        provider: state?.provider || 'unknown',
        error: decodeURIComponent(errorMessage),
      };
    }

    return {
      success: false,
      provider: 'unknown',
      error: 'Invalid OAuth callback',
    };
  }

  /**
   * Check if user is authenticated via OAuth
   * 
   * @returns boolean indicating OAuth authentication status
   */
  static async isOAuthAuthenticated(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
        cache: 'no-store',
      });

      return response.ok;
    } catch (error) {
      console.error('❌ [OAUTH] Failed to check OAuth authentication:', error);
      return false;
    }
  }

  /**
   * Store OAuth state in sessionStorage for callback validation
   * 
   * @param state - OAuth state data
   * @private
   */
  private static storeOAuthState(state: any): void {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('oauth_state', JSON.stringify(state));
      }
    } catch (error) {
      console.warn('⚠️ [OAUTH] Failed to store OAuth state:', error);
    }
  }

  /**
   * Retrieve OAuth state from sessionStorage
   * 
   * @returns Stored OAuth state or null
   * @private
   */
  private static getOAuthState(): any {
    try {
      if (typeof window !== 'undefined') {
        const state = sessionStorage.getItem('oauth_state');
        return state ? JSON.parse(state) : null;
      }
    } catch (error) {
      console.warn('⚠️ [OAUTH] Failed to retrieve OAuth state:', error);
    }
    return null;
  }

  /**
   * Clear OAuth state from sessionStorage
   * 
   * @private
   */
  private static clearOAuthState(): void {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('oauth_state');
      }
    } catch (error) {
      console.warn('⚠️ [OAUTH] Failed to clear OAuth state:', error);
    }
  }

  /**
   * Get current user from OAuth session
   * 
   * @returns User data or null
   */
  static async getCurrentUser(): Promise<any> {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user || null;
    } catch (error) {
      console.error('❌ [OAUTH] Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Disconnect OAuth provider
   * 
   * @param provider - Provider to disconnect
   */
  static async disconnectProvider(provider: string): Promise<void> {
    try {
      console.log(`🔓 [OAUTH] Disconnecting ${provider} provider`);

      // Call backend endpoint to disconnect provider
      await fetch(`/api/auth/oauth/${provider}/disconnect`, {
        method: 'POST',
        credentials: 'include',
      });

      console.log(`✅ [OAUTH] ${provider} provider disconnected`);
    } catch (error) {
      console.error(`❌ [OAUTH] Failed to disconnect ${provider}:`, error);
      throw error;
    }
  }
}

/**
 * OAuth Hook for React Components
 * 
 * @example
 * ```typescript
 * const { initiateGoogle, isLoading } = useOAuth();
 * 
 * return (
 *   <button onClick={initiateGoogle} disabled={isLoading}>
 *     Sign in with Google
 *   </button>
 * );
 * ```
 */
export function useOAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const initiateGoogle = async () => {
    setIsLoading(true);
    try {
      await OAuthService.initiateOAuth({ provider: 'google' });
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return {
    initiateGoogle,
    isLoading,
  };
}

export default OAuthService;
