import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:3001';

/**
 * GET /api/cart/count
 * Get the total count of items in the cart
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');

    if (!token) {
      return NextResponse.json(
        { success: false, count: 0, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/cart/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${token.value}`,
      },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : { count: 0 };

    if (!response.ok) {
      return NextResponse.json(
        { success: false, count: 0, message: data?.message || 'Failed to fetch cart count' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Cart count fetch error:', error);
    return NextResponse.json(
      { success: false, count: 0, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
