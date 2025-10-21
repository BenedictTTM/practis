'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const TopBar = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];

  return (
    <div className="bg-black text-gray-100 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl">
        <div className="flex items-center justify-between py-2 sm:py-2.5 gap-2 min-h-[40px]">
          {/* Promotional Message */}
          <div className="flex-1 text-center text-xs sm:text-sm font-light pr-20 sm:pr-24">
            <span className="hidden sm:inline">
              Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{' '}
            </span>
            <span className="sm:hidden">
              Summer Sale - OFF 50%!{' '}
            </span>
            <Link 
              href="/shop"
              className="font-semibold underline hover:text-white transition-colors ml-1 sm:ml-2"
            >
              ShopNow
            </Link>
          </div>

          {/* Language Selector */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 text-xs sm:text-sm hover:text-white transition-colors py-1 px-2 rounded hover:bg-gray-800"
              aria-label="Select language"
              aria-expanded={isDropdownOpen}
            >
              <span className="hidden sm:inline">{selectedLanguage}</span>
              <span className="sm:hidden">
                {selectedLanguage.substring(0, 2).toUpperCase()}
              </span>
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop for mobile */}
                <div 
                  className="fixed inset-0 z-10 sm:hidden"
                  onClick={() => setIsDropdownOpen(false)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;