'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingCart as CartIcon } from 'lucide-react';
import SharedLoading from '@/Components/Loaders/SharedLoading';
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
  const [selectedItemId, setSelectedItemId] = useState<number | string | null>(null);

  // Check authentication and load appropriate cart on mount
  useEffect(() => {
    initializeCart();
  }, []);

  const initializeCart = async () => {
    console.log('🔄 Initializing cart...');
    setLoading(true);
    setError(null);

    // Check if user is authenticated
    const authenticated = await AuthService.isAuthenticated();
    console.log('👤 Authentication status:', authenticated);
    setIsAuthenticated(authenticated);

    if (authenticated) {
      console.log('📡 Loading server-side cart...');
      // Load server-side cart for authenticated users
      await loadServerCart();
    } else {
      console.log('💾 Loading local storage cart...');
      // Load local storage cart for anonymous users
      loadLocalCart();
    }

    setLoading(false);
    console.log('✅ Cart initialization complete');
  };

  const loadServerCart = async () => {
    console.log('📥 Fetching cart from server...');
    const result = await fetchCart();
    console.log('📦 Server cart result:', {
      success: result.success,
      hasData: !!result.data,
      itemCount: result.data?.items?.length || 0,
      message: result.message,
    });

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
      console.log('✅ Server cart loaded successfully:', items.length, 'items');
    } else {
      // User is authenticated but has no cart or error occurred
      setCart(null);
      setDisplayItems([]);
      console.log('⚠️ No server cart found or error occurred');
      if (result.message && !result.message.includes('Cart not found')) {
        console.error('❌ Cart loading error:', result.message);
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
    console.log('🛒 === CHECKOUT PROCESS STARTED ===');
    console.log('📊 Current State:', {
      isAuthenticated,
      hasItems: displayItems.length > 0,
      itemCount: displayItems.length,
      subtotal,
      cartId: cart?.id,
      selectedItemId,
    });

    if (!isAuthenticated) {
      console.log('🔐 User not authenticated - Redirecting to login');
      router.push('/auth/login?redirect=/main/cart&checkout=true');
      return;
    }

    console.log('✅ User is authenticated');

    // Check if cart has items
    if (displayItems.length === 0) {
      console.error('❌ Cannot checkout - Cart is empty');
      setError('Your cart is empty. Please add items before checkout.');
      return;
    }

    console.log('📦 Cart Items:', displayItems.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.product?.title,
      quantity: item.quantity,
      price: item.product?.discountedPrice || item.product?.originalPrice,
    })));

    // For single-product orders, redirect to checkout with product info
    if (displayItems.length === 1) {
      const item = displayItems[0];
      console.log('🎯 Single item checkout - Redirecting to product checkout');
      console.log('Product ID:', item.productId);
      console.log('Quantity:', item.quantity);
      
      const checkoutUrl = `/main/checkout?productId=${item.productId}&quantity=${item.quantity}`;
      console.log('🔗 Checkout URL:', checkoutUrl);
      
      router.push(checkoutUrl);
      return;
    }

    // Multiple items - check if one is selected
    if (selectedItemId) {
      const selectedItem = displayItems.find(item => item.id === selectedItemId);
      if (selectedItem) {
        console.log('🎯 Selected item checkout');
        console.log('Product ID:', selectedItem.productId);
        console.log('Quantity:', selectedItem.quantity);
        
        const checkoutUrl = `/main/checkout?productId=${selectedItem.productId}&quantity=${selectedItem.quantity}`;
        console.log('🔗 Checkout URL:', checkoutUrl);
        
        router.push(checkoutUrl);
        return;
      }
    }

    // Multiple items but none selected
    console.warn('⚠️ Multiple items in cart - No item selected');
    
    setError(
      'Please select an item to checkout by clicking the radio button next to the product.'
    );
    
    console.log('🛒 === CHECKOUT PROCESS COMPLETED ===');
  };
  // Per-item checkout flow removed: users select exactly one item, then use single checkout

  // Show the shared route loading UI while cart initializes
  if (loading) {
    return <SharedLoading size={64} color="#E43C3C" message="Loading your cart..." subMessage="Just a moment" />;
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
                selectedItemId={selectedItemId}
                onSelectItem={setSelectedItemId}
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
    <div className="mb-3 sm:mb-4 p-3 sm:py-2  ">
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

