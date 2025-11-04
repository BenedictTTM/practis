import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:3001';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please log in' },
        { status: 401 },
      );
    }

    const resp = await fetch(`${BACKEND_URL}/orders/seller`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `access_token=${token.value}`,
      },
      // Ensure cookies are forwarded, though we pass them explicitly
      cache: 'no-store',
    });

    const text = await resp.text();
    const data = text ? JSON.parse(text) : null;

    if (!resp.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || 'Failed to fetch seller orders' },
        { status: resp.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Seller orders proxy error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
