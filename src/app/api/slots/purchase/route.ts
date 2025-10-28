import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:3001';

/**
 * POST /api/slots/purchase
 * Purchase product slots for the authenticated user
 * 
 * This proxies the request to the backend and handles:
 * - Authentication via cookies
 * - Paystack payment initialization
 * - Error handling with detailed messages
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, slots } = body;

    // Validate input
    if (!userId || !slots || slots <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid userId or slots' },
        { status: 400 }
      );
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/slots/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `access_token=${accessToken.value}`,
      },
      body: JSON.stringify({ userId, slots }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend slot purchase error:', data);
      return NextResponse.json(
        { 
          success: false, 
          error: data.message || data.error || 'Failed to purchase slots' 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Slot purchase API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
