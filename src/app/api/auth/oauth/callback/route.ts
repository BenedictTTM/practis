import { NextRequest, NextResponse } from 'next/server';

/**
 * OAuth Callback Proxy
 * 
 * This route receives OAuth tokens from the backend and sets them as
 * same-origin cookies on the frontend domain.
 * 
 * Flow:
 * 1. Backend OAuth callback generates tokens
 * 2. Backend redirects HERE with tokens in URL
 * 3. This proxy extracts tokens and sets them as HTTP-only cookies
 * 4. Redirects to the OAuth callback page
 * 
 * This solves cross-origin cookie issues where cookies from backend domain
 * (onrender.com) cannot be accessed by frontend domain (vercel.app).
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const oauthStatus = searchParams.get('oauth');
  const tokensParam = searchParams.get('tokens');
  const errorMessage = searchParams.get('message');

  console.log('🔄 [OAUTH-PROXY] Processing OAuth callback');
  console.log('📊 [OAUTH-PROXY] Status:', oauthStatus);
  console.log('🔑 [OAUTH-PROXY] Has tokens:', !!tokensParam);
  console.log('❌ [OAUTH-PROXY] Error:', errorMessage);

  try {
    if (oauthStatus === 'success' && tokensParam) {
      // Decode tokens from URL
      const tokens = JSON.parse(decodeURIComponent(tokensParam));
      
      console.log('✅ [OAUTH-PROXY] Tokens received');
      console.log('🔑 [OAUTH-PROXY] Access token length:', tokens.access_token?.length);
      console.log('🔑 [OAUTH-PROXY] Refresh token length:', tokens.refresh_token?.length);

      // Create response with redirect
      const response = NextResponse.redirect(
        new URL('/auth/oauth-callback?oauth=success', request.url)
      );

      // Set tokens as HTTP-only cookies on the frontend domain
      // These cookie settings match what the backend would set
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax' as const, // Same-origin now, so 'lax' works
        path: '/',
      };

      // Access token (45 minutes)
      response.cookies.set('access_token', tokens.access_token, {
        ...cookieOptions,
        maxAge: 45 * 60, // 45 minutes in seconds
      });

      // Refresh token (7 days)
      response.cookies.set('refresh_token', tokens.refresh_token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      });

      console.log('✅ [OAUTH-PROXY] Cookies set on frontend domain');
      console.log('🧭 [OAUTH-PROXY] Redirecting to /auth/oauth-callback');

      return response;
    }

    // OAuth failed or no tokens - redirect with error
    const redirectUrl = errorMessage
      ? `/auth/oauth-callback?message=${errorMessage}`
      : '/auth/oauth-callback?message=Authentication failed';

    console.log('⚠️ [OAUTH-PROXY] No tokens or OAuth failed, redirecting to:', redirectUrl);
    
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error('❌ [OAUTH-PROXY] Error in OAuth callback proxy:', error);
    
    return NextResponse.redirect(
      new URL('/auth/oauth-callback?message=OAuth proxy error', request.url)
    );
  }
}
