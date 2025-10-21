'use client';

import { useRef } from 'react';
import {
  Smartphone,
  Shirt,
  BookOpen,
  Home,
  ShoppingBag,
  Sparkles,
  Printer,
  Dribbble,
} from 'lucide-react';

const categories = [
  { id: 1, name: 'Electronics & Accessories', icon: Smartphone },
  { id: 2, name: 'Fashion & Clothing', icon: Shirt },
  { id: 3, name: 'Books & Stationery', icon: BookOpen },
  { id: 4, name: 'Hostel Essentials', icon: Home },
  { id: 5, name: 'Food & Groceries', icon: ShoppingBag },
  { id: 6, name: 'Health & Beauty', icon: Sparkles },
  { id: 7, name: 'Services', icon: Printer },
  { id: 8, name: 'Sports & Entertainment', icon: Dribbble },
];

export default function CategoryBrowser() {
  const containerRef = useRef<HTMLDivElement>(null);
  const duplicatedCategories = [...categories, ...categories];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-red-500 rounded"></div>
          <span className="text-red-500 font-semibold">Categories</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Browse By Category
        </h2>
      </div>

      {/* Categories Container */}
      <div className="relative overflow-hidden">
        <div
          ref={containerRef}
          className="flex gap-3 sm:gap-4 animate-scroll-left"
        >
          {duplicatedCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={`${category.id}-${index}`}
                className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 bg-white hover:border-red-500 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex flex-col items-center justify-center h-full gap-3 sm:gap-4">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-700 group-hover:text-red-500 transition-colors" />
                  <span className="text-center text-gray-700 text-xs sm:text-sm md:text-base group-hover:text-red-500 transition-colors">
                    {category.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-left {
          display: flex;
          animation: scroll-left 30s linear infinite;
          will-change: transform;
        }

        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
