import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:3001';

/**
 * GET /api/slots/[userId]
 * Get slot information for a specific user
 * 
 * Returns available and used slots for the user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/slots/${userId}`, {
      method: 'GET',
      headers: {
        Cookie: `access_token=${accessToken.value}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend get slots error:', data);
      return NextResponse.json(
        { 
          success: false, 
          error: data.message || 'Failed to fetch slots' 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Get slots API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
