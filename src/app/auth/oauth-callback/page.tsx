'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/Components/Toast/toast';

/**
 * OAuth Callback Handler
 * 
 * Handles the redirect after successful OAuth authentication.
 * The backend will redirect here with success/error status.
 * 
 * Flow:
 * 1. Backend OAuth callback processes authentication
 * 2. Backend sets HTTP-only cookies (access_token, refresh_token)
 * 3. Backend redirects to this page with status
 * 4. This page shows success/error message
 * 5. Redirects to dashboard/home
 * 
 * @page
 */
export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const oauthStatus = searchParams.get('oauth');
    const errorMessage = searchParams.get('message');

    console.log('🔍 [OAUTH-CALLBACK] Processing OAuth callback');
    console.log('🔍 [OAUTH-CALLBACK] Status:', oauthStatus);
    console.log('🔍 [OAUTH-CALLBACK] Error message:', errorMessage);
    console.log('🍪 [OAUTH-CALLBACK] Document cookies:', document.cookie);

    if (oauthStatus === 'success') {
      console.log('✅ [OAUTH-CALLBACK] OAuth success detected');
      
      // Check if cookies are present
      const hasCookies = document.cookie.includes('access_token') || document.cookie.includes('refresh_token');
      console.log('🍪 [OAUTH-CALLBACK] Has auth cookies:', hasCookies);
      console.log('🍪 [OAUTH-CALLBACK] All cookies:', document.cookie);
      
      setStatus('success');
      showSuccess('Welcome!', {
        description: 'You have successfully logged in with Google.',
      });

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        console.log('🧭 [OAUTH-CALLBACK] Redirecting to /main/products');
        router.push('/main/products');
      }, 1500);
    } else if (errorMessage) {
      console.error('❌ [OAUTH-CALLBACK] OAuth error:', decodeURIComponent(errorMessage));
      setStatus('error');
      showError('Authentication Failed', {
        description: decodeURIComponent(errorMessage),
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        console.log('🧭 [OAUTH-CALLBACK] Redirecting to /auth/login');
        router.push('/auth/login');
      }, 3000);
    } else {
      console.warn('⚠️ [OAUTH-CALLBACK] No OAuth status found, redirecting home');
      // No status found, redirect to home
      router.push('/');
    }
  }, [searchParams, router, showSuccess, showError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <>
            {/* Loading State */}
            <div className="flex justify-center mb-6">
              <svg
                className="animate-spin h-16 w-16 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Completing Sign In...
            </h2>
            <p className="text-gray-600">
              Please wait while we set up your account.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            {/* Success State */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600 mb-4">
              You have successfully signed in with Google.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting to your dashboard...
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            {/* Error State */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {searchParams.get('message') || 'Something went wrong during sign in.'}
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
