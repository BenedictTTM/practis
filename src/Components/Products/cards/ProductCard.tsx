'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CiHeart } from "react-icons/ci";
import AddToCartButton from '../../Cart/AddToCartButton';

// ===== TYPES =====
export interface Product {
  id: number;
  title: string;
  imageUrl?: string[] | string;
  originalPrice?: number;
  discountedPrice?: number;
  averageRating?: number;
  totalReviews?: number;
  _count?: { reviews?: number };
}

export interface ProductCardProps {
  product: Product;
}

export interface ProductsGridProps {
  products: Product[];
}

// ===== UTILITIES =====
const formatGhs = (value?: number | null): string => {
  if (value == null) return "GH₵ 0.00";
  return `GH₵ ${Number(value).toFixed(2)}`;
};

const calculateDiscountPercent = (originalPrice?: number | null, discountedPrice?: number | null): number => {
  if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

// ===== STAR RATING =====
const SimpleStarRating = ({
  rating = 0,
  totalReviews = 0,
  size = 12,
  showCount = true
}: {
  rating?: number;
  totalReviews?: number;
  size?: number;
  showCount?: boolean;
}) => (
  <div className="flex items-center gap-0.5">
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
      <span className="text-[10px] sm:text-xs text-gray-500 ml-1">
        {totalReviews > 0 ? `(${totalReviews})` : '(0)'}
      </span>
    )}
  </div>
);

// ===== PRODUCT CARD =====
function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = calculateDiscountPercent(product.originalPrice, product.discountedPrice);
  const hasDiscount = discountPercentage > 0;

  const imageUrl = Array.isArray(product.imageUrl) && product.imageUrl.length > 0
    ? product.imageUrl[0]
    : typeof product.imageUrl === 'string'
      ? product.imageUrl
      : '/placeholder-image.png';

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300 hover:scale-[1.01] border border-neutral-200 w-full h-full">
      {/* Image Section */}
      <div className="relative aspect-[1/1] overflow-hidden bg-neutral-50 max-h-[200px] sm:max-h-[220px]">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button
            onClick={handleQuickView}
            title="Add to wishlist"
            className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-[#E43C3C] transition-all duration-200"
          >
            <CiHeart className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <Link href={`/main/products/${product.id}`}>
          <Image
            src={imageUrl}
            alt={product.title}
            width={200}
            height={200}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = '/placeholder-image.png';
            }}
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-between flex-1 p-2.5 sm:p-3">
        {/* Title */}
        <Link href={`/main/products/${product.id}`}>
          <h3 className="font-medium text-[#2E2E2E] mb-1 text-[12px] sm:text-sm hover:text-[#E43C3C] transition-colors line-clamp-2 leading-snug h-[2.4em]">
            {product.title}
          </h3>
        </Link>

        {/* Price + Rating */}
        <div className="flex flex-col gap-0.5 mb-1.5">
          <div className="flex items-center gap-0.5">
            <span className="text-[#E43C3C] font-semibold text-[12px] sm:text-sm">
              {formatGhs(product.discountedPrice)}
            </span>
            {hasDiscount && product.originalPrice && (
              <span className="text-gray-400 text-[10px] sm:text-xs line-through">
                {formatGhs(product.originalPrice)}
              </span>
            )}
          </div>

          <SimpleStarRating
            rating={Math.round(product.averageRating || 0)}
            totalReviews={product.totalReviews || product._count?.reviews || 0}
            size={10}
          />
        </div>

        {/* Add to Cart */}
        <div className="mt-auto pt-1">
          <AddToCartButton
            productId={product.id}
            quantity={1}
            variant="small"
            className="w-full text-[11px] sm:text-xs py-1.5"
            productData={product}
          />
        </div>
      </div>
    </div>
  );
}

// ===== PRODUCTS GRID =====
function ProductsGrid({ products }: ProductsGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex-1 text-center py-12 sm:py-20">
        <p className="text-gray-500 text-sm sm:text-base">No products available</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full">
      <div
        className="
          grid 
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          xl:grid-cols-5 
          gap-2 sm:gap-3 md:gap-4 
          px-2 sm:px-4 md:px-6 
          auto-rows-fr
        "
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductCard;
export { ProductsGrid, SimpleStarRating };
