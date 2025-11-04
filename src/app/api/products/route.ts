import { NextRequest, NextResponse } from 'next/server';
import {readCache , readCacheJSON, writeCache} from '../cache/redis';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function maskToken(v?: string | null) {
  if (!v) return 'missing';
  try {
    return `${v.slice(0, 10)}…${v.slice(-6)} (len:${v.length})`;
  } catch {
    return 'invalid';
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Creating product, forwarding to backend...');
    
    // Get the raw form data from the request
    const formData = await request.formData();
    
    // Log what we're sending
    console.log('📋 FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    
    // Get cookies from the request (raw header and parsed for convenience)
    const rawCookie = request.headers.get('cookie') || '';
    const accessToken = request.cookies.get('access_token')?.value || null;
    const refreshToken = request.cookies.get('refresh_token')?.value || null;
    console.log('🍪 Raw Cookie header len:', rawCookie.length);
    console.log('🔑 access_token:', maskToken(accessToken));
    console.log('🔁 refresh_token:', maskToken(refreshToken));

    if (!rawCookie) {
      return NextResponse.json(
        { success: false, message: 'Authentication required - please login' },
        { status: 401 }
      );
    }

    if (!accessToken) {
      // Provide clearer error for missing access token
      return NextResponse.json(
        { success: false, message: 'Access token is required (no access_token cookie)' },
        { status: 401 }
      );
    }

    console.log('✅ Cookies found, forwarding to backend...');

    // Forward the exact FormData to your backend with cookies
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      body: formData,
      headers: {
        'Cookie': rawCookie, // Forward cookies to backend
      },
    });

    console.log('📊 Backend response status:', response.status);
    
    const result = await response.json();
    console.log('📦 Create product response:', result);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to create product' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('💥 POST Products API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const cacheKey = 'mainproducts'
  try {
    const cachedData = await readCacheJSON(cacheKey);
    if (cachedData) {
      console.log('⚡️ Products cache hit');
      return NextResponse.json(cachedData);
    }
    console.log('⚡️ Products cache miss, fetching from backend...');

    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const rawCookie = request.headers.get('cookie') || '';
    const accessToken = request.cookies.get('access_token')?.value || null;
    console.log('🧭 GET /api/products cookies len:', rawCookie.length, '| access_token:', maskToken(accessToken));
    
    const response = await fetch(`${API_URL}/products${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(rawCookie && { 'Cookie': rawCookie }),
      },
      cache: 'no-store',
    });


    
    if (!response.ok) {
       const errorData = await response.json().catch(() => ({ message: 'Failed to fetch flash sales' }));
      return NextResponse.json(
        { success: false, message: errorData.message || 'Failed to fetch products' },
        { status: response.status }
      );
    }

        const result = await response.json();
    await writeCache(cacheKey, result, 60 * 5); // Cache for 5 minutes

    if (Array.isArray(result)) {
      return NextResponse.json({
        success: true,
        data: result,
      });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('💥 GET Products API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}