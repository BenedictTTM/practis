import React from "react";
import QuantitySelector from "../common/QuantitySelector";
import AddToCartButton from "../../Cart/AddToCartButton";

interface ProductActionsProps {
  productId: number;
  quantity: number;
  maxQuantity?: number;
  inStock: boolean;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  onAddToCart?: () => void;
}

export default function ProductActions({ 
  productId,
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
      {inStock ? (
        <AddToCartButton 
          productId={productId}
          quantity={quantity}
          variant="default"
          onSuccess={() => {
            console.log(`✅ Added ${quantity} item(s) to cart`);
            onAddToCart?.();
          }}
          onError={(msg) => {
            console.error('❌ Add to cart failed:', msg);
            alert(`Failed to add to cart: ${msg}`);
          }}
        />
      ) : (
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-300 text-white font-semibold rounded-lg cursor-not-allowed"
        >
          Out of Stock
        </button>
      )}
    </div>
  );
}