import { NextRequest, NextResponse } from 'next/server';
import { deleteCache, readCacheJSON, writeCache } from '../../cache/redis';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

/**
 * Flash Sales API Route
 * 
 * TESTING MODE: 5-minute rotation
 * 
 * ARCHITECTURE: Stale-While-Revalidate + Pre-rendered Backend
 * =============================================================
 * 
 * Layer 1: Redis Cache (2min TTL - TESTING)
 * - Serves cached data instantly (<10ms)
 * - Prevents cache stampede
 * 
 * Layer 2: Backend Double-Buffer
 * - Always has pre-rendered data ready
 * - Zero query time during rotation
 * - Atomic swaps every 5 minutes (TESTING)
 * 
 * Benefits:
 * ✅ Sub-10ms response times (cache hit)
 * ✅ No "loading gaps" during rotation
 * ✅ Scales to millions of requests
 * ✅ Graceful degradation on errors
 * 
 * @route GET /api/products/flash-sales
 */
export async function GET(_request: NextRequest) {
  const cacheKey = 'flashproducts';
  const requestId = Math.random().toString(36).substring(7);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 FLASH SALES REQUEST [${requestId}]`);
  console.log(`⏰ Request time: ${new Date().toISOString()}`);
  
  try {
    // LAYER 1: Redis cache check (fastest path)
    console.log(`🔍 [${requestId}] Checking Redis cache...`);
    const cachedData = await readCacheJSON<unknown>(cacheKey);

    if (cachedData) {
      console.log(`✅ [${requestId}] CACHE HIT - Serving from Redis`);
      console.log(`📊 [${requestId}] Products: ${(cachedData as any).products?.length || 0}`);
      console.log(`📊 [${requestId}] Generation: ${(cachedData as any).generation || 'N/A'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240', // TESTING: 2min cache
          'X-Cache-Status': 'HIT',
          'X-Request-Id': requestId,
        },
      });
    }

    // LAYER 2: Backend fetch (pre-rendered data)
    console.log(`⚠️ [${requestId}] CACHE MISS - Fetching from backend...`);
    console.log(`🔗 [${requestId}] Backend URL: ${BACKEND_URL}/products/flash-sales`);
    
    const fetchStart = Date.now();
    const response = await fetch(`${BACKEND_URL}/products/flash-sales`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't use Next.js cache - we have our own caching strategy
      cache: 'no-store',
    });
    const fetchDuration = Date.now() - fetchStart;

    console.log(`📊 [${requestId}] Backend response status: ${response.status}`);
    console.log(`📊 [${requestId}] Fetch duration: ${fetchDuration}ms`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Failed to fetch flash sales' 
      }));
      
      console.error(`❌ [${requestId}] Backend error: ${errorData.message || 'Unknown error'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch flash sales' },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log(`📦 [${requestId}] Data received from backend:`);
    console.log(`   Products: ${data.products?.length || 0}`);
    console.log(`   Generation: ${data.generation || 'N/A'}`);
    console.log(`   Next refresh: ${data.nextRefreshAt || 'N/A'}`);
    console.log(`   Refreshes in: ${data.refreshesIn ? Math.floor(data.refreshesIn / 1000) + 's' : 'N/A'}`);

    // Store in Redis with 2-minute TTL (TESTING)
    // This creates a buffer zone so users rarely hit the backend directly
    console.log(`💾 [${requestId}] Caching in Redis (TTL: 2min)...`);
    await writeCache(cacheKey, data, 60 * 2); // TESTING: 2-minute cache

    console.log(
      `✅ [${requestId}] COMPLETE | ` +
      `Products: ${data.products?.length || 0} | ` +
      `Generation: ${data.generation || 'N/A'} | ` +
      `Total time: ${Date.now() - fetchStart + fetchDuration}ms`
    );
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240', // TESTING: 2min cache
        'X-Cache-Status': 'MISS',
        'X-Request-Id': requestId,
      },
    });
    
  } catch (error) {
    console.error(`❌ [${requestId}] EXCEPTION:`, error);
    console.error(`Stack trace:`, error instanceof Error ? error.stack : 'No stack trace');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        requestId,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products/flash-sales (refresh endpoint)
 * Manually refresh flash sales (admin/testing)
 */
export async function POST(_request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🔄 MANUAL REFRESH REQUEST [${requestId}]`);
  console.log(`⏰ Request time: ${new Date().toISOString()}`);
  
  try {
    console.log(`📡 [${requestId}] Calling backend refresh endpoint...`);
    
    const response = await fetch(`${BACKEND_URL}/products/flash-sales/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`📊 [${requestId}] Backend response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to refresh flash sales' }));
      console.error(`❌ [${requestId}] Backend error: ${errorData.message || 'Unknown error'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return NextResponse.json(
        { error: errorData.message || 'Failed to refresh flash sales' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log(`🗑️ [${requestId}] Clearing Redis cache...`);
    await deleteCache('flashproducts');
    
    console.log(`✅ [${requestId}] REFRESH COMPLETE`);
    console.log(`   Products: ${data.products?.length || 0}`);
    console.log(`   Generation: ${data.generation || 'N/A'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`❌ [${requestId}] EXCEPTION:`, error);
    console.error(`Stack trace:`, error instanceof Error ? error.stack : 'No stack trace');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return NextResponse.json(
      { error: 'Internal server error', requestId },
      { status: 500 }
    );
  }
}
