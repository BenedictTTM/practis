/**
 * DotLoader Component
 * 
 * Professional loading indicator using react-spinners DotLoader.
 * Follows accessibility best practices and design system standards.
 * 
 * @module DotLoader
 */

'use client';

import React from 'react';
import { ClipLoader as ReactSpinnerDotLoader } from 'react-spinners';
import type { CSSProperties } from 'react';
 

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface DotLoaderProps {
  /** Size of the loader. Can be number (px) or string with unit */
  size?: number | string;
  /** Hex code for loader color */
  color?: string;
  /** Controls whether loader is shown */
  loading?: boolean;
  /** Override default styles (camelCase keys) */
  cssOverride?: CSSProperties;
  /** Controls animation speed (higher = faster) */
  speedMultiplier?: number;
  /** Optional label for screen readers */
  ariaLabel?: string;
  /** Optional className for container */
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_CONFIG = {
  SIZE: 60,
  COLOR: '#E43C3C', // Brand red color
  SPEED_MULTIPLIER: 1,
} as const;

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * DotLoader Component
 * 
 * A modern, accessible loading indicator with smooth animations.
 * 
 * @example
 * // Basic usage
 * <DotLoader />
 * 
 * @example
 * // Custom styling
 * <DotLoader 
 *   size={80} 
 *   color="#0066CC" 
 *   speedMultiplier={1.5}
 * />
 * 
 * @example
 * // Conditional rendering
 * <DotLoader loading={isLoading} />
 */
export default function DotLoader({
  size = DEFAULT_CONFIG.SIZE,
  color = DEFAULT_CONFIG.COLOR,
  loading = true,
  cssOverride = {},
  speedMultiplier = DEFAULT_CONFIG.SPEED_MULTIPLIER,
  ariaLabel = 'Loading',
  className = '',
}: DotLoaderProps) {
  // Don't render if loading is false
  if (!loading) return null;

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <ReactSpinnerDotLoader
        size={size}
        color={color}
        loading={loading}
        cssOverride={cssOverride}
        speedMultiplier={speedMultiplier}
        aria-label={ariaLabel}
      />
      {/* Screen reader text */}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}

// ============================================================================
// PRESET VARIANTS
// ============================================================================

/**
 * Small loader variant (40px)
 */
export const DotLoaderSmall: React.FC<Omit<DotLoaderProps, 'size'>> = (props) => (
  <DotLoader {...props} size={40} />
);

/**
 * Large loader variant (80px)
 */
export const DotLoaderLarge: React.FC<Omit<DotLoaderProps, 'size'>> = (props) => (
  <DotLoader {...props} size={80} />
);

/**
 * Primary brand color loader
 */
export const DotLoaderPrimary: React.FC<DotLoaderProps> = (props) => (
  <DotLoader {...props} color="#E43C3C" />
);

/**
 * Secondary/neutral color loader
 */
export const DotLoaderSecondary: React.FC<DotLoaderProps> = (props) => (
  <DotLoader {...props} color="#6B7280" />
);

// ============================================================================
// EXPORTS
// ============================================================================

export { DotLoader };
