import { NextRequest, NextResponse } from 'next/server';
import { deleteCache, readCacheJSON, writeCache } from '../../cache/redis';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

/**
 * GET /api/products/flash-sales
 * Fetches flash sale products (30-70% discount, refreshed hourly)
 * No authentication required
 */
export async function GET(_request: NextRequest) {
  const cacheKey = 'flashproducts';
  try {
    const cachedData = await readCacheJSON<unknown>(cacheKey);

    if (cachedData) {
      console.log('⚡️ Flash sales cache hit');
      return NextResponse.json(cachedData);
    }

    console.log('⚡️ Flash sales cache miss, fetching from backend...');
    const response = await fetch(`${BACKEND_URL}/products/flash-sales`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache to get fresh countdown data
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch flash sales' }));
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch flash sales' },
        { status: response.status }
      );
    }

    const data = await response.json();

  await writeCache(cacheKey, data, 60 * 5);

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Flash sales API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products/flash-sales (refresh endpoint)
 * Manually refresh flash sales (admin/testing)
 */
export async function POST(_request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/products/flash-sales/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to refresh flash sales' }));
      return NextResponse.json(
        { error: errorData.message || 'Failed to refresh flash sales' },
        { status: response.status }
      );
    }

    const data = await response.json();
    await deleteCache('flashproducts');
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Flash sales refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
