'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Minus, Plus, ArrowRight, ShoppingCart as CartIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '@/lib/cart';
import { Cart, CartItem } from '@/types/cart';
import { formatGhs } from '@/utilities/formatGhs';

export default function ShoppingCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [couponCode, setCouponCode] = useState('');

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  const shippingCost = 5.0;
  const subtotal = cart?.subtotal || 0;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Cart Items Section */}
        {cart && cart.items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
                <Link
                  href="/main/products"
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  Continue Shopping
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Cart Items List */}
              <div className="bg-white rounded-lg shadow-sm">
                {cart.items.map((item, index) => {
                  const isUpdating = updatingItems.has(item.id);
                  const product = item.product;
                  const imageUrl = Array.isArray(product.imageUrl)
                    ? product.imageUrl[0]
                    : product.imageUrl || '/placeholder-image.png';
                  const displayPrice = product.discountedPrice || product.originalPrice || 0;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 ${
                        index !== cart.items.length - 1 ? 'border-b border-gray-100' : ''
                      } ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-base mb-0.5">
                                {product.title}
                              </h3>
                              {product.condition && (
                                <p className="text-xs text-gray-500">
                                  Color: {product.condition}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls and Price */}
                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={isUpdating || item.quantity <= 1}
                                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>

                              <span className="text-sm font-medium text-gray-900 w-6 text-center">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={
                                  isUpdating ||
                                  (product.stock !== undefined && item.quantity >= product.stock)
                                }
                                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Price and Delete */}
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-gray-900">
                                {formatGhs(displayPrice * item.quantity)}
                              </span>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={isUpdating}
                                className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                aria-label="Remove item"
                              >
                                {isUpdating ? (
                                  <Loader2 size={18} className="animate-spin" />
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
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Subtotal */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-semibold">{formatGhs(subtotal)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-semibold">{formatGhs(shippingCost)}</span>
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button className="px-6 py-2 bg-red-100 text-red-500 font-medium rounded-lg hover:bg-red-200 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">{formatGhs(total)}</span>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4">
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>

                <Link
                  href="/main/products"
                  className="block text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Empty Cart State
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CartIcon className="mx-auto h-24 w-24 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add items to get started</p>
            <Link
              href="/main/products"
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Start Shopping
              <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
