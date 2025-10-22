'use client';

import React from 'react';
import { Facebook, Twitter, MessageCircle } from 'lucide-react';

export default function ShareProduct() {
  type SharePlatform = 'facebook' | 'twitter' | 'whatsapp' | string;

  const handleShare = (platform: SharePlatform) => {
    const url = window.location.href;
    const title = document.title;

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        break;
    }
  };

  return (
    <section className="py-6 px-2 sm:px-4 md:px-6 w-full">
      <h2 className="text-gray-800 text-base sm:text-lg md:text-xl font-semibold mb-4 tracking-wide text-center sm:text-left">
        SHARE THIS PRODUCT
      </h2>

      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook')}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          aria-label="Share on Facebook"
        >
          <Facebook size={22} className="text-blue-600" />
        </button>

        {/* Twitter */}
        <button
          onClick={() => handleShare('twitter')}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gray-300 flex items-center justify-center hover:border-sky-500 hover:bg-sky-50 transition-all duration-200 focus:ring-2 focus:ring-sky-300 focus:outline-none"
          aria-label="Share on Twitter"
        >
          <Twitter size={22} className="text-sky-500" />
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => handleShare('whatsapp')}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-600 hover:bg-green-50 transition-all duration-200 focus:ring-2 focus:ring-green-300 focus:outline-none"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle size={22} className="text-green-600" />
        </button>
      </div>
    </section>
  );
}
