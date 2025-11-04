'use client';

import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { DotLoader } from '@/Components/Loaders';
import Image from 'next/image';
import { formatGhs } from '@/utilities/formatGhs';

/**
 * CartItemsList Component
 * 
 * Single Responsibility: Display and manage cart items list
 * Open/Closed: Extensible via callbacks, closed for modification
 * Liskov Substitution: Accepts any item matching DisplayCartItem interface
 * Interface Segregation: Only requires minimal item structure
 * Dependency Inversion: Depends on abstractions (callbacks) not implementations
 * 
 * @component
 * @example
 * ```tsx
 * <CartItemsList
 *   items={displayItems}
 *   updatingItems={updatingSet}
 *   onUpdateQuantity={(id, productId, qty) => handleUpdate(id, productId, qty)}
 *   onRemoveItem={(id, productId) => handleRemove(id, productId)}
 * />
 * ```
 */

export interface DisplayCartItem {
  id: number | string;
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

interface CartItemsListProps {
  items: DisplayCartItem[];
  updatingItems: Set<number | string>;
  onUpdateQuantity: (itemId: number | string, productId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number | string, productId: number) => void;
}

export default function CartItemsList({
  items,
  updatingItems,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemsListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {items.map((item, index) => (
        <CartItem
          key={item.id}
          item={item}
          isUpdating={updatingItems.has(item.id)}
          isLastItem={index === items.length - 1}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
}

/**
 * CartItem Component
 * 
 * Internal component following Single Responsibility Principle
 * Handles rendering and interactions for a single cart item
 */
interface CartItemProps {
  item: DisplayCartItem;
  isUpdating: boolean;
  isLastItem: boolean;
  onUpdateQuantity: (itemId: number | string, productId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number | string, productId: number) => void;
}

function CartItem({
  item,
  isUpdating,
  isLastItem,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemProps) {
  const product = item.product;
  const imageUrl = Array.isArray(product.imageUrl)
    ? product.imageUrl[0]
    : product.imageUrl || '/placeholder-image.png';
  const displayPrice = product.discountedPrice || product.originalPrice || 0;
  const itemTotal = displayPrice * item.quantity;
  const isAtMinQuantity = item.quantity <= 1;
  const isAtMaxQuantity = product.stock !== undefined && item.quantity >= product.stock;

  return (
    <div
      className={`p-3 sm:p-4 ${
        !isLastItem ? 'border-b border-gray-100' : ''
      } ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex gap-2 sm:gap-3 min-w-0">
        {/* Product Image */}
        <ProductImage src={imageUrl} alt={product.title} />

        {/* Product Details */}
        <div className="flex-grow min-w-0">
          <ProductHeader
            title={product.title}
            condition={product.condition}
            isUpdating={isUpdating}
            onRemove={() => onRemoveItem(item.id, item.productId)}
          />

          {/* Quantity Controls and Price */}
          <div className="flex items-center justify-between mt-2 sm:mt-3 gap-2">
            <QuantityControls
              quantity={item.quantity}
              isUpdating={isUpdating}
              isAtMinQuantity={isAtMinQuantity}
              isAtMaxQuantity={isAtMaxQuantity}
              onDecrease={() => onUpdateQuantity(item.id, item.productId, item.quantity - 1)}
              onIncrease={() => onUpdateQuantity(item.id, item.productId, item.quantity + 1)}
            />

            <PriceAndDelete
              price={itemTotal}
              isUpdating={isUpdating}
              onRemove={() => onRemoveItem(item.id, item.productId)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ProductImage - Atomic component for product image display
 */
function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}

/**
 * ProductHeader - Atomic component for product title and metadata
 */
interface ProductHeaderProps {
  title: string;
  condition?: string;
  isUpdating: boolean;
  onRemove: () => void;
}

function ProductHeader({ title, condition, isUpdating, onRemove }: ProductHeaderProps) {
  return (
    <div className="flex justify-between gap-2 mb-2">
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 truncate">
          {title}
        </h3>
        {condition && (
          <p className="text-xs text-gray-500 truncate">Color: {condition}</p>
        )}
      </div>
      {/* Delete Button - Mobile Only (Top Right) */}
      <button
        onClick={onRemove}
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
  );
}

/**
 * QuantityControls - Atomic component for quantity adjustment
 */
interface QuantityControlsProps {
  quantity: number;
  isUpdating: boolean;
  isAtMinQuantity: boolean;
  isAtMaxQuantity: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}

function QuantityControls({
  quantity,
  isUpdating,
  isAtMinQuantity,
  isAtMaxQuantity,
  onDecrease,
  onIncrease,
}: QuantityControlsProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      <button
        onClick={onDecrease}
        disabled={isUpdating || isAtMinQuantity}
        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-gray-300 rounded"
        aria-label="Decrease quantity"
      >
        <Minus size={12} className="sm:w-3.5 sm:h-3.5" />
      </button>

      <span className="text-xs sm:text-sm font-medium text-gray-900 w-5 sm:w-6 text-center">
        {quantity}
      </span>

      <button
        onClick={onIncrease}
        disabled={isUpdating || isAtMaxQuantity}
        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-gray-300 rounded"
        aria-label="Increase quantity"
      >
        <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
      </button>
    </div>
  );
}

/**
 * PriceAndDelete - Atomic component for price display and delete action
 */
interface PriceAndDeleteProps {
  price: number;
  isUpdating: boolean;
  onRemove: () => void;
}

function PriceAndDelete({ price, isUpdating, onRemove }: PriceAndDeleteProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
      <span className="text-sm sm:text-lg font-bold text-gray-900 truncate">
        {formatGhs(price)}
      </span>
      {/* Delete Button - Desktop Only */}
      <button
        onClick={onRemove}
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
  );
}
