'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CiHeart } from "react-icons/ci";
import AddToCartButton from '../../Cart/AddToCartButton';

// ===== TYPE DEFINITIONS =====
/**
 * Product interface representing a product in the e-commerce system
 */
export interface Product {
  /** Unique identifier for the product */
  id: number;
  /** Product title/name */
  title: string;
  /** Product image URLs - can be array or single string */
  imageUrl?: string[] | string;
  /** Original price before discount */
  originalPrice?: number;
  /** Discounted price (current selling price) */
  discountedPrice?: number;
  /** Average rating from reviews */
  averageRating?: number;
  /** Total number of reviews */
  totalReviews?: number;
  /** Review count from Prisma aggregation */
  _count?: { reviews?: number };
}

/**
 * Props for ProductCard component
 */
export interface ProductCardProps {
  /** Product data to display */
  product: Product;
  /** Whether to show sale badge (optional) */
  showSale?: boolean;
}

/**
 * Props for ProductsGrid component
 */
export interface ProductsGridProps {
  /** Array of products to display in grid */
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

/**
 * ProductCard - Renders a single product card with image, details, and actions
 * 
 * Features:
 * - Hover animations (scale-up, shadow effects)
 * - Add to cart and wishlist functionality
 * - Price display with discount indication
 * - Star rating display
 * - Responsive design
 * 
 * @param props - ProductCardProps containing product data and optional settings
 * @returns JSX.Element representing the product card
 */
function ProductCard({ product, showSale = false }: ProductCardProps) {
  const discountPercentage = calculateDiscountPercent(product.originalPrice, product.discountedPrice);
  const hasDiscount = discountPercentage > 0;

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
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-neutral-200">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-neutral-50">
        {/* Action Buttons - Right Side */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button 
            onClick={handleQuickView}
            title="Add to wishlist"
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-[#E43C3C] transition-all duration-200"
          >
            <CiHeart className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image */}
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

      {/* Product Details */}
      <div className="p-3">
        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-[#2E2E2E] mb-1.5 text-xs hover:text-[#E43C3C] transition-colors line-clamp-2 leading-tight">
            {product.title}
          </h3>
        </Link>
  
        {/* Price Section */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-[#E43C3C] font-bold text-sm">
            {formatGhs(product.discountedPrice)}
          </span>
          {hasDiscount && product.originalPrice && (
            <span className="text-gray-400 text-xs line-through">
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

        {/* Add to Cart Button */}
        <AddToCartButton 
          productId={product.id}
          quantity={1}
          variant="small"
          onSuccess={() => console.log(`✅ ${product.title} added to cart`)}
          onError={(msg) => console.error(`❌ Failed to add ${product.title}:`, msg)}
        />
      </div>
    </div>
  );
}

// ===== PRODUCTS GRID COMPONENT =====

/**
 * ProductsGrid - Renders a horizontally scrollable row of product cards
 * 
 * Features:
 * - Horizontal scroll layout with snap scrolling
 * - Empty state handling
 * - Optimized for performance with React keys
 * - Smooth scrolling with hidden scrollbar
 * 
 * @param props - ProductsGridProps containing array of products
 * @returns JSX.Element representing the products grid or empty state
 */
function ProductsGrid({ products }: ProductsGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex-1">
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Horizontal Scroll Container */}
      <div className="relative">
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth">
          {products.map((product) => (
            <div key={product.id} className="flex-none w-[160px] sm:w-[180px] md:w-[200px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== EXPORTS =====
export default ProductCard;
export { ProductsGrid, SimpleStarRating };