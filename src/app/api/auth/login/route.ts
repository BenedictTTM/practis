import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const beRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await beRes.json();

    // Create Next.js response with backend status code
    const nextRes = NextResponse.json(data, { status: beRes.status });

    // Forward all Set-Cookie headers from backend to browser
    // Some runtimes expose getSetCookie(), otherwise get single header
    const anyHeaders: any = beRes.headers as any;
    const setCookies: string[] | undefined = anyHeaders.getSetCookie?.();

    if (Array.isArray(setCookies) && setCookies.length > 0) {
      for (const c of setCookies) {
        nextRes.headers.append('Set-Cookie', c);
      }
    } else {
      const single = beRes.headers.get('set-cookie');
      if (single) {
        nextRes.headers.set('Set-Cookie', single);
      }
    }

    return nextRes;
  } catch (error) {
    console.error('💥 /api/auth/login proxy error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
