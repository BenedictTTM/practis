import React from "react";
import { Product } from "../../../types/products";
import { CheckCircle, Truck } from "lucide-react";

interface ProductInfoProps {
  product: Product;
  inStock: boolean;
}

export default function ProductInfo({ product, inStock }: ProductInfoProps) {
  return (
    <section className="mt-6 w-full px-2 sm:px-4 md:px-6 space-y-4 sm:space-y-5">
      {/* Stock Status */}
      <div
        className={`inline-flex items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 border ${
          inStock
            ? "border-green-100 bg-green-50"
            : "border-red-300 bg-red-50"
        }`}
      >
        {inStock ? (
          <>
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            <span className="text-sm sm:text-base text-gray-900 font-medium">
              In Stock
            </span>
          </>
        ) : (
          <>
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-500 text-xs sm:text-sm">✕</span>
            </div>
            <span className="text-sm sm:text-base text-red-600 font-medium">
              Out of Stock
            </span>
          </>
        )}
      </div>

      {/* Delivery Info */}
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 text-gray-700 text-sm sm:text-base leading-relaxed flex-wrap">
        <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 flex-shrink-0 mt-0.5 sm:mt-0" />
        <p className="flex-1">
          <span className="font-semibold text-gray-900">
            Estimated delivery:
          </span>{" "}
          2–3 business days.{" "}
          <button className="text-red-500 hover:underline font-medium">
            Details
          </button>
        </p>
      </div>
    </section>
  );
}
