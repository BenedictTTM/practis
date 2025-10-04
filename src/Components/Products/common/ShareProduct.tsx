'use client';

import React from 'react';
import { Facebook, Twitter, MessageCircle } from 'lucide-react';

export default function ShareProduct() {
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = document.title;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank', 'width=600,height=400');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        break;
    }
  };

  return (
    <div className="py-6">
      <h2 className="text-gray-800 text-lg font-semibold mb-4 tracking-wide">
        SHARE THIS PRODUCT
      </h2>
      
      <div className="flex gap-3">
        <button
          onClick={() => handleShare('facebook')}
          className="w-8 h-8 rounded-full border-1 border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook size={20} className="text-blue-600" />
        </button>
        
        <button
          onClick={() => handleShare('twitter')}
          className="w-8 h-8 rounded-full border-1 border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter size={20} className="text-blue-400" />
        </button>
        
        <button
          onClick={() => handleShare('whatsapp')}
          className="w-8 h-8 rounded-full border-1 border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle size={20} className="text-green-600" />
        </button>
      </div>
    </div>
  );
}