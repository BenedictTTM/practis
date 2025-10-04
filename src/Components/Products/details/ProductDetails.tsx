import React from "react";
import { Product } from "../../../types/products";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const placeholderImage = "/placeholder-image.png";
  
  return (
    <div className="mt-8 bg-white p-4 rounded shadow-sm">
      <h3 className="font-semibold text-gray-800">Product details</h3>
      <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
        {product.description ?? "No description provided."}
      </p>

      {/* Seller Information */}
      <div className="mt-4 border-t pt-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
          <img 
            src={product.user?.profilePic ?? placeholderImage} 
            alt="seller" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <div className="text-sm font-medium">
            {product.user ? 
              `${product.user.firstName ?? ""} ${product.user.lastName ?? ""}`.trim() || product.user.username
              : "Seller"
            }
          </div>
          <div className="text-xs text-gray-500">
            {product.user?.username ?? "—"}
          </div>
          {product.user?.premiumTier && (
            <div className="text-xs text-orange-600 font-medium">
              {product.user.premiumTier} Member
            </div>
          )}
        </div>
      </div>
    </div>
  );
}