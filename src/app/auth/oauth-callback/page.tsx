'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/Components/Toast/toast';
import { mergeAnonymousCart, hasLocalCartItems } from '@/lib/cartMerge';

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
 * 4. This page merges anonymous cart if exists
 * 5. Shows success/error message
 * 6. Redirects to dashboard/home
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

      // Handle cart merge for users with local cart items
      const handleCartMergeAndRedirect = async () => {
        const hadLocalCart = hasLocalCartItems();
        
        if (hadLocalCart) {
          console.log('🛒 [OAUTH-CALLBACK] Local cart detected, merging...');
          const mergeResult = await mergeAnonymousCart();
          
          if (mergeResult.success && mergeResult.itemCount! > 0) {
            showSuccess('Welcome!', {
              description: `You have successfully logged in with Google. ${mergeResult.message}`,
            });
          } else {
            showSuccess('Welcome!', {
              description: 'You have successfully logged in with Google.',
            });
          }
        } else {
          showSuccess('Welcome!', {
            description: 'You have successfully logged in with Google.',
          });
        }

        // Redirect to dashboard after showing message
        setTimeout(() => {
          console.log('🧭 [OAUTH-CALLBACK] Redirecting to /main/products');
          router.push('/main/products');
        }, 1500);
      };

      handleCartMergeAndRedirect();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8 md:p-10 text-center transform transition-all duration-300 hover:shadow-3xl">
        {status === 'loading' && (
          <>
            {/* Loading State */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <svg
                className="animate-spin h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 text-red-600"
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
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Completing Sign In...
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Please wait while we set up your account.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            {/* Success State */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-red-50 rounded-full flex items-center justify-center ring-4 ring-red-100 transition-transform duration-300 hover:scale-110">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-600"
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
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Welcome Back!
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              You have successfully signed in with Google.
            </p>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
              <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Redirecting to your dashboard...</span>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            {/* Error State */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-red-50 rounded-full flex items-center justify-center ring-4 ring-red-100 transition-transform duration-300 hover:scale-110">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-600"
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
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Authentication Failed
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
              {searchParams.get('message') || 'Something went wrong during sign in.'}
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-red-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
