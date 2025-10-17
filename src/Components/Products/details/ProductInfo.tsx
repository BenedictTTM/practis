import React from "react";
import { Product } from "../../../types/products";
import { CheckCircle, Truck } from "lucide-react";

interface ProductInfoProps {
  product: Product;
  inStock: boolean;
}

export default function ProductInfo({ product, inStock }: ProductInfoProps) {
  return (
    <div className="mt-6 space-y-4">
      {/* In Stock Badge with Red Border */}
      {inStock ? (
        <div className="inline-flex items-center gap-2 rounded px-3 py-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-900 font-medium">In Stock</span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 border-2 border-red-500 rounded px-3 py-2">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-500 text-xs">✕</span>
          </div>
          <span className="text-sm text-red-600 font-medium">Out of stock</span>
        </div>
      )}

      {/* Delivery Info with Truck Icon */}
      <div className="flex items-start gap-2 text-sm text-gray-600">
        <Truck className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-medium text-gray-900">Estimated delivery:</span> 2-3 business days.{" "}
          <button className="text-red-500 hover:underline font-medium">Details</button>
        </div>
      </div>
    </div>
  );
}