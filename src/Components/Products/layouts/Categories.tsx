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
  Dribbble 
} from 'lucide-react';

const categories = [
  { id: 1, name: 'Electronics & Accessories', icon: Smartphone },
  { id: 2, name: 'Fashion & Clothing', icon: Shirt },
  { id: 3, name: 'Books & Stationery', icon: BookOpen },
  { id: 4, name: 'Hostel Essentials', icon: Home },
  { id: 5, name: 'Food & Groceries', icon: ShoppingBag },
  { id: 6, name: 'Health & Beauty', icon: Sparkles },
  { id: 7, name: 'Services', icon: Printer },
  { id: 8, name: 'Sports & Entertainment', icon: Dribbble }
];

export default function CategoryBrowser() {
  const containerRef = useRef(null);

  // Duplicate categories for seamless infinite scroll
  const duplicatedCategories = [...categories, ...categories];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-red-500 rounded"></div>
          <span className="text-red-500 font-semibold">Categories</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Browse By Category</h2>
      </div>

      {/* Categories Container with Auto-scroll */}
      <div className="relative overflow-hidden">
        <div
          className="flex gap-4 animate-scroll-left"
          ref={containerRef}
        >
          {duplicatedCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={`${category.id}-${index}`}
                className="flex-shrink-0 w-[200px] border border-gray-200 rounded-lg p-6 hover:border-red-500 transition-all group cursor-pointer hover:shadow-lg"
              >
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <Icon className="w-12 h-12 text-gray-700 group-hover:text-red-500 transition-colors" />
                  <span className="text-center text-gray-700 group-hover:text-red-500 transition-colors text-sm md:text-base">
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
          animation: scroll-left 30s linear infinite;
        }

        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}