import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Authentication Middleware
 * 
 * Protects routes by checking for authentication token in cookies.
 * Redirects unauthenticated users to login page while preserving intended destination.
 * 
 * @author Senior Software Engineer
 * @version 1.0.0
 */

// Define protected route patterns
const PROTECTED_ROUTES = [
  '/main',
  '/accounts',
  '/api/cart',
  '/api/products/me',
];

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/signup',
  '/main/auth/login',
  '/main/auth/signUp',
  '/main/reset-password',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/main/auth/forgot-password',
  '/',
];

// API routes that should not redirect but return 401
const API_ROUTES = ['/api'];

/**
 * Check if a path matches any pattern in the list
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => pathname.startsWith(route));
}

/**
 * Middleware function to handle authentication
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get access token from cookies
  const accessToken = request.cookies.get('access_token');
  const isAuthenticated = !!accessToken;

  // Check if route is protected
  const isProtectedRoute = matchesRoute(pathname, PROTECTED_ROUTES);
  const isPublicRoute = matchesRoute(pathname, PUBLIC_ROUTES);
  const isApiRoute = matchesRoute(pathname, API_ROUTES);

  // Skip middleware for public routes and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    isPublicRoute
  ) {
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute && !isAuthenticated) {
    // For API routes, return 401 Unauthorized
    if (isApiRoute) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

  // For page routes, redirect to sign-up with return URL
  const signupUrl = new URL('/main/auth/signUp', request.url);
  signupUrl.searchParams.set('redirect', pathname);
    
  const response = NextResponse.redirect(signupUrl);
    
    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    return response;
  }

  // If authenticated and trying to access auth pages, redirect to main
  if (
    isAuthenticated &&
    (pathname.startsWith('/auth/') || pathname.startsWith('/main/auth/'))
  ) {
    return NextResponse.redirect(new URL('/main/products', request.url));
  }

  // Allow request to proceed
  const response = NextResponse.next();
  
  // Add security headers to all responses
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
