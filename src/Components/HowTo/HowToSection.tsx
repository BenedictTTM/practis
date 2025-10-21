'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { BiPackage } from 'react-icons/bi';

/**
 * HowToSection - Interactive guide showing how to buy and sell
 * - Fully responsive from 320px to 1440px+
 * - Uses CSS Grid for better control
 * - Proper Tailwind dynamic classes
 */

export default function HowToSection() {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Grid layout - stacks on mobile, 2 cols on tablet+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          <InfoCard
            title="How to Sell"
            description="Learn about our curated marketplace and start selling your luxury items."
            icon={<BiPackage className="w-5 h-5 sm:w-6 sm:h-6" />}
            iconBgColor="bg-red-50"
            iconHoverBgColor="bg-red-100"
            textHoverColor="text-red-600"
            iconColor="text-red-600"
          />

          <InfoCard
            title="How to Buy"
            description="Discover timeless pieces and enjoy a seamless shopping experience."
            icon={<ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />}
            iconBgColor="bg-red-50"
            iconHoverBgColor="bg-red-100"
            textHoverColor="text-red-600"
            iconColor="text-red-500"
          />
        </div>
      </div>
    </section>
  );
}

/** 
 * Reusable InfoCard component 
 * - Fixed dynamic Tailwind class issues
 * - Proper touch targets for accessibility
 * - Optimized responsive breakpoints
 */
interface InfoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconHoverBgColor?: string;
  textHoverColor?: string;
  iconColor?: string;
}

function InfoCard({
  title,
  description,
  icon,
  iconBgColor = 'bg-red-50',
  iconHoverBgColor = 'bg-red-100',
  textHoverColor = 'text-red-600',
  iconColor = 'text-red-600',
}: InfoCardProps) {
  return (
    <div
      className="flex items-start sm:items-center gap-3 sm:gap-4 group cursor-pointer 
      bg-white rounded-xl p-4 sm:p-5 lg:p-6
      hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
      transition-all duration-300 border border-gray-200
      min-h-[120px] sm:min-h-[130px]"
      role="article"
      tabIndex={0}
    >
      {/* Icon Container */}
      <div className="flex-shrink-0">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14
          ${iconBgColor} group-hover:${iconHoverBgColor}
          rounded-xl flex items-center justify-center 
          transition-colors duration-300 ${iconColor}`}
        >
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className={`text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2
          group-hover:${textHoverColor} transition-colors duration-300`}
        >
          {title}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}