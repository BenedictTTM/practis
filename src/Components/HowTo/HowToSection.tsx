'use client';

import React from 'react';
import { ShoppingBag, Package } from 'lucide-react';

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
    <div className="bg-yellow-300 py-6 px-6">
      <div className="space-y-4">
        
        {/* How to Sell Section */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          {/* Icon Container */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
              <Package className="w-5 h-5 text-green-600" />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-base font-bold text-[#2E2E2E] mb-0.5 group-hover:text-green-600 transition-colors duration-300">
              How to Sell
            </h3>
            <p className="text-black text-xs leading-relaxed">
              Learn about our curated marketplace and start selling your luxury items.
            </p>
          </div>
        </div>

        {/* How to Buy Section */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          {/* Icon Container */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-base font-bold text-[#2E2E2E] mb-0.5 group-hover:text-orange-500 transition-colors duration-300">
              How to Buy
            </h3>
            <p className="text-black text-xs leading-relaxed">
              Discover timeless pieces and enjoy a seamless shopping experience.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}