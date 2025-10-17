'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingCart as CartIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '@/lib/cart';
import { Cart, CartItem } from '@/types/cart';
import { formatGhs } from '@/utilities/formatGhs';

export default function ShoppingCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  // Fetch cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchCart();
    
    if (result.success) {
      setCart(result.data || null);
    } else {
      setError(result.message || 'Failed to load cart');
    }
    setLoading(false);
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));

    const result = await updateCartItem(itemId, newQuantity);
    
    if (result.success && result.data) {
      setCart(result.data);
    } else {
      setError(result.message || 'Failed to update quantity');
    }

    setUpdatingItems(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!confirm('Remove this item from cart?')) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));

    const result = await removeCartItem(itemId);
    
    if (result.success) {
      setCart(result.data || null);
    } else {
      setError(result.message || 'Failed to remove item');
    }

    setUpdatingItems(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  const handleClearCart = async () => {
    if (!confirm('Clear all items from cart?')) return;

    const result = await clearCart();
    
    if (result.success) {
      setCart(null);
    } else {
      setError(result.message || 'Failed to clear cart');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-lg mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-2 min-h-screen">
      <Link href='/main' className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
        <ArrowLeft size={20} />
        Back to main page
      </Link>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Cart ({cart?.totalItems || 0})
        </h1>
        {cart && cart.items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Cart Items */}
      {cart && cart.items.length > 0 ? (
        <>
          <div className="space-y-6 mb-6">
            {cart.items.map((item) => {
              const isUpdating = updatingItems.has(item.id);
              const product = item.product;
              const imageUrl = product.imageUrl?.[0] || product.images?.[0] || '/placeholder-image.png';
              const hasDiscount = product.discountedPrice && product.discountedPrice < (product.originalPrice || 0);
              const displayPrice = product.discountedPrice || product.originalPrice || 0;
              const discountPercent = hasDiscount && product.originalPrice
                ? Math.round(((product.originalPrice - (product.discountedPrice || 0)) / product.originalPrice) * 100)
                : 0;

              return (
              <div key={item.id} className={`border-b border-gray-100 pb-6 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex gap-3">
                  {/* Product Image */}
                  <Link href={`/main/products/${product.id}`} className="flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded hover:opacity-80 transition-opacity"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <Link href={`/main/products/${product.id}`}>
                      <h3 className="text-md text-gray-800 mb-1 hover:text-red-600 transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    
                    {product.condition && (
                      <p className="text-sm text-gray-500 mb-1">
                        Condition: {product.condition}
                      </p>
                    )}
                    
                    {product.stock && product.stock > 0 ? (
                      <p className="text-sm text-green-600">
                        In Stock ({product.stock} available)
                      </p>
                    ) : (
                      <p className="text-sm text-red-600">Out of Stock</p>
                    )}
                  </div>

                  {/* Price Section */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatGhs(displayPrice)}
                    </div>
                    
                    {hasDiscount && product.originalPrice && (
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <span className="text-sm text-gray-400 line-through">
                          {formatGhs(product.originalPrice)}
                        </span>
                        <span className="text-sm text-red-500 font-medium">
                          -{discountPercent}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between mt-4">
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isUpdating}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                    Remove
                  </button>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={isUpdating || item.quantity <= 1}
                      className="w-10 h-10 rounded bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={11} className="text-gray-700" />
                    </button>
                    
                    <span className="text-lg font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={isUpdating || (product.stock !== undefined && item.quantity >= product.stock)}
                      className="w-10 h-10 rounded bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus size={11} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 rounded-lg p-6 sticky bottom-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatGhs(cart.subtotal)}
              </span>
            </div>
            
            <button
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-lg transition-colors"
            >
              Proceed to Checkout
            </button>
            
            <Link href="/main" className="block text-center text-sm text-gray-600 hover:text-gray-800 mt-3">
              Continue Shopping
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <CartIcon className="mx-auto h-24 w-24 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add items to get started</p>
          <Link
            href="/main"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}