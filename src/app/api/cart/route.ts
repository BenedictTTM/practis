import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:3001';

/**
 * GET /api/cart
 * Fetch the authenticated user's cart
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');
     console.log(`getting the cookies for the backend in the cart route${token}`)
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${token.value}`,
      },
    });

    // Handle empty response (cart doesn't exist yet)
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || 'Failed to fetch cart' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Add item to cart
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity } = body;

    // Validate input
    if (!productId || typeof productId !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Valid product ID is required' },
        { status: 400 }
      );
    }

    if (quantity && (typeof quantity !== 'number' || quantity < 1)) {
      return NextResponse.json(
        { success: false, message: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${token.value}`,
      },
      body: JSON.stringify({ productId, quantity: quantity || 1 }),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || 'Failed to add item to cart' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart
 * Clear all items from cart
 */
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${token.value}`,
      },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || 'Failed to clear cart' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
