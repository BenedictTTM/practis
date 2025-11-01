'use client';

import React, { useState } from 'react';

/**
 * Google OAuth Sign-In Button Component
 * 
 * Enterprise-grade OAuth button following Material Design principles.
 * 
 * Features:
 * - Branded Google design guidelines
 * - Loading states
 * - Error handling
 * - Accessible (ARIA labels)
 * - Responsive design
 * - Production-ready
 * 
 * Security:
 * - Initiates OAuth flow via backend
 * - State parameter for CSRF protection (handled by backend)
 * - HTTP-only cookies for tokens
 * 
 * @component
 */

interface GoogleSignInButtonProps {
  /**
   * Button text - defaults to "Continue with Google"
   */
  text?: string;
  
  /**
   * Button variant - outline or filled
   */
  variant?: 'outline' | 'filled';
  
  /**
   * Full width button
   */
  fullWidth?: boolean;
  
  /**
   * Custom CSS classes
   */
  className?: string;
  
  /**
   * Callback when OAuth flow initiates
   */
  onOAuthStart?: () => void;
  
  /**
   * Callback on error
   */
  onError?: (error: Error) => void;
}

export function GoogleSignInButton({
  text = 'Continue with Google',
  variant = 'outline',
  fullWidth = true,
  className = '',
  onOAuthStart,
  onError,
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Initiates Google OAuth flow
   * 
   * Flow:
   * 1. User clicks button
   * 2. Redirect to backend OAuth endpoint
   * 3. Backend redirects to Google OAuth
   * 4. User authorizes on Google
   * 5. Google redirects back to backend callback
   * 6. Backend creates/updates user
   * 7. Backend sets auth cookies
   * 8. Backend redirects to frontend dashboard
   */
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Notify parent component
      onOAuthStart?.();

      // Get backend URL from environment
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 
                        process.env.NEXT_PUBLIC_BACKEND_URL || 
                        'http://localhost:3001';

      console.log('🔐 [OAUTH] Initiating Google OAuth flow...');
      console.log('🔗 [OAUTH] Backend URL:', backendUrl);

      // Redirect to backend OAuth endpoint
      // Backend will handle the OAuth flow and redirect back
      window.location.href = `${backendUrl}/auth/oauth/google`;

    } catch (error) {
      console.error('❌ [OAUTH] Failed to initiate OAuth:', error);
      setIsLoading(false);
      
      // Notify parent of error
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };

  // Variant styles
  const variantStyles = {
    outline: 'border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
    filled: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm',
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`
        flex items-center justify-center gap-3 px-4 py-3 rounded-lg
        font-medium text-sm transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      aria-label="Sign in with Google"
    >
      {/* Google Logo SVG */}
      {!isLoading && (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19.8055 10.2292C19.8055 9.55558 19.7502 8.87892 19.6326 8.21484H10.2002V12.0493H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0879V17.5866H16.8251C18.7176 15.8449 19.8055 13.2728 19.8055 10.2292Z"
            fill="#4285F4"
          />
          <path
            d="M10.2002 20.0006C12.9511 20.0006 15.2726 19.1151 16.8287 17.5865L13.6061 15.0879C12.7096 15.6979 11.5523 16.0433 10.2038 16.0433C7.54352 16.0433 5.28958 14.2834 4.50075 11.9097H1.18262V14.4844C2.78074 17.6475 6.30865 20.0006 10.2002 20.0006Z"
            fill="#34A853"
          />
          <path
            d="M4.49713 11.9097C4.08069 10.668 4.08069 9.33564 4.49713 8.09389V5.51923H1.18262C-0.292669 8.43897 -0.292669 11.564 1.18262 14.4844L4.49713 11.9097Z"
            fill="#FBBC04"
          />
          <path
            d="M10.2002 3.95805C11.6246 3.936 13.0009 4.47247 14.0365 5.45722L16.8907 2.60218C15.1826 0.990488 12.9365 0.0809842 10.2002 0.104849C6.30865 0.104849 2.78074 2.45802 1.18262 5.51917L4.49713 8.09383C5.28233 5.71645 7.53989 3.95805 10.2002 3.95805Z"
            fill="#EA4335"
          />
        </svg>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5 text-gray-600"
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
      )}

      {/* Button Text */}
      <span className="font-medium">
        {isLoading ? 'Redirecting to Google...' : text}
      </span>
    </button>
  );
}

/**
 * Compact Google Sign-In Button (Icon Only)
 * 
 * Useful for secondary actions or mobile layouts
 */
export function GoogleSignInIconButton({
  onOAuthStart,
  onError,
  className = '',
}: Pick<GoogleSignInButtonProps, 'onOAuthStart' | 'onError' | 'className'>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      onOAuthStart?.();

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 
                        process.env.NEXT_PUBLIC_BACKEND_URL || 
                        'http://localhost:3001';

      window.location.href = `${backendUrl}/auth/oauth/google`;
    } catch (error) {
      console.error('❌ [OAUTH] Failed to initiate OAuth:', error);
      setIsLoading(false);
      
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`
        p-3 rounded-full border-2 border-gray-300 bg-white
        hover:bg-gray-50 transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
      aria-label="Sign in with Google"
      title="Sign in with Google"
    >
      {isLoading ? (
        <svg
          className="animate-spin h-6 w-6 text-gray-600"
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
      ) : (
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
          <path
            d="M19.8055 10.2292C19.8055 9.55558 19.7502 8.87892 19.6326 8.21484H10.2002V12.0493H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0879V17.5866H16.8251C18.7176 15.8449 19.8055 13.2728 19.8055 10.2292Z"
            fill="#4285F4"
          />
          <path
            d="M10.2002 20.0006C12.9511 20.0006 15.2726 19.1151 16.8287 17.5865L13.6061 15.0879C12.7096 15.6979 11.5523 16.0433 10.2038 16.0433C7.54352 16.0433 5.28958 14.2834 4.50075 11.9097H1.18262V14.4844C2.78074 17.6475 6.30865 20.0006 10.2002 20.0006Z"
            fill="#34A853"
          />
          <path
            d="M4.49713 11.9097C4.08069 10.668 4.08069 9.33564 4.49713 8.09389V5.51923H1.18262C-0.292669 8.43897 -0.292669 11.564 1.18262 14.4844L4.49713 11.9097Z"
            fill="#FBBC04"
          />
          <path
            d="M10.2002 3.95805C11.6246 3.936 13.0009 4.47247 14.0365 5.45722L16.8907 2.60218C15.1826 0.990488 12.9365 0.0809842 10.2002 0.104849C6.30865 0.104849 2.78074 2.45802 1.18262 5.51917L4.49713 8.09383C5.28233 5.71645 7.53989 3.95805 10.2002 3.95805Z"
            fill="#EA4335"
          />
        </svg>
      )}
    </button>
  );
}

export default GoogleSignInButton;
