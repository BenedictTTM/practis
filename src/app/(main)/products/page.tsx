'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../../../types/products';
import { ProductsGrid } from '../../../Components/Products/cards';
import { ProductSidebar } from '../../../Components/Products/layouts';
import { HowToSection } from '../../../Components/HowTo';
import '../../../Components/Products/styles/products.css';
import FlashSales from '../../../Components/Products/layouts/FlashSales'
import Categories from '../../../Components/Products/layouts/Categories';
interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching products from frontend...');
      
      const response = await fetch('/api/products');
      console.log('📊 Frontend API response status:', response.status);
      
      const data = await response.json();
      console.log('📦 Frontend API response data:', data);

      // ✅ UPDATED DATA HANDLING
      if (response.ok) {
        console.log('✅ Products received:', data);
        const productsArray = Array.isArray(data) ? data : (data.data || []);
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('💥 Frontend fetch error:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters: FilterState) => {
    let filtered = [...products];

    // Filter by category
    if (filters.category !== 'All Categories') {
      // You would implement category filtering based on your product structure
      // filtered = filtered.filter(product => product.category === filters.category);
    }

    // Filter by price range
    filtered = filtered.filter(product => {
      const price = product.discountedPrice || product.originalPrice || 0;
      return price <= filters.priceRange[1];
    });

    // Filter by rating
    if (filters.rating > 0) {
      filtered = filtered.filter(product => {
        const rating = product.averageRating || 0;
        return rating >= filters.rating;
      });
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E43C3C] mx-auto mb-4"></div>
            <p className="text-[#2E2E2E]">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchProducts}
              className="bg-[#E43C3C] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* How To Section - At the top */}
      <HowToSection />
      
      {/* Main Content Layout - Flash Sales and Sidebar aligned */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
          {/* Left Side - Flash Sales and Products */}
          <div className="flex-1 min-w-0 lg:order-1">
            {/* Flash Sales - Now aligned with sidebar */}
            <FlashSales />
            
            {/* Products Grid */}
            <div className="py-6">
              <ProductsGrid products={showAllProducts ? filteredProducts : filteredProducts.slice(0, 8)} />
              
              {/* View All Products Button */}
              {!showAllProducts && filteredProducts.length > 8 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShowAllProducts(true)}
                    className="bg-[#E43C3C] text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    View All Products 
                  </button>
                </div>
              )}
              
              {/* Show Less Button */}
              {showAllProducts && filteredProducts.length > 8 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShowAllProducts(false)}
                    className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Show Less
                  </button>
                </div>
              )}

              {/* render Categories correctly (was a stray closing tag) */}
              <Categories />
            </div>  
          </div>

          {/* Right Side - Sidebar (Desktop) */}
          <aside className="sidebar-desktop lg:w-80 lg:flex-shrink-0 lg:order-2">
            <ProductSidebar onFiltersChange={handleFiltersChange} />
          </aside>
        </div>

        {/* Mobile Filter Button */}
        <div className="sidebar-mobile fixed bottom-4 right-4 z-50">
          <button 
            title="Open Filters"
            className="bg-[#E43C3C] text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}