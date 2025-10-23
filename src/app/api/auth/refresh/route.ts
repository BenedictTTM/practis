import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Token Refresh API Route
 * 
 * Proxies refresh token requests to the backend while maintaining
 * HTTP-only cookie security. This endpoint is called automatically
 * by the token refresh interceptor when an access token expires.
 * 
 * Security Flow:
 * 1. Extract refresh_token from HTTP-only cookie
 * 2. Forward to backend /auth/refresh endpoint
 * 3. Backend validates refresh token
 * 4. Backend generates new token pair
 * 5. Backend returns new tokens via Set-Cookie headers
 * 6. Proxy forwards Set-Cookie headers to client
 * 7. Browser stores new tokens as HTTP-only cookies
 * 
 * @route POST /api/auth/refresh
 * @returns 200 with success message if refresh successful
 * @returns 401 if refresh token is invalid/expired
 * @returns 500 if backend is unreachable
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [API-REFRESH] Token refresh request received');

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token');

    // Check if refresh token exists
    if (!refreshToken) {
      console.warn('⚠️ [API-REFRESH] No refresh token found in cookies');
      return NextResponse.json(
        { 
          success: false,
          message: 'No refresh token found' 
        },
        { status: 401 }
      );
    }

    console.log('✅ [API-REFRESH] Refresh token found, forwarding to backend...');

    // Forward request to backend
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `refresh_token=${refreshToken.value}`,
        },
        credentials: 'include',
      });

      console.log('📡 [API-REFRESH] Backend response:', {
        status: response.status,
        statusText: response.statusText,
      });

      // Get response data
      const data = await response.json();

      // Handle backend errors
      if (!response.ok) {
        console.error('❌ [API-REFRESH] Backend refresh failed:', {
          status: response.status,
          error: data.message || response.statusText,
        });

        return NextResponse.json(
          { 
            success: false,
            message: data.message || 'Token refresh failed' 
          },
          { status: response.status }
        );
      }

      console.log('✅ [API-REFRESH] Token refresh successful');

      // Create response with new cookies
      const nextResponse = NextResponse.json(
        {
          success: true,
          message: 'Tokens refreshed successfully'
        },
        { status: 200 }
      );

      // Forward Set-Cookie headers from backend to client
      const setCookieHeaders = response.headers.getSetCookie();
      
      if (setCookieHeaders && setCookieHeaders.length > 0) {
        console.log(`🍪 [API-REFRESH] Forwarding ${setCookieHeaders.length} Set-Cookie headers`);
        
        setCookieHeaders.forEach(cookie => {
          nextResponse.headers.append('Set-Cookie', cookie);
        });
      } else {
        console.warn('⚠️ [API-REFRESH] No Set-Cookie headers received from backend');
      }

      return nextResponse;
    } catch (backendError) {
      console.error('💥 [API-REFRESH] Backend request failed:', backendError);
      
      return NextResponse.json(
        { 
          success: false,
          message: 'Cannot reach authentication server. Please try again.' 
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('💥 [API-REFRESH] Unexpected error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Token refresh failed due to unexpected error' 
      },
      { status: 500 }
    );
  }
}
