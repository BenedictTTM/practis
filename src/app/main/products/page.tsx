'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../../../types/products';
import { ProductsGridLayout, ProductSidebar, FlashSalesSection } from '../../../Components/Products/layouts';
import { HowToSection } from '../../../Components/HowTo';
import '../../../Components/Products/styles/products.css';
import Categories from '../../../Components/Products/layouts/Categories';
import ServiceFeatures from '../../../Components/Products/layouts/serviceFeatures';

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

      if (response.ok) {
        const productsArray = Array.isArray(data) ? data : data.data || [];
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
      // Implement category filter here when product structure supports it
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E43C3C] mx-auto mb-4"></div>
          <p className="text-[#2E2E2E]">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* How To Section */}
      <HowToSection />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto py-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Left Side - Products + Flash Sales */}
          <div className="flex-1">
            {/* Flash Sales */}
            <FlashSalesSection
              initialProducts={products}
              minDiscount={20}
              maxProducts={8}
              onProductsLoaded={(flashProducts) =>
                console.log('Flash sales loaded:', flashProducts.length)
              }
              onError={(err) => console.error('Flash sales error:', err)}
            />

            {/* Category Section */}
            <div className="py-6">
              <Categories />
            </div>

            {/* Product Grid Section */}
            <div className="py-6 px-4">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-6 bg-red-500 rounded"></div>
                  <span className="text-red-500 font-semibold">Products</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Browse Our Products
                </h2>
              </div>

              <ProductsGridLayout
                products={showAllProducts ? filteredProducts : filteredProducts.slice(0, 12)}
                loading={loading}
              />

              {/* View All / Show Less Button */}
              {filteredProducts.length > 8 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShowAllProducts(!showAllProducts)}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg ${
                      showAllProducts
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-[#E43C3C] text-white hover:bg-red-600'
                    }`}
                  >
                    {showAllProducts ? 'Show Less' : 'View All Products'}
                  </button>
                </div>
              )}
            </div>

            {/* Service Features Section */}
            <ServiceFeatures />
          </div>

          {/* Right Side - Sidebar */}
          <aside className="lg:w-80 lg:flex-shrink-0">
            <ProductSidebar onFiltersChange={handleFiltersChange} />
          </aside>
        </div>
      </div>
    </div>
  );
}
