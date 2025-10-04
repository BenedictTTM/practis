import React from "react";
import { SimpleStarRating } from "../cards";
import { formatGhs, calculateDiscountPercent } from "../../../utilities/formatGhs";
import { Product } from "../../../types/products";

interface ProductHeaderProps {
  product: Product;
}

export default function ProductHeader({ product }: ProductHeaderProps) {
  const original = product?.originalPrice ?? null;
  const discounted = product?.discountedPrice ?? original ?? null;
  const discountPercent = calculateDiscountPercent(original, discounted);
  
  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900">{product.title}</h1>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <SimpleStarRating 
              rating={product.averageRating ?? 0} 
              totalReviews={product.totalReviews ?? product._count?.reviews ?? 0}
              size={18}
            />
          </div>

          <div className="text-sm text-gray-500">
            Category: {product.category ?? "—"}
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-extrabold text-gray-900">
            {formatGhs(discounted)}
          </div>
          {discountPercent > 0 && (
            <div className="text-sm text-gray-500">
              <span className="line-through mr-2">{formatGhs(original)}</span>
              <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                -{discountPercent}%
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}