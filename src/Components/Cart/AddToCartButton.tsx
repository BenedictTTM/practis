'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { addToCart } from '@/lib/cart';

interface AddToCartButtonProps {
  productId: number;
  quantity?: number;
  variant?: 'default' | 'icon' | 'small';
  className?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

/**
 * AddToCartButton Component
 * 
 * Reusable button for adding products to cart.
 * Handles loading states, success feedback, and error handling.
 * Supports multiple visual variants.
 * 
 * @component
 * @example
 * ```tsx
 * <AddToCartButton 
 *   productId={123} 
 *   quantity={1}
 *   onSuccess={() => console.log('Added!')}
 * />
 * ```
 */
export default function AddToCartButton({
  productId,
  quantity = 1,
  variant = 'default',
  className = '',
  onSuccess,
  onError,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    setSuccess(false);

    const result = await addToCart(productId, quantity);

    if (result.success) {
      setSuccess(true);
      onSuccess?.();
      
      // Reset success state after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } else {
      onError?.(result.message || 'Failed to add to cart');
    }

    setLoading(false);
  };

  // Icon variant - small circular button
  if (variant === 'icon') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading || success}
        className={`rounded-full p-2 bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label="Add to cart"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : success ? (
          <Check className="h-5 w-5" />
        ) : (
          <ShoppingCart className="h-5 w-5" />
        )}
      </button>
    );
  }

  // Small variant - compact button
  if (variant === 'small') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading || success}
        className={`flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : success ? (
          <>
            <Check className="h-4 w-4" />
            Added!
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </>
        )}
      </button>
    );
  }

  // Default variant - full-width button
  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || success}
      className={`w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Adding to Cart...
        </>
      ) : success ? (
        <>
          <Check className="h-5 w-5" />
          Added to Cart!
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </>
      )}
    </button>
  );
}
