import React from "react";
import { Product } from "../../../types/products";
import { CheckCircle, Truck } from "lucide-react";

interface ProductInfoProps {
  product: Product;
  inStock: boolean;
}

export default function ProductInfo({ product, inStock }: ProductInfoProps) {
  return (
    <section className="mt-5 w-full px-3 sm:px-5 md:px-6 space-y-3 sm:space-y-4">
      {/* Stock Status */}
      <div
        className={`inline-flex items-center gap-2 sm:gap-2.5 rounded-md px-3 py-1.5 sm:px-3.5 sm:py-2 border text-xs sm:text-sm font-medium ${
          inStock
            ? "border-green-100 bg-green-50 text-green-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}
      >
        {inStock ? (
          <>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span>In Stock</span>
          </>
        ) : (
          <>
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-500 text-[10px] sm:text-xs">✕</span>
            </div>
            <span>Out of Stock</span>
          </>
        )}
      </div>

      {/* Delivery Info */}
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed flex-wrap">
        <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5 sm:mt-0" />
        <p className="flex-1">
          <span className=" text-gray-800 text-xs">Estimated delivery:</span>{" "}
          2–3 business days.{" "}
          <button className="text-red-500 hover:underline font-medium transition-colors">
            Details
          </button>
        </p>
      </div>
    </section>
  );
}
