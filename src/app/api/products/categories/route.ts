import { NextRequest, NextResponse } from 'next/server';
import { readCacheJSON, writeCache, deleteCache } from '../../cache/redis';

/**
 * Enterprise-grade Category API Routes
 * 
 * Architecture: Backend-for-Frontend (BFF) Pattern
 * - Acts as a proxy/gateway to backend category services
 * - Implements caching layer for high-traffic scenarios
 * - Handles error boundary and graceful degradation
 * - Provides request/response transformation
 * 
 * Following principles:
 * - Clean Architecture: Clear separation of concerns
 * - Single Responsibility: Only handles category proxying
 * - Error Handling: Comprehensive error boundaries
 * - Performance: Redis caching with TTL
 * - Observability: Structured logging
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Cache configuration (production-ready)
const CACHE_CONFIG = {
  CATEGORIES_LIST: { key: 'categories:all', ttl: 60 * 15 }, // 15 minutes
  CATEGORY_STATS: { key: 'categories:stats:', ttl: 60 * 10 }, // 10 minutes
  CATEGORY_PRODUCTS: { key: 'categories:products:', ttl: 60 * 5 }, // 5 minutes
  FEATURED_PRODUCTS: { key: 'categories:featured:', ttl: 60 * 15 }, // 15 minutes
} as const;

/**
 * Utility: Mask sensitive tokens for logging
 */
function maskToken(v?: string | null): string {
  if (!v) return 'missing';
  try {
    return `${v.slice(0, 10)}…${v.slice(-6)} (len:${v.length})`;
  } catch {
    return 'invalid';
  }
}

/**
 * Utility: Build cache key with parameters
 */
function buildCacheKey(base: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join(':');
  return `${base}${sortedParams}`;
}

/**
 * Utility: Log request details for observability
 */
function logRequest(method: string, path: string, params?: Record<string, any>) {
  console.log(`🌐 [${method}] ${path}`, params ? JSON.stringify(params) : '');
}

/**
 * Utility: Log cache performance
 */
function logCache(hit: boolean, key: string) {
  console.log(hit ? `⚡ Cache HIT: ${key}` : `💨 Cache MISS: ${key}`);
}

/**
 * GET /api/products/categories
 * 
 * Retrieve all available product categories with metadata and counts
 * 
 * Response:
 * [
 *   {
 *     category: "clothes",
 *     label: "Clothes & Fashion",
 *     description: "...",
 *     icon: "shirt",
 *     productCount: 234
 *   },
 *   ...
 * ]
 * 
 * Caching: 15 minutes (categories rarely change)
 * Error Handling: Graceful degradation with empty array
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    logRequest('GET', '/api/products/categories');

    // Try cache first (high-traffic optimization)
    const cacheKey = CACHE_CONFIG.CATEGORIES_LIST.key;
    const cachedData = await readCacheJSON(cacheKey);
    
    if (cachedData) {
      logCache(true, cacheKey);
      const duration = Date.now() - startTime;
      console.log(`✅ Categories retrieved from cache | Duration: ${duration}ms`);
      
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }

    logCache(false, cacheKey);

    // Fetch from backend
    const response = await fetch(`${BACKEND_URL}/products/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable Next.js cache, use Redis instead
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      console.error(`❌ Backend error: ${response.status} | Duration: ${duration}ms`);
      
      const errorData = await response.json().catch(() => ({ 
        message: 'Failed to fetch categories' 
      }));
      
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Failed to fetch categories',
          data: [], // Graceful degradation
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Cache the successful response
    await writeCache(cacheKey, data, CACHE_CONFIG.CATEGORIES_LIST.ttl);

    console.log(`✅ Categories retrieved from backend | Count: ${data.length} | Duration: ${duration}ms`);

    return NextResponse.json({
      success: true,
      data,
      cached: false,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`💥 Categories API Error | Duration: ${duration}ms`, error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while fetching categories',
        data: [], // Graceful degradation
        error: process.env.NODE_ENV === 'development' 
          ? String(error) 
          : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/categories
 * 
 * Clear all category-related caches
 * Useful after product updates or manual cache invalidation
 * 
 * Note: This is an admin/maintenance endpoint
 * In production, add authentication/authorization
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    logRequest('DELETE', '/api/products/categories (cache clear)');

    // Clear all category caches
    await Promise.all([
      deleteCache(CACHE_CONFIG.CATEGORIES_LIST.key),
      // Could also clear individual category caches here if needed
    ]);

    console.log('✅ Category caches cleared');

    return NextResponse.json({
      success: true,
      message: 'Category caches cleared successfully',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('💥 Cache clear error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to clear caches',
      },
      { status: 500 }
    );
  }
}
