'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(4);
      } else {
        setItemsPerView(6);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, categories.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

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

      {/* Categories Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all ${
            currentIndex === 0
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-gray-200 hover:shadow-md'
          }`}
          aria-label="Previous categories"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Categories Grid */}
        <div className="overflow-hidden" ref={containerRef}>
          <div
            className="flex transition-transform duration-300 ease-in-out gap-4"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
            }}
          >
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="flex-shrink-0 border border-gray-100 rounded-lg p-6 hover:border-red-50 transition-all group cursor-pointer"
                  style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)` }}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Icon className="w-12 h-12 text-gray-400 font-light   transition-colors" />
                    <span className="text-center text-gray-900 transition-colors text-sm md:text-base">
                      {category.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all ${
            currentIndex >= maxIndex
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-gray-200 hover:shadow-md'
          }`}
          aria-label="Next categories"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}