'use client';

import React from 'react';
import CategorySidebar from '../Categories/categorySidebar';
import Image from 'next/image';
import IphoneImage from '../../../public/iphone.png';

export default function HeroSection() {
  return (
    <div className="flex h-110 relative bg-white">
      {/* Sidebar (left) - responsive fixed width */}
      <div className="flex-none w-44 sm:w-52 md:w-64 lg:w-72 xl:w-80 p-4">
        <CategorySidebar />
      </div>

      {/* Image (right) - center, constrained, with padding for breathing room */}
      <div className="flex-1 flex items-center justify-center p-6 py-20 sm:py-8">
        <div className="w-full h-full max-w-[80%] flex items-center justify-center -p-l-6">
          <Image
            src={IphoneImage}
            alt="Hero Image"
            width={1300}
            height={750}
            className="object-contain rounded-sm shadow-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
}