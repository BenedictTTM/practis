'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingCart as CartIcon } from 'lucide-react';
import { DotLoader } from '@/Components/Loaders';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '@/lib/cart';
import { 
  getLocalCartData, 
  updateLocalCartItem, 
  removeFromLocalCart, 
  clearLocalCart,
  calculateLocalCartSubtotal 
} from '@/lib/localCart';
import { AuthService } from '@/lib/auth';
import { Cart } from '@/types/cart';
import { CartItemsList, OrderSummary, DisplayCartItem , EmptyState as EmptyCartState , CartHeader  } from '@/Components/Cart';


export default function ShoppingCart() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [displayItems, setDisplayItems] = useState<DisplayCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<number | string>>(new Set());

  // Check authentication and load appropriate cart on mount
  useEffect(() => {
    initializeCart();
  }, []);

  const initializeCart = async () => {
    setLoading(true);
    setError(null);

    // Check if user is authenticated
    const authenticated = await AuthService.isAuthenticated();
    setIsAuthenticated(authenticated);

    if (authenticated) {
      // Load server-side cart for authenticated users
      await loadServerCart();
    } else {
      // Load local storage cart for anonymous users
      loadLocalCart();
    }

    setLoading(false);
  };

  const loadServerCart = async () => {
    const result = await fetchCart();

    if (result.success && result.data) {
      setCart(result.data);
      // Convert server cart to display format
      const items: DisplayCartItem[] = result.data.items.map(item => ({
        id: item.id,
        productId: item.product.id,
        quantity: item.quantity,
        product: item.product,
      }));
      setDisplayItems(items);
    } else {
      // User is authenticated but has no cart or error occurred
      setCart(null);
      setDisplayItems([]);
      if (result.message && !result.message.includes('Cart not found')) {
        setError(result.message || 'Failed to load cart');
      }
    }
  };

  const loadLocalCart = () => {
    const localCart = getLocalCartData();
    
    // Convert local cart to display format
    const items: DisplayCartItem[] = localCart.items.map(item => ({
      id: `local-${item.productId}`, // Use string ID for local items
      productId: item.productId,
      quantity: item.quantity,
      product: item.product,
    }));
    
    setDisplayItems(items);
    console.log('📦 Loaded local cart:', { itemCount: items.length });
  };

  const handleUpdateQuantity = async (itemId: number | string, productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));

    if (isAuthenticated && typeof itemId === 'number') {
      // Update server cart
      const result = await updateCartItem(itemId, newQuantity);

      if (result.success && result.data) {
        setCart(result.data);
        const items: DisplayCartItem[] = result.data.items.map(item => ({
          id: item.id,
          productId: item.product.id,
          quantity: item.quantity,
          product: item.product,
        }));
        setDisplayItems(items);
      } else {
        setError(result.message || 'Failed to update quantity');
      }
    } else {
      // Update local cart
      const updatedCart = updateLocalCartItem(productId, newQuantity);
      const items: DisplayCartItem[] = updatedCart.items.map(item => ({
        id: `local-${item.productId}`,
        productId: item.productId,
        quantity: item.quantity,
        product: item.product,
      }));
      setDisplayItems(items);
    }

    setUpdatingItems(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  const handleRemoveItem = async (itemId: number | string, productId: number) => {
    if (!confirm('Remove this item from cart?')) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));

    if (isAuthenticated && typeof itemId === 'number') {
      // Remove from server cart
      const result = await removeCartItem(itemId);

      if (result.success) {
        setCart(result.data || null);
        if (result.data) {
          const items: DisplayCartItem[] = result.data.items.map(item => ({
            id: item.id,
            productId: item.product.id,
            quantity: item.quantity,
            product: item.product,
          }));
          setDisplayItems(items);
        } else {
          setDisplayItems([]);
        }
      } else {
        setError(result.message || 'Failed to remove item');
      }
    } else {
      // Remove from local cart
      const updatedCart = removeFromLocalCart(productId);
      const items: DisplayCartItem[] = updatedCart.items.map(item => ({
        id: `local-${item.productId}`,
        productId: item.productId,
        quantity: item.quantity,
        product: item.product,
      }));
      setDisplayItems(items);
    }

    setUpdatingItems(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      router.push('/auth/login?redirect=/main/cart&checkout=true');
      return;
    }

    // User is authenticated, proceed to checkout
    router.push('/main/checkout');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <DotLoader size={48} color="#E43C3C" ariaLabel="Loading cart" />
          <p className="text-gray-600 mt-4">Loading cart...</p>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = isAuthenticated 
    ? (cart?.subtotal || 0)
    : calculateLocalCartSubtotal();
  const hasItems = displayItems.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {hasItems ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2 w-full min-w-0">
              <CartHeader />
              
              <AuthStatusBanner isAuthenticated={isAuthenticated} />
              
              <ErrorMessage error={error} />
              
              <CartItemsList
                items={displayItems}
                updatingItems={updatingItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1 w-full min-w-0">
              <OrderSummary
                subtotal={subtotal}
                isAuthenticated={isAuthenticated || false}
                onCheckout={handleCheckout}
                className="lg:sticky lg:top-8"
              />
            </div>
          </div>
        ) : (
          <EmptyCartState />
        )}
      </div>
    </div>
  );
}

function AuthStatusBanner({ isAuthenticated }: { isAuthenticated: boolean | null }) {
  if (isAuthenticated) return null;

  return (
    <div className="mb-3 sm:mb-4 p-3 sm:py-2 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-800 text-xs">
        Browsing as a guest.{' '}
        <Link href="/auth/login" className="font-semibold underline hover:text-red-900">
          Sign in
        </Link>{' '}
        to sync your cart.
      </p>
    </div>
  );
}

/**
 * ErrorMessage - Displays error messages when operations fail
 */
function ErrorMessage({ error }: { error: string | null }) {
  if (!error) return null;

  return (
    <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600 text-xs sm:text-sm break-words">{error}</p>
    </div>
  );
}

