import React from "react";
import QuantitySelector from "../common/QuantitySelector";
import { ShoppingCart } from "lucide-react";

interface ProductActionsProps {
  quantity: number;
  maxQuantity?: number;
  inStock: boolean;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  onAddToCart: () => void;
}

export default function ProductActions({ 
  quantity, 
  maxQuantity, 
  inStock,
  onIncreaseQuantity, 
  onDecreaseQuantity,
  onAddToCart 
}: ProductActionsProps) {
  return (
    <div className="mt-8 space-y-4">
      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantity:
        </label>
        <QuantitySelector 
          quantity={quantity}
          maxQuantity={maxQuantity}
          onIncrease={onIncreaseQuantity}
          onDecrease={onDecreaseQuantity}
        />
        {maxQuantity && maxQuantity > 0 && (
          <p className="mt-1 text-xs text-gray-500">({maxQuantity} available)</p>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={onAddToCart}
        disabled={!inStock}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-semibold text-base transition-all shadow-md ${
          inStock 
            ? "bg-[#E43C3C] hover:bg-red-600 hover:shadow-lg" 
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <ShoppingCart className="w-5 h-5" />
        {inStock ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
}