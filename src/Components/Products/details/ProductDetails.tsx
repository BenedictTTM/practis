'use client';

import React, { useState } from "react";
import { Product } from "../../../types/products";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const placeholderImage = "/placeholder-image.png";

  return (
    <section className="mt-4 sm:mt-6 w-full px-3 sm:px-5 lg:px-8 max-w-4xl mx-auto">
      {/* Tabs */}
      <nav className="border-b border-gray-200">
        <ul className="flex flex-wrap gap-3 sm:gap-6">
          {["details", "reviews"].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab as "details" | "reviews")}
                  role="tab"
                  aria-selected={isActive}
                  className={`relative pb-2 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-red-500"
                      : "text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  }`}
                >
                  {tab === "details" ? "Product Details" : "Reviews"}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-5">
        {activeTab === "details" ? (
          <div className="space-y-5">
            {/* Product Description */}
            <p className="text-[11px] sm:text-xs text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description ??
                "Discover the Oraimo SpacePods, engineered for immersive sound and comfort. Featuring noise-cancellation, long battery life, and an ergonomic design — perfect for music, calls, and more."}
            </p>

            {/* Seller Info */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 hover:shadow-xs transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Seller Avatar + Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                      src={product.user?.profilePic ?? placeholderImage}
                      alt="Seller profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          placeholderImage;
                      }}
                    />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                      {product.user
                        ? `${product.user.firstName ?? ""} ${
                            product.user.lastName ?? ""
                          }`.trim() || product.user.username
                        : "Ben Afotey"}
                    </h3>
                    {product.user?.username && (
                      <p className="text-[10px] sm:text-[11px] text-gray-500 truncate">
                        {product.user.username}
                      </p>
                    )}
                  </div>
                </div>

                {/* Member Tier */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-red-500 flex items-center justify-center">
                    <svg
                      className="w-2 h-2 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-500">
                    {product.user?.premiumTier || "FREE"} Member
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Reviews Section */
          <div className="text-center py-6 px-3 sm:px-5">
            <p className="text-[11px] sm:text-xs text-gray-700">
              {product.totalReviews || 0} reviews • Average rating{" "}
              <span className="font-semibold text-gray-900">
                {product.averageRating?.toFixed(1) || "0.0"}
              </span>
            </p>

            {product.totalReviews === 0 && (
              <p className="text-[10px] sm:text-[11px] text-gray-400 mt-2">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
