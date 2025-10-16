import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function maskToken(v?: string | null) {
  if (!v) return 'missing';
  try {
    return `${v.slice(0, 10)}…${v.slice(-6)} (len:${v.length})`;
  } catch {
    return 'invalid';
  }
}

/**
 * GET /api/products/me
 * Fetches all products for the authenticated user
 * Requires authentication via HTTP-only cookies
 */
export async function GET(request: NextRequest) {
  try {
    console.log('📤 Fetching user products, forwarding to backend...');
    
    // Get cookies from the request
    const rawCookie = request.headers.get('cookie') || '';
    const accessToken = request.cookies.get('access_token')?.value || null;
    const refreshToken = request.cookies.get('refresh_token')?.value || null;
    
    console.log('🍪 Cookie check:');
    console.log('  - Raw Cookie header length:', rawCookie.length);
    console.log('  - access_token:', maskToken(accessToken));
    console.log('  - refresh_token:', maskToken(refreshToken));

    // Validate authentication
    if (!rawCookie) {
      return NextResponse.json(
        { success: false, message: 'Authentication required - please login' },
        { status: 401 }
      );
    }

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Access token is required' },
        { status: 401 }
      );
    }

    console.log('✅ Cookies found, forwarding to backend...');

    // Forward request to backend with cookies
    const response = await fetch(`${API_URL}/products/user/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': rawCookie, // Forward cookies to backend
      },
    });

    console.log('📊 Backend response status:', response.status);
    
    const result = await response.json();
    console.log('📦 User products response:', {
      success: response.ok,
      productCount: Array.isArray(result) ? result.length : 0,
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to fetch user products' },
        { status: response.status }
      );
    }

    // Ensure consistent response format
    if (Array.isArray(result)) {
      return NextResponse.json({
        success: true,
        data: result,
      });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('💥 GET My Products API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
