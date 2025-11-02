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
  productData?: any; // Full product data for local storage cart
}

export default function ProductActions({
  productId,
  quantity,
  maxQuantity,
  inStock,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onAddToCart,
  productData,
}: ProductActionsProps) {
  return (
    <section className="mt-8 w-full px-2 sm:px-4 md:px-6 space-y-5 sm:space-y-6">
      {/* Quantity Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="w-full sm:w-auto flex-1">
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5 sm:mb-2">
            Quantity:
          </label>
          <QuantitySelector
            quantity={quantity}
            maxQuantity={maxQuantity}
            onIncrease={onIncreaseQuantity}
            onDecrease={onDecreaseQuantity}
          />
          {maxQuantity && maxQuantity > 0 && (
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              ({maxQuantity} available)
            </p>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      {inStock ? (
        <AddToCartButton
          productId={productId}
          quantity={quantity}
          variant="default"
          productData={productData}
          onSuccess={() => {
            console.log(`✅ Added ${quantity} item(s) to cart`);
            onAddToCart?.();
          }}
          onError={(msg) => {
            console.error("❌ Add to cart failed:", msg);
            alert(`Failed to add to cart: ${msg}`);
          }}
          className="w-full sm:w-auto min-w-[200px] py-3 sm:py-4 text-base sm:text-lg rounded-xl font-semibold shadow-sm transition-transform hover:scale-[1.02] active:scale-95"
        />
      ) : (
        <button
          disabled
          className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gray-300 text-white text-base sm:text-lg font-semibold rounded-xl cursor-not-allowed"
        >
          Out of Stock
        </button>
      )}
    </section>
  );
}
