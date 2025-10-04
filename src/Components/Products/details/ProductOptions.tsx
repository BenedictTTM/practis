import React from "react";

interface ProductOptionsProps {
  sizes: string[];
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
}

export default function ProductOptions({ 
  sizes, 
  selectedSize, 
  onSelectSize 
}: ProductOptionsProps) {
  if (!sizes.length) return null;

  return (
    <div className="mt-6">
      <div className="text-sm font-medium text-gray-700 mb-2">Size</div>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelectSize(size)}
            className={`px-3 py-2 border rounded text-sm transition-colors ${
              selectedSize === size 
                ? "bg-gray-900 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}