import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [PROXY] /api/auth/signup - Forwarding to backend:', `${API_URL}/auth/signup`);
    
    const body = await request.json();
    console.log('📦 [PROXY] Request body:', { ...body, password: '***' });

    const beRes = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('📡 [PROXY] Backend response status:', beRes.status, beRes.statusText);

    const data = await beRes.json();
    console.log('📦 [PROXY] Backend response data:', data);

    // Create Next.js response with backend status code
    const nextRes = NextResponse.json(data, { status: beRes.status });

    // Forward all Set-Cookie headers from backend to browser
    // Some runtimes expose getSetCookie(), otherwise get single header
    const anyHeaders: any = beRes.headers as any;
    const setCookies: string[] | undefined = anyHeaders.getSetCookie?.();

    if (Array.isArray(setCookies) && setCookies.length > 0) {
      console.log('🍪 [PROXY] Setting cookies:', setCookies.length);
      for (const c of setCookies) {
        nextRes.headers.append('Set-Cookie', c);
      }
    } else {
      const single = beRes.headers.get('set-cookie');
      if (single) {
        console.log('🍪 [PROXY] Setting single cookie');
        nextRes.headers.set('Set-Cookie', single);
      }
    }

    console.log('✅ [PROXY] Signup proxy successful');
    return nextRes;
  } catch (error) {
    console.error('💥 [PROXY] /api/auth/signup proxy error:', error);
    
    // Check if backend is unreachable
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot connect to backend at ${API_URL}. Is the backend server running?`,
          error: error.message 
        }, 
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) }, 
      { status: 500 }
    );
  }
}
