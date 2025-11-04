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
    const refreshToken = cookieStore.get('refresh_token');

    console.log('🧭 [CART-MERGE] Incoming cookies:', {
      hasAccess: !!accessToken?.value,
      accessLen: accessToken?.value?.length || 0,
      hasRefresh: !!refreshToken?.value,
      refreshLen: refreshToken?.value?.length || 0,
    });

    // Get items from request body
    const body = await request.json().catch(() => ({}));
    const { items } = body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.warn('⚠️  [CART-MERGE] No items provided for merge');
      return NextResponse.json(
        { message: 'No items to merge' },
        { status: 400 }
      );
    }

    // Helper to build Cookie header
    const buildCookieHeader = (access?: string, refresh?: string) => {
      const parts: string[] = [];
      if (access) parts.push(`access_token=${access}`);
      if (refresh) parts.push(`refresh_token=${refresh}`);
      return parts.join('; ');
    };

    // Helper to forward Set-Cookie headers from backend response to Next response
    const forwardSetCookies = (beRes: Response, nextRes: NextResponse) => {
      const anyHeaders: any = beRes.headers as any;
      const setCookies: string[] | undefined = anyHeaders.getSetCookie?.();
      if (Array.isArray(setCookies) && setCookies.length > 0) {
        console.log(`🍪 [CART-MERGE] Forwarding ${setCookies.length} Set-Cookie headers`);
        for (const c of setCookies) nextRes.headers.append('Set-Cookie', c);
      } else {
        const single = beRes.headers.get('set-cookie');
        if (single) {
          console.log('🍪 [CART-MERGE] Forwarding single Set-Cookie header');
          nextRes.headers.set('Set-Cookie', single);
        }
      }
    };

    // If no access token but we have a refresh token, try refresh first
    let effectiveAccess = accessToken?.value;
    if (!effectiveAccess && refreshToken?.value) {
      console.log('🔄 [CART-MERGE] No access token. Attempting token refresh using refresh_token...');
      const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Cookie': buildCookieHeader(undefined, refreshToken.value),
        },
      });

      const refreshText = await refreshRes.text();
      console.log('📡 [CART-MERGE] Refresh status:', refreshRes.status, refreshRes.statusText);
      if (!refreshRes.ok) {
        console.error('❌ [CART-MERGE] Refresh failed:', refreshText);
        return NextResponse.json({ message: 'Unauthorized - Please log in' }, { status: 401 });
      }

      // Build a response to capture and forward cookies
      const temp = NextResponse.json({ success: true }, { status: 200 });
      forwardSetCookies(refreshRes, temp);

      // Try to read back the new access token from the Set-Cookie headers is not possible here,
      // but backend will accept the Cookie header we send next as long as browser stores it.
      // For this server-to-server call, we must re-read cookies (not available yet). Fall back to using refresh again
      // if access stays undefined. We'll proceed to call merge with refresh too so backend can rotate again if needed.
      effectiveAccess = accessToken?.value; // keep as-is; rely on refresh on next call
    }

    const cookieHeader = buildCookieHeader(effectiveAccess, refreshToken?.value);

    console.log('🔄 [CART-MERGE] Forwarding request to backend:', {
      url: `${BACKEND_URL}/cart/merge`,
      itemCount: items.length,
      includeAccess: !!effectiveAccess,
      includeRefresh: !!refreshToken?.value,
    });

    // Send merge request to backend
    let beRes = await fetch(`${BACKEND_URL}/cart/merge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { 'Cookie': cookieHeader } : {}),
      },
      body: JSON.stringify({ items }),
    });

    let beText = await beRes.text();
    let beData: any = undefined;
    try { beData = beText ? JSON.parse(beText) : null; } catch { beData = { message: beText }; }

    // Handle 401 by attempting a refresh + retry (if we have refresh token)
    if (beRes.status === 401 && refreshToken?.value) {
      console.warn('🟡 [CART-MERGE] Received 401 from backend. Attempting token refresh then retry...');
      const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Cookie': buildCookieHeader(undefined, refreshToken.value),
        },
      });

      const refreshOk = refreshRes.ok;
      console.log('📡 [CART-MERGE] Refresh attempt status:', refreshRes.status, refreshRes.statusText);

      // Prepare final response (so we can forward cookies)
      const retryShell = NextResponse.json({ success: false }, { status: 200 });
      forwardSetCookies(refreshRes, retryShell);

      if (refreshOk) {
        // Retry merge without early access to new cookie values; still forward refresh token, backend should accept
        beRes = await fetch(`${BACKEND_URL}/cart/merge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': buildCookieHeader(undefined, refreshToken.value),
          },
          body: JSON.stringify({ items }),
        });
        beText = await beRes.text();
        try { beData = beText ? JSON.parse(beText) : null; } catch { beData = { message: beText }; }

        if (!beRes.ok) {
          console.error('❌ [CART-MERGE] Retry failed:', { status: beRes.status, body: beData });
          const final = NextResponse.json(
            { message: beData?.message || 'Failed to merge cart after refresh' },
            { status: beRes.status }
          );
          // attach any cookies we got
          forwardSetCookies(refreshRes, final);
          return final;
        }

        console.log('✅ [CART-MERGE] Merge succeeded after refresh');
        const final = NextResponse.json(beData, { status: 200 });
        forwardSetCookies(refreshRes, final);
        return final;
      } else {
        console.error('❌ [CART-MERGE] Refresh failed, cannot retry merge');
        return NextResponse.json({ message: 'Unauthorized - Please log in' }, { status: 401 });
      }
    }

    if (!beRes.ok) {
      console.error('❌ [CART-MERGE] Backend error:', {
        status: beRes.status,
        message: beData?.message,
        body: beText?.substring?.(0, 200),
      });
      return NextResponse.json(
        { message: beData?.message || 'Failed to merge cart' },
        { status: beRes.status }
      );
    }

    console.log('✅ [CART-MERGE] Cart merged successfully');
    return NextResponse.json(beData, { status: 200 });
  } catch (error: any) {
    console.error('💥 [CART-MERGE] Server error:', error);
    return NextResponse.json(
      { message: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
