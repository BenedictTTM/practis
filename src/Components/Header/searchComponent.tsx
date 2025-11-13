'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { DotLoader } from '@/Components/Loaders';
import { useRouter } from 'next/navigation';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false); // kept for UX if needed later
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  // No autocomplete: remove network calls while typing for speed.
  // Search is triggered explicitly by Enter or the Search button.

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search submit
  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsFocused(false); // Remove backdrop when search is triggered
      setQuery('');
    }
  };

  // Simple Enter handling: submit search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    // Keep focus state active when clearing to maintain UX
    // Keep focus state active when clearing to maintain UX
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Backdrop blur overlay when search is focused */}
      {isFocused && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-200"
          onClick={() => {
            setIsFocused(false);
            setShowSuggestions(false);
          }}
        />
      )}

      <div 
        className={`relative w-full mx-auto transition-all duration-300 ease-out ${
          isFocused 
            ? 'max-w-5xl scale-105 z-50' 
            : 'max-w-4xl scale-100'
        }`} 
        ref={searchRef}
      >
        <div className={`flex items-center w-full px-3 sm:px-5 py-2 sm:py-3 bg-white rounded-lg transition-all duration-300 ${
          isFocused 
            ? 'shadow-xl ring-1 ring-red-700' 
            : 'bg-gray-100 shadow-sm'
        }`}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={(e) => {
              // Delay to allow clicking suggestions
              setTimeout(() => {
                if (!searchRef.current?.contains(document.activeElement)) {
                  setIsFocused(false);
                }
              }, 200);
            }}
            className="bg-transparent outline-none text-xs sm:text-sm flex-1 min-w-0 mr-2"
          />
        
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Loading spinner */}
          {isLoading && (
            <DotLoader size={16} color="#6B7280" ariaLabel="Searching" />
          )}
          
          {/* Clear button */}
          {query && !isLoading && (
            <button
              onClick={handleClear}
              className="hover:bg-gray-200 rounded-full p-1 transition-colors flex-shrink-0"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            </button>
          )}
          
          {/* Search button */}
          <button
            onClick={() => handleSearch()}
            className="hover:bg-gray-200 rounded-full p-1 transition-colors flex-shrink-0"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* No autocomplete dropdown (removed for performance) */}
      </div>
    </>
  );
};

export default SearchComponent;