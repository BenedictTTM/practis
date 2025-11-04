import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * POST /api/cart/merge
 * 
 * Merge anonymous cart items with authenticated user's cart
 * Called after login/signup to preserve cart items from local storage
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Get items from request body
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: 'No items to merge' },
        { status: 400 }
      );
    }

    console.log('🔄 [CART-MERGE] Merging cart items:', {
      itemCount: items.length,
      url: `${BACKEND_URL}/cart/merge`,
    });

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/cart/merge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken.value}`,
      },
      body: JSON.stringify({ items }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ [CART-MERGE] Backend error:', {
        status: response.status,
        message: data.message,
      });

      return NextResponse.json(
        { message: data.message || 'Failed to merge cart' },
        { status: response.status }
      );
    }

    console.log('✅ [CART-MERGE] Cart merged successfully');

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('💥 [CART-MERGE] Server error:', error);
    
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
