import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Logout API Route
 * 
 * Proxies logout request to backend and clears authentication cookies.
 * Ensures user session is properly terminated on both client and server.
 * 
 * @route POST /api/auth/logout
 * @access Private (requires authentication)
 * @returns 200 - Logout successful with cleared cookies
 * @returns 401 - Unauthorized (not authenticated)
 * @returns 500 - Server error
 * 
 * Flow:
 * 1. Frontend calls /api/auth/logout
 * 2. Proxy forwards to backend /auth/logout with cookies
 * 3. Backend revokes refresh token in database
 * 4. Backend clears cookies via Set-Cookie headers
 * 5. Frontend receives response and redirects to login
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚪 [LOGOUT] Processing logout request');
    console.log('🍪 [LOGOUT] Request cookies:', request.cookies.getAll().map(c => c.name));

    // Get cookies from request to forward to backend
    const cookieHeader = request.headers.get('cookie') || '';
    console.log('📦 [LOGOUT] Cookie header:', cookieHeader ? 'Present' : 'Missing');

    // Forward logout request to backend
    const beRes = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader, // Forward cookies for authentication
      },
      credentials: 'include',
    });

    console.log('📡 [LOGOUT] Backend response status:', beRes.status, beRes.statusText);

    // Try to parse response
    let data;
    try {
      const responseText = await beRes.text();
      if (responseText) {
        data = JSON.parse(responseText);
        console.log('📦 [LOGOUT] Backend response:', data);
      } else {
        data = { success: true, message: 'Logged out successfully' };
      }
    } catch (parseError) {
      console.warn('⚠️ [LOGOUT] Could not parse response, assuming success');
      data = { success: true, message: 'Logged out successfully' };
    }

    // Create response with backend status
    const nextRes = NextResponse.json(data, { status: beRes.status });

    // Forward cookie clearing headers from backend
    const anyHeaders: any = beRes.headers as any;
    const setCookies: string[] | undefined = anyHeaders.getSetCookie?.();

    if (Array.isArray(setCookies) && setCookies.length > 0) {
      console.log('🍪 [LOGOUT] Clearing cookies:', setCookies.length);
      for (const cookie of setCookies) {
        nextRes.headers.append('Set-Cookie', cookie);
      }
    } else {
      const single = beRes.headers.get('set-cookie');
      if (single) {
        console.log('🍪 [LOGOUT] Clearing single cookie');
        nextRes.headers.set('Set-Cookie', single);
      }
    }

    // Also manually clear cookies on frontend as backup
    // Set cookies with expired date to ensure they're removed
    nextRes.cookies.set('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    nextRes.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    console.log('✅ [LOGOUT] Logout successful, cookies cleared');
    return nextRes;

  } catch (error) {
    console.error('💥 [LOGOUT] Logout error:', error);

    // Check if backend is unreachable
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('❌ [LOGOUT] Cannot connect to backend');
      
      // Even if backend is down, clear cookies on frontend
      const response = NextResponse.json(
        { 
          success: false, 
          message: 'Backend unavailable, but cookies cleared locally',
        },
        { status: 503 }
      );

      // Clear cookies anyway
      response.cookies.set('access_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });

      response.cookies.set('refresh_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Logout failed', 
        error: String(error) 
      },
      { status: 500 }
    );
  }
}
