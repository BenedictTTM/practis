/**
 * Token Refresh Interceptor
 * 
 * Enterprise-grade automatic token refresh system with:
 * - Race condition prevention (single refresh at a time)
 * - Request queuing during refresh
 * - Exponential backoff for failures
 * - Comprehensive error handling
 * - Automatic retry mechanism
 * 
 * This module intercepts 401 errors and automatically refreshes
 * the access token using the refresh token, then retries the
 * original request transparently.
 * 
 * @module TokenRefreshInterceptor
 * @since 1.0.0
 */

const API_URL = '/api';

interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

/**
 * TokenRefreshManager
 * 
 * Manages token refresh state and request queuing to prevent
 * race conditions when multiple requests fail simultaneously.
 */
class TokenRefreshManager {
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;
  private requestQueue: QueuedRequest[] = [];
  private failedAttempts = 0;
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly BASE_DELAY = 1000; // 1 second

  /**
   * Calculate exponential backoff delay
   * Formula: baseDelay * 2^attempts
   * 
   * @param attempt - Current attempt number
   * @returns Delay in milliseconds
   */
  private getBackoffDelay(attempt: number): number {
    return this.BASE_DELAY * Math.pow(2, attempt);
  }

  /**
   * Wait for specified duration
   * 
   * @param ms - Milliseconds to wait
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Refresh the access token using the refresh token
   * 
   * Implements:
   * - Single concurrent refresh (prevents multiple simultaneous refreshes)
   * - Exponential backoff on failure
   * - Automatic logout on max attempts exceeded
   * 
   * @returns Promise that resolves when refresh is complete
   * @throws Error if refresh fails after all retries
   */
  async refreshToken(): Promise<void> {
    // If already refreshing, wait for existing refresh to complete
    if (this.isRefreshing && this.refreshPromise) {
      console.log('🔄 [TOKEN-REFRESH] Already refreshing, waiting for completion...');
      return this.refreshPromise;
    }

    console.log('🔄 [TOKEN-REFRESH] Starting token refresh process...');
    this.isRefreshing = true;

    // Create refresh promise
    this.refreshPromise = (async () => {
      while (this.failedAttempts < this.MAX_RETRY_ATTEMPTS) {
        try {
          console.log(`🔄 [TOKEN-REFRESH] Attempt ${this.failedAttempts + 1}/${this.MAX_RETRY_ATTEMPTS}`);
          
          const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include', // Send refresh_token cookie
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ [TOKEN-REFRESH] Refresh failed:', {
              status: response.status,
              statusText: response.statusText,
              error: errorText,
            });

            // If refresh token is invalid/expired, don't retry
            if (response.status === 401 || response.status === 403) {
              console.error('🚫 [TOKEN-REFRESH] Refresh token invalid/expired, logging out...');
              this.failedAttempts = this.MAX_RETRY_ATTEMPTS; // Force logout
              throw new Error('Refresh token expired. Please login again.');
            }

            throw new Error(`Refresh failed: ${response.statusText}`);
          }

          // Parse response
          const data = await response.json();
          console.log('✅ [TOKEN-REFRESH] Token refresh successful');
          
          // Reset failure counter on success
          this.failedAttempts = 0;
          
          // Process queued requests
          this.processQueue(null);
          
          return;
        } catch (error) {
          this.failedAttempts++;
          console.error(`❌ [TOKEN-REFRESH] Attempt ${this.failedAttempts} failed:`, error);

          if (this.failedAttempts >= this.MAX_RETRY_ATTEMPTS) {
            console.error('🚫 [TOKEN-REFRESH] Max retry attempts reached, logging out...');
            this.processQueue(error);
            
            // Redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login?reason=session_expired';
            }
            
            throw error;
          }

          // Exponential backoff
          const delay = this.getBackoffDelay(this.failedAttempts - 1);
          console.log(`⏳ [TOKEN-REFRESH] Waiting ${delay}ms before retry...`);
          await this.sleep(delay);
        }
      }
    })();

    try {
      await this.refreshPromise;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Process queued requests after refresh completes
   * 
   * @param error - Error if refresh failed, null if successful
   */
  private processQueue(error: any): void {
    console.log(`📋 [TOKEN-REFRESH] Processing ${this.requestQueue.length} queued requests...`);
    
    this.requestQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(null);
      }
    });
    
    this.requestQueue = [];
    console.log('✅ [TOKEN-REFRESH] Queue processed');
  }

  /**
   * Add request to queue
   * 
   * Queues requests that arrive while a token refresh is in progress.
   * These requests will be resolved/rejected when refresh completes.
   * 
   * @returns Promise that resolves when refresh is complete
   */
  async queueRequest(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ resolve, reject });
      console.log(`📥 [TOKEN-REFRESH] Request queued (${this.requestQueue.length} in queue)`);
    });
  }

  /**
   * Check if currently refreshing
   */
  isCurrentlyRefreshing(): boolean {
    return this.isRefreshing;
  }

  /**
   * Reset state (useful for testing or manual intervention)
   */
  reset(): void {
    this.isRefreshing = false;
    this.refreshPromise = null;
    this.failedAttempts = 0;
    this.requestQueue = [];
    console.log('🔄 [TOKEN-REFRESH] Manager reset');
  }
}

// Singleton instance
const refreshManager = new TokenRefreshManager();

/**
 * Enhanced fetch with automatic token refresh
 * 
 * Intercepts 401 responses and automatically refreshes the token,
 * then retries the original request.
 * 
 * Features:
 * - Automatic 401 detection and token refresh
 * - Queues concurrent requests during refresh
 * - Retries original request after successful refresh
 * - Prevents infinite retry loops
 * 
 * @param url - Request URL
 * @param options - Fetch options
 * @param retryCount - Internal retry counter (prevents infinite loops)
 * @returns Response from fetch
 */
export async function fetchWithTokenRefresh(
  url: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<Response> {
  const MAX_RETRIES = 1; // Only retry once after token refresh
  
  console.log(`🌐 [FETCH] Request to ${url}`, {
    method: options.method || 'GET',
    retryCount,
  });

  try {
    // Make the request
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Always send cookies
    });

    // If 401 Unauthorized and haven't retried yet
    if (response.status === 401 && retryCount < MAX_RETRIES) {
      console.log('🔐 [FETCH] Got 401, initiating token refresh...');

      // If already refreshing, wait for it to complete
      if (refreshManager.isCurrentlyRefreshing()) {
        console.log('⏳ [FETCH] Waiting for ongoing refresh...');
        await refreshManager.queueRequest();
      } else {
        // Start refresh
        await refreshManager.refreshToken();
      }

      // Retry the original request
      console.log('🔄 [FETCH] Retrying original request...');
      return fetchWithTokenRefresh(url, options, retryCount + 1);
    }

    console.log(`✅ [FETCH] Request completed: ${response.status}`);
    return response;
  } catch (error) {
    console.error('💥 [FETCH] Request failed:', error);
    throw error;
  }
}

/**
 * Export refresh manager for manual control if needed
 */
export const tokenRefreshManager = refreshManager;
