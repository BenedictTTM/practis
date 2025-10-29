import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Get Current User Endpoint
 * 
 * Proxies request to backend /auth/me endpoint while forwarding
 * authentication cookies from the client.
 * 
 * @route GET /api/auth/me
 * @returns Current user profile data
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 [PROXY] /api/auth/me - Fetching current user');

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');

    if (!accessToken) {
      console.warn('⚠️ [PROXY] No access token found');
      return NextResponse.json(
        { success: false, message: 'No access token found' },
        { status: 401 }
      );
    }

    console.log('✅ [PROXY] Access token found, forwarding to backend...');

    const beRes = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Cookie': `access_token=${accessToken.value}`,
      },
      credentials: 'include',
    });

    console.log('📡 [PROXY] Backend response status:', beRes.status);

    if (!beRes.ok) {
      const error = await beRes.json();
      console.error('❌ [PROXY] Backend error:', error);
      return NextResponse.json(error, { status: beRes.status });
    }

    const data = await beRes.json();
    console.log('✅ [PROXY] User data retrieved successfully');

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('💥 [PROXY] /api/auth/me proxy error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch user data',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
