'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { DotLoader } from '@/Components/Loaders';
import { useRouter } from 'next/navigation';
import { debouncedAutocomplete } from '@/services/searchService';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch autocomplete suggestions (using optimized debounced function)
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Use the optimized debouncedAutocomplete from searchService
    // It handles debouncing, caching, and deduplication automatically
    debouncedAutocomplete(query, 5)
      .then((results) => {
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      })
      .catch((error) => {
        console.error('Failed to get suggestions:', error);
        setSuggestions([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search submit
  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setIsFocused(false); // Remove backdrop when search is triggered
      setQuery('');
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSearch(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
    // handleSearch already sets isFocused to false, so backdrop will be removed
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
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

      {/* Autocomplete suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-5 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                index === selectedIndex ? 'bg-gray-100' : ''
              }`}
            >
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
      </div>
    </>
  );
};

export default SearchComponent;