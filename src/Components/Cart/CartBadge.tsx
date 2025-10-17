'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { getCartItemCount } from '@/lib/cart';

/**
 * CartBadge Component
 * 
 * Displays shopping cart icon with item count badge.
 * Fetches count from backend on mount and refreshes periodically.
 * Shows badge only when count > 0.
 * 
 * @component
 * @example
 * ```tsx
 * <CartBadge />
 * ```
 */
export default function CartBadge() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchCount = async () => {
    const result = await getCartItemCount();
    if (result.success) {
      setCount(result.count || 0);
    }
    setLoading(false);
  };

  return (
    <Link href="/main/cart" className="relative">
      <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-red-500 transition-colors" />
      
      {!loading && count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
