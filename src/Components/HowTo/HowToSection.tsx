'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { BiPackage } from 'react-icons/bi';

/**
 * HowToSection - Interactive guide showing how to buy and sell
 * - Uses reusable Card component
 * - Smaller, responsive cards
 * - Clean hover and scaling animations
 */

export default function HowToSection() {
  return (
    <div className=" pt-4 md:pt-8 bg-gray-50 ">
      <div className="flex flex-wrap justify-center gap-32">
        <InfoCard
          title="How to Sell"
          description="Learn about our curated marketplace and start selling your luxury items."
          icon={<BiPackage className="w-4 h-4 text-red-600" />}
          hoverColor="red"
        />

        <InfoCard
          title="How to Buy"
          description="Discover timeless pieces and enjoy a seamless shopping experience."
          icon={<ShoppingBag className="w-4 h-4 text-red-500" />}
          hoverColor="red"
        />
      </div>
    </div>
  );
}

/** 
 * Reusable InfoCard component 
 * - Accepts title, description, icon, and hover color props
 */
function InfoCard({
  title,
  description,
  icon,
  hoverColor = 'red',
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  hoverColor?: string;
}) {
  return (
    <div
      className={`flex items-center space-x-2 group cursor-pointer 
      bg-white rounded-lg p-3 sm:p-4 
      hover:shadow-md transition-all duration-300 border border-gray-100
      w-[90%] sm:w-[45%] md:w-[40%] lg:w-[30%]`}
    >
      {/* Icon Container */}
      <div className="flex-shrink-0">
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 bg-${hoverColor}-50 
          rounded-lg flex items-center justify-center 
          group-hover:bg-${hoverColor}-100 transition-colors duration-300`}
        >
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3
          className={`text-sm sm:text-base font-semibold text-[#2E2E2E] mb-0.5 
          group-hover:text-${hoverColor}-600 transition-colors duration-300`}
        >
          {title}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm leading-snug">
          {description}
        </p>
      </div>
    </div>
  );
}
