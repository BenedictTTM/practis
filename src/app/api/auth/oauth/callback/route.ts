import { NextRequest, NextResponse } from 'next/server';

/**
 * OAuth Callback Proxy
 * 
 * This route acts as a proxy for OAuth callbacks to properly handle cookies
 * in cross-origin scenarios (Vercel frontend + Render backend).
 * 
 * Flow:
 * 1. Backend OAuth callback redirects to THIS endpoint
 * 2. This endpoint receives the OAuth result (success/error)
 * 3. Fetches session from backend (which sets cookies)
 * 4. Forwards cookies to the browser
 * 5. Redirects to the OAuth callback page
 * 
 * This ensures cookies from backend are properly forwarded to the frontend domain.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const oauthStatus = searchParams.get('oauth');
  const errorMessage = searchParams.get('message');

  console.log('🔄 [OAUTH-PROXY] Processing OAuth callback');
  console.log('📊 [OAUTH-PROXY] Status:', oauthStatus);
  console.log('❌ [OAUTH-PROXY] Error:', errorMessage);

  try {
    if (oauthStatus === 'success') {
      // OAuth succeeded - fetch session from backend to establish cookies
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
      
      console.log('🔐 [OAUTH-PROXY] Fetching session from backend:', backendUrl);

      const sessionResponse = await fetch(`${backendUrl}/auth/session`, {
        method: 'GET',
        credentials: 'include', // Important: include credentials
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (sessionResponse.ok) {
        // Extract cookies from backend response
        const setCookieHeader = sessionResponse.headers.get('set-cookie');
        
        console.log('✅ [OAUTH-PROXY] Session fetched successfully');
        console.log('🍪 [OAUTH-PROXY] Cookies from backend:', setCookieHeader ? 'present' : 'missing');

        // Create response with redirect
        const response = NextResponse.redirect(
          new URL('/auth/oauth-callback?oauth=success', request.url)
        );

        // Forward cookies from backend to frontend
        if (setCookieHeader) {
          response.headers.set('Set-Cookie', setCookieHeader);
          console.log('✅ [OAUTH-PROXY] Cookies forwarded to frontend');
        }

        return response;
      } else {
        console.error('❌ [OAUTH-PROXY] Failed to fetch session:', sessionResponse.status);
      }
    }

    // OAuth failed or session fetch failed - redirect with error
    const redirectUrl = errorMessage
      ? `/auth/oauth-callback?message=${errorMessage}`
      : '/auth/oauth-callback?message=Authentication failed';

    console.log('🧭 [OAUTH-PROXY] Redirecting to:', redirectUrl);
    
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error('❌ [OAUTH-PROXY] Error in OAuth callback proxy:', error);
    
    return NextResponse.redirect(
      new URL('/auth/oauth-callback?message=OAuth proxy error', request.url)
    );
  }
}
