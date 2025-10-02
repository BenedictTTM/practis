import React from "react";
import { Product } from "../../types/products";

interface ProductInfoProps {
  product: Product;
  inStock: boolean;
}

export default function ProductInfo({ product, inStock }: ProductInfoProps) {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="text-sm font-medium text-gray-700">Delivery</div>
        <div className="text-sm text-gray-600">
          {product.delivery?.text ?? "Delivery from GH₵ 11.00 — free above GH₵ 150.00"}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-gray-700">Availability</div>
        <div className="mt-1">
          {inStock ? (
            <span className="inline-flex items-center px-2 py-1 rounded text-sm bg-red-50 text-gray-800">
              In stock •  <span className="text-gray-900 font-semibold px-1">{product.stock}</span>  available
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded text-sm bg-red-50 text-red-700">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}