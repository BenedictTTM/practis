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

    // Verify token with backend and get user data
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${BACKEND_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Cookie': `access_token=${accessToken.value}`,
        },
        credentials: 'include',
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

      // Get user data from backend
      const userData = await response.json();

      // Token is valid, return user data
      return NextResponse.json(
        { 
          authenticated: true,
          message: 'User is authenticated',
          user: userData.user || userData
        },
        { status: 200 }
      );
    } catch (backendError) {
      console.error('Backend verification failed:', backendError);
      
      // If backend is unreachable, return error
      return NextResponse.json(
        { 
          authenticated: false,
          message: 'Cannot verify authentication. Please try again.' 
        },
        { status: 503 }
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
