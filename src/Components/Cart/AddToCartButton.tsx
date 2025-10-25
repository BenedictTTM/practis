'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Check } from 'lucide-react';
import { DotLoader } from '@/Components/Loaders';
import { addToCart } from '@/lib/cart';
import { useCartStore } from '@/store/cartStore';

interface AddToCartButtonProps {
  productId: number;
  quantity?: number;
  variant?: 'default' | 'icon' | 'small';
  className?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

/**
 * Improved AddToCartButton
 * - Prevents multi-line text wrapping
 * - Uses gradient background, smooth hover, and consistent sizing
 * - Shows loader and success feedback
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
  const router = useRouter();
  const pathname = usePathname();
  const fetchItemCount = useCartStore((state) => state.fetchItemCount);

  const handleAddToCart = async () => {
    setLoading(true);
    setSuccess(false);

    const result = await addToCart(productId, quantity);

    if (result.success) {
      setSuccess(true);
      await fetchItemCount();
      onSuccess?.();
      setTimeout(() => setSuccess(false), 2000);
    } else {
      if (result.statusCode === 401) {
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      onError?.(result.message || 'Failed to add to cart');
    }

    setLoading(false);
  };

  // Shared base styles
  const baseStyle = `
    flex items-center justify-center gap-2 
    font-semibold text-white rounded-xl 
    transition-all duration-300 shadow-md 
    hover:shadow-lg hover:-translate-y-0.5 
    disabled:opacity-50 disabled:cursor-not-allowed 
    whitespace-nowrap
  `;

  // 🔘 Icon-only button
  if (variant === 'icon') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading || success}
        className={`${baseStyle} p-3 bg-gradient-to-r from-red-500 to-red-600 ${className}`}
        aria-label="Add to cart"
      >
        {loading ? (
          <DotLoader size={18} ariaLabel="Adding to cart" />
        ) : success ? (
          <Check className="h-5 w-5 text-green-300" />
        ) : (
          <ShoppingCart className="h-5 w-5" />
        )}
      </button>
    );
  }

  // 🔹 Small variant
  if (variant === 'small') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading || success}
        className={`${baseStyle} px-6 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 ${className}`}
      >
          {loading ? (
            <>
              <DotLoader size={14} ariaLabel="Adding" />
              Adding...
            </>
          ) : success ? (
          <>
            <Check className="h-4 w-4 text-green-300" />
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

  // 🔺 Default variant
  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || success}
      className={`${baseStyle} w-full px-6 py-3 text-sm sm:text-base bg-gradient-to-r from-red-500 to-red-600 ${className}`}
    >
          {loading ? (
            <>
              <DotLoader size={18} ariaLabel="Adding to cart" />
              Adding...
            </>
          ) : success ? (
        <>
          <Check className="h-5 w-5 text-green-300" />
          Added!
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
