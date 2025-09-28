'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProductCard as ProductCardType } from '../../types/products';
import placeholder from '../../../public/placeholder-image.png';
import { CiHeart } from "react-icons/ci";
import { IoCartOutline, IoEyeOutline } from "react-icons/io5";
import SimpleStarRating from '../../Components/Rating/rating';
import { formatGhs, calculateDiscountPercent } from '../../utilities/formatGhs';

interface ProductCardProps {
  product: ProductCardType;
  showSale?: boolean;
}

export default function ProductCard({ product, showSale = false }: ProductCardProps) {
  // Calculate discount percentage using utility function
  const discountPercentage = calculateDiscountPercent(product.originalPrice, product.discountedPrice);
  const hasDiscount = discountPercentage > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart logic here
    console.log('Added to cart:', product.title);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Wishlist logic here
    console.log('Added to wishlist:', product.title);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view logic here
    console.log('Quick view:', product.title);
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Discount Badge - Top Left */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
            -{discountPercentage}%
          </div>
        )}

        {/* Action Buttons - Right Side */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          <button 
            onClick={handleWishlist}
            title="Add to wishlist"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 transition-all duration-200"
          >
            <CiHeart className="w-5 h-5" />
          </button>
          <button 
            onClick={handleQuickView}
            title="Quick view"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
          >
            <IoEyeOutline className="w-5 h-5" />
          </button>
        </div>

        {/* Product Image */}
        <Link href={`/products/${product.id}`}>
          <Image
            src={
              Array.isArray(product.imageUrl) && product.imageUrl.length > 0
                ? product.imageUrl[0]
                : placeholder.src
            }
            alt={product.title}
            width={300}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = placeholder.src;
            }}
          />
        </Link>
      </div>

      {/* Add to Cart Button */}
      <div className="p-3">
        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <IoCartOutline className="w-5 h-5" />
          Add To Cart
        </button>
      </div>

      {/* Product Details */}
      <div className="px-3 pb-4">
        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-2 text-sm hover:text-red-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
  
        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-red-500 font-bold text-lg">
            {formatGhs(product.discountedPrice)}
          </span>
          {hasDiscount && product.originalPrice && (
            <span className="text-gray-400 text-sm line-through">
              {formatGhs(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <SimpleStarRating 
            rating={Math.round(product.averageRating || 0)} 
            totalReviews={product.totalReviews || 0}
            size={16}
            showCount={true}
          />
        </div>
      </div>
    </div>
  );
}