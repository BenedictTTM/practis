'use client';

import { useRef, useState, useEffect } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number | null>(null);
  const duplicatedCategories = [...categories, ...categories];

  // Auto-scroll animation using RAF instead of CSS
  useEffect(() => {
    if (!containerRef.current || isPaused) return;

    let scrollPosition = containerRef.current.scrollLeft;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      if (!containerRef.current || isPaused) return;

      scrollPosition += scrollSpeed;
      
      // Reset to beginning when reached halfway (seamless loop)
      const maxScroll = containerRef.current.scrollWidth / 2;
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }

      containerRef.current.scrollLeft = scrollPosition;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsPaused(false);
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle hover to pause animation
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeaveContainer = () => {
    if (!isDragging) {
      setIsPaused(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-red-500 rounded"></div>
          <span className="text-red-500 font-semibold">Categories</span>
        </div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
          Browse By Category
        </h2>
      </div>

      {/* Categories Container */}
      <div className="relative overflow-hidden">
        <div
          ref={containerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveContainer}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
        >
          {duplicatedCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={`${category.id}-${index}`}
                className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 bg-white hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer group select-none"
              >
                <div className="flex flex-col items-center justify-center h-full gap-3 sm:gap-4">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-700 group-hover:text-red-500 transition-colors" />
                  <span className="text-center text-gray-700 text-xs sm:text-sm md:text-base group-hover:text-red-900 transition-colors">
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
        .cursor-grab {
          cursor: grab;
        }

        .cursor-grab:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
}
