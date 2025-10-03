'use client';

import React, { useState } from 'react';
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Starlux Electric Hot Plate 2 Burner - Brown/Black',
      variation: '...',
      price: 278.00,
      quantity: 1,
      image: '/api/placeholder/80/80',
      inStock: true
    },
    {
      id: 2,
      name: 'STY Women Small Cross-body Bag Ladies Chain Bag Phone Bag Clutch Mini Black Bag',
      originalPrice: 93.80,
      price: 70.62,
      discount: 25,
      quantity: 1,
      image: '/api/placeholder/80/80',
      inStock: false,
      lowStock: true,
      expressDelivery: true
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-lg mx-auto p-2 ">
        <Link href='/' className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
          <ArrowLeft size={20} />
          Back to main page
        </Link>
      <h1 className="text-3xl font-bold mb-8">Cart ({totalItems})</h1>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={item.id} className="border-b border-gray-100 pb-6">
            <div className="flex gap-3">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={item.image}
          
                  className="w-20 h-20 object-cover rounded"
                />
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                <h3 className="text-md  text-gray-800 mb-1">
                  {item.name}
                </h3>
                
                {item.variation && (
                  <p className="text-sm text-gray-500 mb-1">
                    Variation: {item.variation}
                  </p>
                )}
                
                {item.inStock ? (
                  <p className="text-sm text-gray-600">In Stock</p>
                ) : item.lowStock ? (
                  <p className="text-sm text-red-600">Few units left</p>
                ) : null}

                {item.expressDelivery && (
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-semibold text-red-600">My</span>
                    <span className="text-xs font-semibold text-gray-500">Plug</span>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-gray-900">
                  GH₵ {item.price.toFixed(2)}
                </div>
                
                {item.originalPrice && (
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span className="text-sm text-gray-400 line-through">
                      GH₵ {item.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-red-500 font-medium">
                      -{item.discount}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between mt-4">
              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.id)}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium"
              >
                <Trash2 size={18} />
                Remove
              </button>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-10 h-10 rounded bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={11} className="text-gray-700" />
                </button>
                
                <span className="text-lg font-medium w-8 text-center">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-10 h-10 rounded bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={11} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cartItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Your cart is empty
        </div>
      )}
    </div>
  );
}