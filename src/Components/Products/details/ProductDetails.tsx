import React, { useState } from "react";
import { Product } from "../../../types/products";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const placeholderImage = "/placeholder-image.png";

  return (
    <div className="mt-8 w-full px-4 sm:px-6 lg:px-10">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-4 sm:gap-8">
          {["details", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "details" | "reviews")}
              className={`pb-3 text-sm sm:text-base font-medium transition-colors relative ${
                activeTab === tab
                  ? "text-red-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "details" ? "Product Details" : "Reviews"}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "details" ? (
          <div>
            {/* Product Description */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description ??
                "Discover the Oraimo SpacePods, engineered for immersive sound and unparalleled comfort. Featuring advanced noise-cancellation technology, a long-lasting battery, and a sleek, ergonomic design, these headphones are your perfect companion for music, calls, and everything in between."}
            </p>

            {/* Seller Information */}
            <div className="mt-8 bg-gray-50 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                {/* Seller Avatar + Info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img
                      src={product.user?.profilePic ?? placeholderImage}
                      alt="seller"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = placeholderImage;
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {product.user
                        ? `${product.user.firstName ?? ""} ${
                            product.user.lastName ?? ""
                          }`.trim() || product.user.username
                        : "Ben Afotey"}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 truncate">
                      {product.user?.username
                        ? `${product.user.username}@example.com`
                        : "ben.afotey@example.com"}
                    </div>
                  </div>
                </div>

                {/* Member Tier */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-500">
                    {product.user?.premiumTier || "FREE"} Member
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Reviews Content */
          <div className="text-center py-8 px-4 sm:px-6">
            <p className="text-gray-600 text-sm sm:text-base">
              {product.totalReviews || 0} reviews • Average rating{" "}
              {product.averageRating?.toFixed(1) || "0.0"}
            </p>
            {product.totalReviews === 0 && (
              <p className="text-xs sm:text-sm text-gray-400 mt-2">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
