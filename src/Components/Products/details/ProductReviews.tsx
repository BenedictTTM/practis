import React from "react";
import { Product } from "../../../types/products";

interface ProductReviewsProps {
  product: Product;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const totalReviews = product.totalReviews ?? product._count?.reviews ?? 0;
  const averageRating = product.averageRating ?? 0;

  return (
    <div className="mt-6">
      <h4 className="font-semibold text-gray-800">Reviews</h4>
      <div className="mt-3 text-sm text-gray-600">
        {totalReviews} reviews • Average rating {averageRating.toFixed(1)}
      </div>
      
      {/* TODO: Add detailed reviews display when reviews data is available */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Recent reviews will appear here
        </div>
      )}
    </div>
  );
}