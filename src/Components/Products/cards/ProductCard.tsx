'use client';

import Link from 'next/link';
import React from 'react';
import { CiHeart } from "react-icons/ci";
import AddToCartButton from '../../Cart/AddToCartButton';

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
export default function ProductCard({ product }: { product: any }) {
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

  const href = `/main/products/${product.id}`;

  return (
    // Wrap entire card so image + title + meta all navigate to same route
    <Link href={href} className="block rounded-lg bg-white shadow-sm hover:shadow-md overflow-hidden">
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
        {/* image */}
        <img
          src={product.imageUrl?.[0] ?? '/placeholder.png'}
          alt={product.title}
          className="object-contain w-full h-full"
        />
      </div>

      <div className="p-4">
        {/* title */}
        <h3 className="text-lg font-medium text-gray-900">{product.title}</h3>

        {/* price / meta */}
        <div className="mt-3">
          <span className="text-red-600 font-semibold">GHC {product.discountedPrice ?? product.originalPrice}</span>
          {/* ...other meta... */}
        </div>

        {/* keep CTA as a link/button that also points to same href or a client-side action */}
        <div className="mt-4">
          <button
            type="button"
            onClick={(e) => {
              // stop propagation only if CTA does something different (e.g. add to cart)
              e.preventDefault();
              // perform add-to-cart logic here
            }}
            className="w-full btn btn-red"
            aria-label={`Add ${product.title} to cart`}
          >
            <i className="icon-cart" /> Add to Cart
          </button>
        </div>
      </div>
    </Link>
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
      <div className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        xl:grid-cols-5 
        gap-3 sm:gap-4 md:gap-6 
        px-2 sm:px-4 md:px-6 
        auto-rows-fr
      ">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export { ProductsGrid, SimpleStarRating };
