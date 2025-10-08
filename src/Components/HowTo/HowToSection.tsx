'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { BiPackage } from 'react-icons/bi';

/**
 * HowToSection - Interactive guide section showing how to buy and sell
 * 
 * Features:
 * - Dual-section layout (Buy & Sell)
 * - Icon-based visual design
 * - Hover animations
 * - Clear call-to-action text
 * - Responsive design
 */
export default function HowToSection() {
  return (
    <div className="py-3 px-6 bg-gray-50 border-b border-gray-200">
      <div className="flex gap-4">
        {/* How to Sell Section */}
        <div className="flex items-center space-x-2 group cursor-pointer flex-1 bg-white rounded-lg p-2.5 hover:shadow-sm transition-all duration-300 border border-gray-50">
          {/* Icon Container */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors duration-300">
              <BiPackage className="w-4 h-4 text-red-600" />
            </div>
          </div>
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#2E2E2E] mb-0.5 group-hover:text-red-600 transition-colors duration-300">
              How to Sell
            </h3>
            <p className="text-gray-600 text-xs leading-snug">
              Learn about our curated marketplace and start selling your luxury items.
            </p>
          </div>
        </div>

        {/* How to Buy Section */}
        <div className="flex items-center space-x-2 group cursor-pointer flex-1 bg-white rounded-lg p-2.5 hover:shadow-sm transition-all duration-300 border border-gray-100">
          {/* Icon Container */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors duration-300">
              <ShoppingBag className="w-4 h-4 text-red-500" />
            </div>
          </div>
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#2E2E2E] mb-0.5 group-hover:text-red-500 transition-colors duration-300">
              How to Buy
            </h3>
            <p className="text-gray-600 text-xs leading-snug">
              Discover timeless pieces and enjoy a seamless shopping experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}