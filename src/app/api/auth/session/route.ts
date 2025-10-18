import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Session Check API Route
 * 
 * Verifies if the user has a valid authentication token.
 * Used by client-side components to check authentication status.
 * 
 * @route GET /api/auth/session
 * @returns 200 if authenticated, 401 if not
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');

    // Check if token exists
    if (!accessToken) {
      return NextResponse.json(
        { 
          authenticated: false, 
          message: 'No authentication token found' 
        },
        { status: 401 }
      );
    }

    // Optionally, verify token with backend
    // You can add backend validation here if needed
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${BACKEND_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Cookie': `access_token=${accessToken.value}`,
        },
      });

      if (!response.ok) {
        // Token is invalid or expired
        return NextResponse.json(
          { 
            authenticated: false, 
            message: 'Invalid or expired token' 
          },
          { status: 401 }
        );
      }

      // Token is valid
      return NextResponse.json(
        { 
          authenticated: true,
          message: 'User is authenticated' 
        },
        { status: 200 }
      );
    } catch (backendError) {
      // If backend is unreachable, but token exists, allow access
      // This prevents complete lockout if backend is temporarily down
      console.warn('Backend verification failed, allowing access with token:', backendError);
      
      return NextResponse.json(
        { 
          authenticated: true,
          message: 'Token exists (backend verification unavailable)' 
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { 
        authenticated: false, 
        message: 'Session check failed' 
      },
      { status: 500 }
    );
  }
}
