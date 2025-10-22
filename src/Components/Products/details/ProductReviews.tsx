import React from "react";
import { Product } from "../../../types/products";

interface ProductReviewsProps {
  product: Product;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const totalReviews = product.totalReviews ?? product._count?.reviews ?? 0;
  const averageRating = product.averageRating ?? 0;

  return (
    <section className="mt-6 w-full px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h4 className="text-base sm:text-lg font-semibold text-gray-800">
          Reviews
        </h4>

        <div className="text-xs sm:text-sm text-gray-600">
          {totalReviews} reviews •{" "}
          <span className="font-medium text-gray-700">
            Average rating {averageRating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Reviews container */}
      {product.reviews && product.reviews.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder for review cards */}
          <div className="p-4 bg-gray-50 rounded-xl text-gray-700 text-sm">
            Recent reviews will appear here
          </div>
        </div>
      ) : (
        <div className="mt-4 p-4 text-center text-gray-500 text-sm bg-gray-50 rounded-xl">
          No reviews yet. Be the first to leave one!
        </div>
      )}
    </section>
  );
}
