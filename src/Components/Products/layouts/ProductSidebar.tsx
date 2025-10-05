'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
}

interface ProductSidebarProps {
  onFiltersChange?: (filters: FilterState) => void;
}

export default function ProductSidebar({ onFiltersChange }: ProductSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'All Categories',
    priceRange: [0, 10000],
    rating: 0
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Mock cart data - replace with actual cart state
  const cartItems: CartItem[] = [
    {
      id: 1,
      title: 'Leather Handbag',
      price: 450,
      quantity: 1,
      imageUrl: '/placeholder-image.png'
    },
    {
      id: 2,
      title: 'Cashmere Sweater',
      price: 280,
      quantity: 1,
      imageUrl: '/placeholder-image.png'
    }
  ];

  const categories = [
    'All Categories',
    'Fashion',
    'Electronics',
    'Home & Garden',
    'Sports',
    'Books',
    'Health & Beauty'
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCategoryChange = (category: string) => {
    const newFilters = { ...filters, category };
    setFilters(newFilters);
    setShowCategoryDropdown(false);
    onFiltersChange?.(newFilters);
  };

  const handlePriceRangeChange = (value: number, index: number) => {
    const newPriceRange: [number, number] = [...filters.priceRange];
    newPriceRange[index] = value;
    const newFilters = { ...filters, priceRange: newPriceRange };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, rating };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 lg:p-6 space-y-6 lg:space-y-8 max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hide">
      {/* Filters Section */}
      <div>
        <h2 className="text-lg font-semibold text-[#2E2E2E] mb-6">Filters</h2>
        
        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
            Category
          </label>
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-300 transition-colors"
            >
              <span className="text-sm text-[#2E2E2E]">{filters.category}</span>
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className="w-full px-4 py-3 text-left text-sm text-[#2E2E2E] hover:bg-gray-50 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#2E2E2E] mb-3">
            Price Range
          </label>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="range"
                min="0"
                max="10000"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(Number(e.target.value), 1)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #E43C3C 0%, #E43C3C ${(filters.priceRange[1] / 10000) * 100}%, #e5e7eb ${(filters.priceRange[1] / 10000) * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>GH₵0</span>
              <span>GH₵{filters.priceRange[1].toLocaleString()}+</span>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#2E2E2E] mb-3">
            Rating
          </label>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                  filters.rating === rating ? 'bg-red-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-[#2E2E2E]">& up</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Summary Section */}
      <div>
        <h2 className="text-lg font-semibold text-[#2E2E2E] mb-4">Cart Summary</h2>
        
        {cartItems.length === 0 ? (
          <p className="text-sm text-gray-500">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {/* Cart Items */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = '/placeholder-image.png';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2E2E2E] truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      GH₵{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#2E2E2E]">Subtotal:</span>
                <span className="text-lg font-bold text-[#2E2E2E]">
                  GH₵{subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button className="w-full bg-[#E43C3C] text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200">
              Checkout
            </button>
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div>
        <h2 className="text-lg font-semibold text-[#2E2E2E] mb-4">Profile</h2>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#D4A574] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-medium text-sm">SC</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#2E2E2E]">Sophia Carter</p>
            <button className="text-xs text-[#E43C3C] hover:underline">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}