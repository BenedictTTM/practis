'use client';

import { useState, useEffect, Fragment } from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { fetchCart, updateCartItem, removeCartItem } from '@/lib/cart';
import { Cart } from '@/types/cart';
import { formatGhs } from '@/utilities/formatGhs';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * CartDrawer Component
 * 
 * Sliding sidebar displaying cart contents.
 * Quick view of items with quantity controls.
 * Links to full cart page for checkout.
 * 
 * @component
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
 * ```
 */
export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  const loadCart = async () => {
    setLoading(true);
    const result = await fetchCart();
    if (result.success) {
      setCart(result.data || null);
    }
    setLoading(false);
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));

    const result = await updateCartItem(itemId, newQuantity);
    
    if (result.success && result.data) {
      setCart(result.data);
    }

    setUpdatingItems(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  const handleRemoveItem = async (itemId: number) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));

    const result = await removeCartItem(itemId);
    
    if (result.success) {
      setCart(result.data || null);
    }

    setUpdatingItems(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold">
              Cart ({cart?.totalItems || 0})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-80px)]">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-red-500" />
            </div>
          ) : cart && cart.items.length > 0 ? (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.items.map((item) => {
                  const isUpdating = updatingItems.has(item.id);
                  const product = item.product;
                  const imageUrl = product.imageUrl?.[0] || product.images?.[0] || '/placeholder-image.png';
                  const displayPrice = product.discountedPrice || product.originalPrice || 0;

                  return (
                    <div
                      key={item.id}
                      className={`flex gap-4 p-4 border rounded-lg ${isUpdating ? 'opacity-50' : ''}`}
                    >
                      {/* Image */}
                      <Link href={`/main/products/${product.id}`} onClick={onClose}>
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/main/products/${product.id}`} onClick={onClose}>
                          <h3 className="text-sm font-medium text-gray-800 mb-1 truncate hover:text-red-500">
                            {product.title}
                          </h3>
                        </Link>
                        <p className="text-lg font-bold text-gray-900 mb-2">
                          {formatGhs(displayPrice)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={isUpdating || item.quantity <= 1}
                            className="p-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating}
                            className="p-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isUpdating}
                            className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Subtotal:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatGhs(cart.subtotal)}
                  </span>
                </div>
                <Link
                  href="/main/cart"
                  onClick={onClose}
                  className="block w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg text-center transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingCart className="h-24 w-24 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Add items to get started
              </p>
              <button
                onClick={onClose}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
