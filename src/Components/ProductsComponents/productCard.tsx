'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CiHeart } from "react-icons/ci";
import { IoCartOutline, IoEyeOutline } from "react-icons/io5";

// ===== TYPE DEFINITIONS =====
interface Product {
  id: number;
  title: string;
  imageUrl?: string[] | string;
  originalPrice?: number;
  discountedPrice?: number;
  averageRating?: number;
  totalReviews?: number;
  _count?: { reviews?: number };
}

interface ProductCardProps {
  product: Product;
  showSale?: boolean;
}

interface ProductsGridProps {
  products: Product[];
}

// ===== UTILITY FUNCTIONS =====
const formatGhs = (value?: number | null): string => {
  if (value == null) return "GH₵ 0.00";
  return `GH₵ ${Number(value).toFixed(2)}`;
};

const calculateDiscountPercent = (originalPrice?: number | null, discountedPrice?: number | null): number => {
  if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

// ===== STAR RATING COMPONENT =====
const SimpleStarRating = ({ 
  rating = 0, 
  totalReviews = 0, 
  size = 16, 
  showCount = true 
}: { 
  rating?: number; 
  totalReviews?: number; 
  size?: number; 
  showCount?: boolean; 
}) => (
  <div className="flex items-center gap-1">
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
    {showCount && (
      <span className="text-sm text-gray-500 ml-1">
        {totalReviews > 0 ? `(${totalReviews})` : '(0)'}
      </span>
    )}
  </div>
);

// ===== PRODUCT CARD COMPONENT =====

function ProductCard({ product, showSale = false }: ProductCardProps) {
  const discountPercentage = calculateDiscountPercent(product.originalPrice, product.discountedPrice);
  const hasDiscount = discountPercentage > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Added to cart:', product.title);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Added to wishlist:', product.title);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Quick view:', product.title);
  };

  const imageUrl = Array.isArray(product.imageUrl) && product.imageUrl.length > 0
    ? product.imageUrl[0]
    : typeof product.imageUrl === 'string'
    ? product.imageUrl
    : '/placeholder-image.png';

  return (
    <div className="group bg-white hover:border-gray-50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-sm">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Discount Badge - Top Left */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1  z-20">
            -{discountPercentage}%
          </div>
        )}

        {/* Action Buttons - Right Side */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
          <button 
            onClick={handleWishlist}
            title="Add to wishlist"
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 transition-all duration-200"
          >
            <CiHeart className="w-4 h-4" />
          </button>
          <button 
            onClick={handleQuickView}
            title="Quick view"
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
          >
            <IoEyeOutline className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image */}
        <Link href={`/products/${product.id}`}>
          <Image
            src={imageUrl}
            alt={product.title}
            width={300}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = '/placeholder-image.png';
            }}
          />
        </Link>

        {/* Add to Cart Button - Slides up from bottom on hover */}
        <div className="absolute inset-x-0 bottom-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ">
          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-2.5 px-4 font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <IoCartOutline className="w-5 h-5" />
            Add To Cart
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="px-2 pb-3">
        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-1 text-xs hover:text-red-700 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
  
        {/* Price Section */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-red-600 font-bold text-base">
            {formatGhs(product.discountedPrice)}
          </span>
          {hasDiscount && product.originalPrice && (
            <span className="text-gray-400 text-xs line-through">
              {formatGhs(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <SimpleStarRating 
            rating={Math.round(product.averageRating || 0)} 
            totalReviews={product.totalReviews || product._count?.reviews || 0}
            size={14}
            showCount={true}
          />
        </div>
      </div>
    </div>
  );
}

// ===== PRODUCTS GRID COMPONENT =====
function ProductsGrid({ products }: ProductsGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="mt-16">
        <div className="text-center py-12">
          <p className="text-gray-500">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      {/* Horizontal Scrolling Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide px-4">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-48">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== EXPORTS =====
export default ProductCard;
export { ProductsGrid, SimpleStarRating };