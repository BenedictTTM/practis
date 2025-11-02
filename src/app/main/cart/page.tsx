'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Minus, Plus, ArrowRight, ShoppingCart as CartIcon } from 'lucide-react';
import { DotLoader } from '@/Components/Loaders';
import Link from 'next/link';
import Image from 'next/image';
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
import { Cart, CartItem } from '@/types/cart';
import { formatGhs } from '@/utilities/formatGhs';

interface DisplayCartItem {
  id: number | string; // Can be number (server) or string (local: productId)
  productId: number;
  quantity: number;
  product: {
    id: number;
    title: string;
    imageUrl?: string[];
    originalPrice?: number;
    discountedPrice?: number;
    condition?: string;
    stock?: number;
  };
}

export default function ShoppingCart() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [displayItems, setDisplayItems] = useState<DisplayCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<number | string>>(new Set());
  const [couponCode, setCouponCode] = useState('');

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

  const handleClearCart = async () => {
    if (!confirm('Clear all items from cart?')) return;

    if (isAuthenticated) {
      // Clear server cart
      const result = await clearCart();

      if (result.success) {
        setCart(null);
        setDisplayItems([]);
      } else {
        setError(result.message || 'Failed to clear cart');
      }
    } else {
      // Clear local cart
      clearLocalCart();
      setDisplayItems([]);
    }
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
            <p className="text-gray-600">Loading cart...</p>
          </div>
      </div>
    );
  }

  // Calculate totals
  const shippingCost = 5.0;
  const subtotal = isAuthenticated 
    ? (cart?.subtotal || 0)
    : calculateLocalCartSubtotal();
  const total = subtotal + shippingCost;
  const hasItems = displayItems.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Cart Items Section */}
        {hasItems ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2 w-full min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Your Cart</h1>
                <Link
                  href="/main/products"
                  className="flex items-center gap-1 sm:gap-2 text-red-500 hover:text-red-600 font-medium transition-colors text-sm sm:text-base whitespace-nowrap flex-shrink-0"
                >
                  <span className="hidden sm:inline">Continue Shopping</span>
                  <span className="sm:hidden">Continue</span>
                  <ArrowRight size={18} className="flex-shrink-0" />
                </Link>
              </div>

              {/* Auth Status Banner for Anonymous Users */}
              {!isAuthenticated && (
                <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-xs sm:text-sm">
                    🔒 You're browsing as a guest. <Link href="/auth/login" className="font-semibold underline hover:text-blue-900">Sign in</Link> to sync your cart across devices.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-xs sm:text-sm break-words">{error}</p>
                </div>
              )}

              {/* Cart Items List */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {displayItems.map((item, index) => {
                  const isUpdating = updatingItems.has(item.id);
                  const product = item.product;
                  const imageUrl = Array.isArray(product.imageUrl)
                    ? product.imageUrl[0]
                    : product.imageUrl || '/placeholder-image.png';
                  const displayPrice = product.discountedPrice || product.originalPrice || 0;

                  return (
                    <div
                      key={item.id}
                      className={`p-3 sm:p-4 ${
                        index !== displayItems.length - 1 ? 'border-b border-gray-100' : ''
                      } ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <div className="flex gap-2 sm:gap-3 min-w-0">
                        {/* Product Image */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 truncate">
                                {product.title}
                              </h3>
                              {product.condition && (
                                <p className="text-xs text-gray-500 truncate">
                                  Color: {product.condition}
                                </p>
                              )}
                            </div>
                            {/* Delete Button - Top Right on Mobile */}
                            <button
                              onClick={() => handleRemoveItem(item.id, item.productId)}
                              disabled={isUpdating}
                              className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 flex-shrink-0 sm:hidden"
                              aria-label="Remove item"
                            >
                              {isUpdating ? (
                                <DotLoader size={16} ariaLabel="Updating item" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>

                          {/* Quantity Controls and Price */}
                          <div className="flex items-center justify-between mt-2 sm:mt-3 gap-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.productId, item.quantity - 1)}
                                disabled={isUpdating || item.quantity <= 1}
                                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-gray-300 rounded"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} className="sm:w-3.5 sm:h-3.5" />
                              </button>

                              <span className="text-xs sm:text-sm font-medium text-gray-900 w-5 sm:w-6 text-center">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.productId, item.quantity + 1)}
                                disabled={
                                  isUpdating ||
                                  (product.stock !== undefined && item.quantity >= product.stock)
                                }
                                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-gray-300 rounded"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
                              </button>
                            </div>

                            {/* Price and Delete */}
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                              <span className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                                {formatGhs(displayPrice * item.quantity)}
                              </span>
                              <button
                                onClick={() => handleRemoveItem(item.id, item.productId)}
                                disabled={isUpdating}
                                className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 hidden sm:block flex-shrink-0"
                                aria-label="Remove item"
                              >
                                {isUpdating ? (
                                  <DotLoader size={18} ariaLabel="Updating item" />
                                ) : (
                                  <Trash2 size={18} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1 w-full min-w-0">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:sticky lg:top-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

                {/* Subtotal */}
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="text-sm sm:text-base text-gray-600">Subtotal</span>
                  <span className="text-sm sm:text-base text-gray-900 font-semibold">{formatGhs(subtotal)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-600">Shipping</span>
                  <span className="text-sm sm:text-base text-gray-900 font-semibold">{formatGhs(shippingCost)}</span>
                </div>

                {/* Coupon Code */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button className="px-4 sm:px-6 py-2 bg-red-100 text-red-500 font-medium rounded-lg hover:bg-red-200 transition-colors text-sm sm:text-base whitespace-nowrap">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                  <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">{formatGhs(total)}</span>
                </div>

                {/* Checkout Button */}
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mb-3 sm:mb-4 text-sm sm:text-base shadow-sm hover:shadow-md"
                >
                  {!isAuthenticated && '🔒 '}
                  Proceed to Checkout
                  <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                </button>

                {!isAuthenticated && (
                  <p className="text-xs text-gray-500 text-center mb-3">
                    You'll be asked to sign in before checkout
                  </p>
                )}

                <Link
                  href="/main/products"
                  className="block text-center text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Empty Cart State
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-12 text-center">
            <CartIcon className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-gray-300 mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Add items to get started</p>
            <Link
              href="/main/products"
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base shadow-sm hover:shadow-md"
            >
              Start Shopping
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
