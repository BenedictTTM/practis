import { SearchResult, SearchParams, AutocompleteResult } from '@/types/search';

// ============================================================================
// PERFORMANCE OPTIMIZATIONS
// ============================================================================

/**
 * LRU Cache implementation for search results
 * Caches recent searches in memory for instant retrieval
 */
class LRUCache<T> {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private maxSize: number;
  private ttl: number;

  constructor(maxSize: number = 100, ttlSeconds: number = 60) {
    this.maxSize = maxSize;
    this.ttl = ttlSeconds * 1000;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // LRU: Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.data;
  }

  set(key: string, value: T): void {
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * Request deduplication to prevent duplicate concurrent searches
 */
class RequestDeduplicator {
  private pending = new Map<string, Promise<any>>();

  async deduplicate<T>(key: string, fn: () => Promise<T>): Promise<T> {
    // If same request is already in-flight, return that promise
    if (this.pending.has(key)) {
      return this.pending.get(key) as Promise<T>;
    }

    // Execute new request
    const promise = fn().finally(() => {
      this.pending.delete(key);
    });

    this.pending.set(key, promise);
    return promise;
  }
}

// ============================================================================
// CACHE INSTANCES
// ============================================================================

const searchCache = new LRUCache<SearchResult>(100, 60); // 100 items, 60s TTL
const autocompleteCache = new LRUCache<string[]>(50, 300); // 50 items, 5min TTL
const deduplicator = new RequestDeduplicator();

// ============================================================================
// DEBOUNCE UTILITY
// ============================================================================

let debounceTimer: NodeJS.Timeout | null = null;

export function debounce<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  return (...args: Parameters<T>) => {
    return new Promise((resolve, reject) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}

// ============================================================================
// OPTIMIZED SEARCH FUNCTIONS
// ============================================================================

/**
 * Search products with filters (OPTIMIZED)
 * 
 * Performance Features:
 * - Client-side caching (60s TTL)
 * - Request deduplication
 * - Optimized query params
 * - Timeout protection (5s)
 * 
 * @param params - Search parameters
 * @returns Search results
 */
export async function searchProducts(params: SearchParams): Promise<SearchResult> {
  // Generate cache key from params
  const cacheKey = JSON.stringify(params);
  
  // Check cache first
  const cached = searchCache.get(cacheKey);
  if (cached) {
    console.log('🎯 Cache HIT:', params.q || 'browse');
    return cached;
  }

  console.log('🔍 Cache MISS:', params.q || 'browse');

  // Deduplicate concurrent identical requests
  return deduplicator.deduplicate(cacheKey, async () => {
    const queryParams = new URLSearchParams();
    
    // Build optimized query string
    if (params.q) queryParams.set('q', params.q);
    if (params.category) queryParams.set('category', params.category);
    if (params.minPrice !== undefined) queryParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) queryParams.set('maxPrice', params.maxPrice.toString());
    if (params.condition) queryParams.set('condition', params.condition);
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
      const response = await fetch(
        `/api/products/search?${queryParams.toString()}`,
        {
          signal: controller.signal,
          // Performance: Keep-alive connection
          headers: {
            'Connection': 'keep-alive',
          },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to search products');
      }

      const result = await response.json();
      
      // Cache the result
      searchCache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Search timeout - try again');
      }
      throw error;
    }
  });
}

/**
 * Get autocomplete suggestions (OPTIMIZED)
 * 
 * Performance Features:
 * - Client-side caching (5min TTL)
 * - Request deduplication
 * - Early validation
 * - Timeout protection (2s)
 * 
 * @param query - Search query
 * @param limit - Max suggestions
 * @returns Array of suggestions
 */
export async function getAutocompleteSuggestions(
  query: string,
  limit: number = 5
): Promise<string[]> {
  // Early validation
  if (!query || query.trim().length < 2) {
    return [];
  }

  const trimmedQuery = query.trim();
  const cacheKey = `autocomplete:${trimmedQuery}:${limit}`;

  // Check cache first
  const cached = autocompleteCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Deduplicate concurrent requests
  return deduplicator.deduplicate(cacheKey, async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

    try {
      const response = await fetch(
        `/api/products/search/autocomplete?q=${encodeURIComponent(trimmedQuery)}&limit=${limit}`,
        {
          signal: controller.signal,
          headers: {
            'Connection': 'keep-alive',
          },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to get autocomplete suggestions');
      }

      const data: AutocompleteResult = await response.json();
      const suggestions = data.suggestions;
      
      // Cache the result
      autocompleteCache.set(cacheKey, suggestions);
      
      return suggestions;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        return []; // Return empty on timeout
      }
      
      console.error('Autocomplete error:', error);
      return [];
    }
  });
}

/**
 * Debounced autocomplete for real-time search (300ms delay)
 * Use this in input onChange handlers to reduce API calls
 * 
 * Example:
 * ```tsx
 * const handleSearch = async (query: string) => {
 *   const suggestions = await debouncedAutocomplete(query);
 *   setSuggestions(suggestions);
 * };
 * ```
 */
export const debouncedAutocomplete = debounce(getAutocompleteSuggestions, 300);

/**
 * Search products client-side (for use in client components)
 * Same as searchProducts but explicitly named for clarity
 */
export async function searchProductsClient(params: SearchParams): Promise<SearchResult> {
  return searchProducts(params);
}

/**
 * Prefetch search results for better UX
 * Call this when user hovers over search or starts typing
 * 
 * @param params - Search parameters to prefetch
 */
export async function prefetchSearch(params: SearchParams): Promise<void> {
  try {
    await searchProducts(params);
  } catch (error) {
    // Silently fail - prefetch is optional
    console.debug('Prefetch failed:', error);
  }
}

/**
 * Clear all search caches
 * Call this when user logs out or data is updated
 */
export function clearSearchCache(): void {
  searchCache.clear();
  autocompleteCache.clear();
  console.log('🧹 Search cache cleared');
}

/**
 * Get cache statistics for debugging/monitoring
 */
export function getCacheStats() {
  return {
    searchCache: {
      size: (searchCache as any).cache.size,
      maxSize: (searchCache as any).maxSize,
    },
    autocompleteCache: {
      size: (autocompleteCache as any).cache.size,
      maxSize: (autocompleteCache as any).maxSize,
    },
  };
}
