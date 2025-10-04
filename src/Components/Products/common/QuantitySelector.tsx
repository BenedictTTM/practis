import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity?: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantitySelector({ 
  quantity, 
  maxQuantity, 
  onIncrease, 
  onDecrease 
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-gray-300 rounded">
        <button 
          aria-label="decrease quantity" 
          onClick={onDecrease} 
          className="px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          -
        </button>
        <div className="px-4 py-2 w-16 text-center">{quantity}</div>
        <button 
          aria-label="increase quantity" 
          onClick={onIncrease} 
          className="px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          +
        </button>
      </div>

      {maxQuantity !== undefined && (
        <div className="text-sm text-gray-500">({maxQuantity} available)</div>
      )}
    </div>
  );
}