'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CiHeart } from "react-icons/ci";
import AddToCartButton from '../../Cart/AddToCartButton';

// ===== TYPE DEFINITIONS =====
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
  showSale?: boolean;
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
      <span className="text-xs sm:text-sm text-gray-500 ml-1">
        {totalReviews > 0 ? `(${totalReviews})` : '(0)'}
      </span>
    )}
  </div>
);

// ===== PRODUCT CARD =====
function ProductCard({ product, showSale = false }: ProductCardProps) {
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
    console.log('Quick view:', product.title);
  };

  return (
    <div className="group flex h-full flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-neutral-200 w-full">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-50">
        {/* Wishlist Button */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button
            onClick={handleQuickView}
            title="Add to wishlist"
            className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-[#E43C3C] transition-all duration-200"
          >
            <CiHeart className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <Link href={`products/${product.id}`}>
          <Image
            src={imageUrl}
            alt={product.title}
            width={240}
            height={240}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = '/placeholder-image.png';
            }}
          />
        </Link>
      </div>

      {/* Details */}
  <div className="p-3 sm:p-4 flex flex-1 flex-col gap-2">
        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-[#2E2E2E] mb-1.5 text-xs sm:text-sm md:text-base hover:text-[#E43C3C] transition-colors line-clamp-2 leading-tight">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-[#E43C3C] font-bold text-sm sm:text-base">
            {formatGhs(product.discountedPrice)}
          </span>
          {hasDiscount && product.originalPrice && (
            <span className="text-gray-400 text-xs sm:text-sm line-through">
              {formatGhs(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2.5">
          <SimpleStarRating
            rating={Math.round(product.averageRating || 0)}
            totalReviews={product.totalReviews || product._count?.reviews || 0}
            size={12}
            showCount={true}
          />
        </div>

        {/* Add to Cart */}
        <div className="pt-2 mt-auto">
          <AddToCartButton
            productId={product.id}
            quantity={1}
            variant="small"
            className="w-full"
            onSuccess={() => console.log(`✅ ${product.title} added to cart`)}
            onError={(msg) => console.error(`❌ Failed to add ${product.title}:`, msg)}
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
      <div className="flex-1 text-center py-16 sm:py-24">
        <p className="text-gray-500 text-sm sm:text-base md:text-lg">No products available</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4 md:px-6 auto-rows-fr">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductCard;
export { ProductsGrid, SimpleStarRating };
