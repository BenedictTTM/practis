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
    <div className="space-y-4">
      {/* Product Title */}
      <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed">
        {product.description || "Experience the future of audio with these stylish and powerful wireless headphones."}
      </p>

      {/* Rating */}
      <div className="flex items-center">
        <SimpleStarRating 
          rating={product.averageRating ?? 0} 
          totalReviews={product.totalReviews ?? product._count?.reviews ?? 0}
          size={18}
        />
      </div>

      {/* Price Section */}
      <div className="flex items-baseline gap-3">
        <div className="text-4xl font-bold text-gray-900">
          {formatGhs(discounted)}
        </div>
        {discountPercent > 0 && (
          <>
            <div className="text-lg text-gray-400 line-through">
              {formatGhs(original)}
            </div>
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
              -{discountPercent}%
            </div>
          </>
        )}
      </div>
    </div>
  );
}