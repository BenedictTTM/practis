/**
 * SimpleLoader - Lightweight CSS-only loader (~0 KB JS bundle impact)
 * Replaces react-spinners for bundle size optimization
 */

'use client';

interface SimpleLoaderProps {
  size?: number;
  ariaLabel?: string;
}

export default function SimpleLoader({ 
  size = 24, 
  ariaLabel = 'Loading' 
}: SimpleLoaderProps) {
  const sizeClass = 
    size <= 16 ? 'w-4 h-4 border-2' :
    size <= 24 ? 'w-6 h-6 border-2' :
    size <= 32 ? 'w-8 h-8 border-[3px]' :
    size <= 48 ? 'w-12 h-12 border-[3px]' :
    'w-16 h-16 border-4';

  return (
    <div 
      className={`${sizeClass} inline-block animate-spin rounded-full border-red-600 border-t-transparent`}
      role="status"
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}
