'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { searchProducts } from '@/services/searchService';
import { SearchResult } from '@/types/search';
import { Loader2, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/Components/Products/cards/ProductCard';
import Link from 'next/link';
import SearchComponent from '@/Components/Header/searchComponent';


export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || 'relevance';

  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedSort, setSelectedSort] = useState(sortBy);
  const [showFilters, setShowFilters] = useState(false);
  const [allCategories, setAllCategories] = useState<{ name: string; count: number }[]>([]);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = await searchProducts({
          q: query,
          category: selectedCategory || undefined,
          sortBy: selectedSort as any,
          page: currentPage,
          limit: 20,
        });
        setResults(data);
        
        // Store categories if they exist and we don't have them yet
        if (data.filters?.categories && data.filters.categories.length > 0) {
          setAllCategories(data.filters.categories);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, selectedCategory, selectedSort, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory, selectedSort]);

  if (isLoading && !results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      {/* Search Component */}
      <div className="mb-8">
        <SearchComponent />
      </div>

      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Search
          </Link>
          {query && (
            <>
              <span>/</span>
              <span className="text-gray-700 font-medium">{query}</span>
            </>
          )}
        </nav>
        <p className="text-gray-600">
          {results?.total || 0} products found
        </p>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <aside className={`w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className=" p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-6">Filters</h2>

            {/* Category Section */}
            {allCategories.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-[#D84E55] mb-4 text-center">
                  Category
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center w-full px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={!selectedCategory}
                      onChange={() => setSelectedCategory('')}
                      className="w-5 h-5 text-black border-2 border-gray-300 focus:ring-2 focus:ring-black focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="ml-3 text-sm text-gray-700">All Categories</span>
                  </label>

                  {allCategories.map((cat) => (
                    <label
                      key={cat.name}
                      className="flex items-center w-full px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.name}
                        checked={selectedCategory === cat.name}
                        onChange={() => setSelectedCategory(cat.name)}
                        className="w-5 h-5 text-black border-2 border-gray-300 focus:ring-2 focus:ring-black focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="ml-3 text-sm text-gray-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range Section */}
            {results?.filters.priceRange && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-[#D84E55] mb-4 text-center">
                  Price Range
                </h3>
                <div className="px-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">Price</p>
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min={results.filters.priceRange.min}
                      max={results.filters.priceRange.max}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
                      style={{
                        background: `linear-gradient(to right, #1f2937 0%, #1f2937 50%, #e5e7eb 50%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm font-medium text-gray-700">
                        ${results.filters.priceRange.min}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        ${results.filters.priceRange.max}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sort By Section */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-[#D84E55] mb-4 text-center">
                Sort By
              </h3>
              <div className="space-y-2">
                <label className="flex items-center w-full px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="sort"
                    value="price-asc"
                    checked={selectedSort === 'price-asc'}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="w-5 h-5 text-black border-2 border-gray-300 focus:ring-2 focus:ring-black focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-gray-700">Price: Low to High</span>
                </label>

                <label className="flex items-center w-full px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="sort"
                    value="price-desc"
                    checked={selectedSort === 'price-desc'}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="w-5 h-5 text-black border-2 border-gray-300 focus:ring-2 focus:ring-black focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-gray-700">Price: High to Low</span>
                </label>

                <label className="flex items-center w-full px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="sort"
                    value="rating-desc"
                    checked={selectedSort === 'rating-desc'}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="w-5 h-5 text-black border-2 border-gray-300 focus:ring-2 focus:ring-black focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-gray-700">Rating: High to Low</span>
                </label>
              </div>
            </div>
          </div>
        </aside>


        {/* Results */}
        <main className="flex-1">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : results?.products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 mb-4">No products found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-2 md:gap-3 auto-rows-fr">
                {results?.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {results && results.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {results.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(results.totalPages, p + 1))}
                    disabled={currentPage === results.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
