import { NextRequest, NextResponse } from 'next/server';
import { readCacheJSON, writeCache } from '../../../cache/redis';

/**
 * Dynamic Category Products API Route
 * 
 * GET /api/products/categories/[category]
 * 
 * Retrieves products for a specific category with advanced filtering,
 * sorting, and pagination capabilities.
 * 
 * Query Parameters:
 * - page: number (default: 1) - Page number
 * - limit: number (default: 20, max: 100) - Items per page
 * - sortBy: string (default: newest) - Sort order
 * - condition: string - Filter by condition
 * - minPrice: number - Minimum price filter
 * - maxPrice: number - Maximum price filter
 * - inStock: boolean (default: true) - Availability filter
 * 
 * Architecture: BFF Pattern with intelligent caching
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// Cache TTL: 5 minutes for category products
const CACHE_TTL = 60 * 5;

/**
 * Utility: Build cache key from request parameters
 */
function buildCacheKey(category: string, searchParams: URLSearchParams): string {
  const params = {
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '20',
    sortBy: searchParams.get('sortBy') || 'newest',
    condition: searchParams.get('condition') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStock: searchParams.get('inStock') || 'true',
  };

  // Filter out empty values
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== '')
    .map(([key, value]) => `${key}:${value}`)
    .join(':');

  return `categories:products:${category}:${filteredParams}`;
}

/**
 * Utility: Validate category name
 */
function isValidCategory(category: string): boolean {
  const validCategories = [
    'clothes',
    'accessories',
    'home',
    'books',
    'sports_and_outing',
    'others',
  ];
  return validCategories.includes(category.toLowerCase());
}

/**
 * GET /api/products/categories/[category]
 * 
 * Retrieve paginated products for a specific category
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    const category = params.category;
    const { searchParams } = new URL(request.url);

    console.log(`🌐 [GET] /api/products/categories/${category}`, {
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      sortBy: searchParams.get('sortBy'),
    });

    // Validate category
    if (!isValidCategory(category)) {
      console.warn(`⚠️  Invalid category: ${category}`);
      return NextResponse.json(
        {
          success: false,
          message: `Invalid category: ${category}. Must be one of: clothes, accessories, home, books, sports_and_outing, others`,
        },
        { status: 400 }
      );
    }

    // Try cache first
    const cacheKey = buildCacheKey(category, searchParams);
    const cachedData = await readCacheJSON(cacheKey);

    if (cachedData) {
      const duration = Date.now() - startTime;
      console.log(`⚡ Cache HIT: ${cacheKey} | Duration: ${duration}ms`);
      
      return NextResponse.json({
        ...cachedData,
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }

    console.log(`💨 Cache MISS: ${cacheKey}`);

    // Build query string
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/products/categories/${category}${queryString ? `?${queryString}` : ''}`;

    // Fetch from backend
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      console.error(`❌ Backend error for category ${category}: ${response.status} | Duration: ${duration}ms`);
      
      const errorData = await response.json().catch(() => ({
        message: 'Failed to fetch products',
      }));

      return NextResponse.json(
        {
          success: false,
          message: errorData.message || `Failed to fetch ${category} products`,
          data: [],
          pagination: {
            page: 1,
            limit: 20,
            totalCount: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Cache the successful response
    await writeCache(cacheKey, data, CACHE_TTL);

    console.log(`✅ Category products retrieved | Category: ${category} | Products: ${data.data?.length || 0} | Duration: ${duration}ms`);

    return NextResponse.json({
      ...data,
      cached: false,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`💥 Category Products API Error | Duration: ${duration}ms`, error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while fetching category products',
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          totalCount: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        error: process.env.NODE_ENV === 'development'
          ? String(error)
          : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
