'use client';

import React, { useState } from 'react';
import { AuthService } from '@/lib/auth';
import { useToast } from '@/Components/Toast/toast';

interface LogoutButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  onLogoutStart?: () => void;
  onLogoutComplete?: () => void;
  onLogoutError?: (error: Error) => void;
}

/**
 * LogoutButton Component
 * 
 * Reusable logout button with loading state and toast notifications.
 * Handles complete logout flow including:
 * - Server-side session termination
 * - Cookie clearing
 * - Local storage cleanup
 * - Redirect to login page
 * 
 * @example
 * ```tsx
 * // Default button
 * <LogoutButton />
 * 
 * // Custom styled button
 * <LogoutButton 
 *   variant="danger" 
 *   size="lg"
 *   className="w-full"
 * >
 *   Sign Out
 * </LogoutButton>
 * 
 * // With callbacks
 * <LogoutButton 
 *   onLogoutStart={() => console.log('Logging out...')}
 *   onLogoutComplete={() => console.log('Logged out!')}
 * />
 * ```
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = '',
  variant = 'default',
  size = 'md',
  children = 'Logout',
  onLogoutStart,
  onLogoutComplete,
  onLogoutError,
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      console.log('🚪 [LOGOUT-BTN] Logout initiated');
      
      // Call optional callback
      onLogoutStart?.();

      // Perform logout
      await AuthService.logout();

      // Show success message (might not be visible due to redirect)
      showSuccess('Logged out successfully', {
        description: 'See you again soon!',
      });

      // Call optional callback
      onLogoutComplete?.();

      console.log('✅ [LOGOUT-BTN] Logout complete');

      // AuthService.logout() handles redirect, but just in case:
      // The redirect happens automatically in AuthService.logout()
      
    } catch (error) {
      console.error('💥 [LOGOUT-BTN] Logout error:', error);
      
      setIsLoggingOut(false);
      
      showError('Logout failed', {
        description: (error as Error).message || 'An error occurred during logout',
      });

      // Call optional error callback
      onLogoutError?.(error as Error);
    }
  };

  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Size variants
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Color variants
  const variantStyles = {
    default: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-gray-600 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const buttonClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={buttonClasses}
      aria-label="Logout"
    >
      {isLoggingOut ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
          Logging out...
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {children}
        </>
      )}
    </button>
  );
};

export default LogoutButton;
