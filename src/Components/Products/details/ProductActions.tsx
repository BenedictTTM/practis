import React from "react";
import QuantitySelector from "../common/QuantitySelector";
import { MdOutlineAddShoppingCart } from "react-icons/md";

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
    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
      <QuantitySelector 
        quantity={quantity}
        maxQuantity={maxQuantity}
        onIncrease={onIncreaseQuantity}
        onDecrease={onDecreaseQuantity}
      />

      <div className="mt-3 sm:mt-0 flex-1">
        <button
          onClick={onAddToCart}
          disabled={!inStock}
          className={`max-w-3xl flex items-center justify-center gap-2 px-6 py-3 rounded shadow text-white transition-colors ${
            inStock 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
         <MdOutlineAddShoppingCart/>
          {inStock ? "Add to cart" : "Out of stock"}
        </button>
      </div>
    </div>
  );
}