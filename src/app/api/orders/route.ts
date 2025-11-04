import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:3001';

// GET /api/orders - list buyer orders
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please log in' },
        { status: 401 },
      );
    }

    const res = await fetch(`${BACKEND_URL}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${token.value}`,
      },
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || 'Failed to fetch orders' },
        { status: res.status },
      );
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error('Orders GET error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/orders - create an order
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please log in' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { productId, quantity, whatsappNumber, callNumber, hall, message } = body || {};

    if (!productId || typeof productId !== 'number') {
      return NextResponse.json({ success: false, message: 'Valid productId is required' }, { status: 400 });
    }
    if (!quantity || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json({ success: false, message: 'Quantity must be at least 1' }, { status: 400 });
    }
    if (!whatsappNumber || typeof whatsappNumber !== 'string') {
      return NextResponse.json({ success: false, message: 'whatsappNumber is required' }, { status: 400 });
    }
    if (!callNumber || typeof callNumber !== 'string') {
      return NextResponse.json({ success: false, message: 'callNumber is required' }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${token.value}`,
      },
      body: JSON.stringify({ productId, quantity, whatsappNumber, callNumber, hall, message }),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || 'Failed to place order' },
        { status: res.status },
      );
    }
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error('Orders POST error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
