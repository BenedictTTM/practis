'use client';

import React from 'react';
import CategorySidebar from '../Categories/categorySidebar';
import Image from 'next/image';
import IphoneImage from '../../../public/iphone.png';

export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row bg-white w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-60 lg:w-72 xl:w-80 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-100 p-4 md:p-6">
        <CategorySidebar />
      </aside>

      {/* Hero Image */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="relative w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[70%]">
          <Image
            src={IphoneImage}
            alt="Hero Image"
            width={1300}
            height={750}
            className="w-full h-auto object-contain rounded-md shadow-md transition-transform duration-500 hover:scale-[1.02]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
