'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProductCategory } from '@/constants/categories';
import ProductCard, { Product as ProductCardType } from '@/Components/Products/cards/ProductCard';
import { FiFilter, FiX } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  condition: string;
  category: ProductCategory;
  images: string[];
  inStock: boolean;
  user: {
    id: string;
    username: string;
  };
  createdAt: string;
  averageRating?: number;
  _count?: { reviews?: number };
}

interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface CategoryProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination: PaginationData;
  cached?: boolean;
  timestamp?: string;
}

interface CategoryProductsClientProps {
  category: ProductCategory;
  categoryLabel: string;
  categoryDescription: string;
  initialPage?: number;
  initialSortBy?: string;
  initialCondition?: string;
  initialMinPrice?: number;
  initialMaxPrice?: number;
  initialInStock?: boolean;
}

export default function CategoryProductsClient({
  category,
  categoryLabel,
  categoryDescription,
  initialPage = 1,
  initialSortBy = 'newest',
  initialCondition,
  initialMinPrice,
  initialMaxPrice,
  initialInStock = true,
}: CategoryProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [page, setPage] = useState(initialPage);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [condition, setCondition] = useState(initialCondition || '');
  const [minPrice, setMinPrice] = useState(initialMinPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice?.toString() || '');
  const [inStock, setInStock] = useState(initialInStock);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [category, page, sortBy, condition, minPrice, maxPrice, inStock]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        sortBy,
        inStock: inStock.toString(),
      });

      if (condition) params.append('condition', condition);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const response = await fetch(
        `/api/products/categories/${category}?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: CategoryProductsResponse = await response.json();

      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to load products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching category products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update URL with filters
  const updateFilters = () => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (sortBy !== 'newest') params.set('sortBy', sortBy);
    if (condition) params.set('condition', condition);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (!inStock) params.set('inStock', 'false');

    router.push(`/category/${category}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const resetFilters = () => {
    setPage(1);
    setSortBy('newest');
    setCondition('');
    setMinPrice('');
    setMaxPrice('');
    setInStock(true);
    router.push(`/category/${category}`);
  };

  // Map backend product to ProductCard format
  const mapToProductCard = (product: Product): ProductCardType => ({
    id: parseInt(product.id),
    title: product.name,
    imageUrl: product.images,
    originalPrice: product.price,
    discountedPrice: product.price,
    averageRating: product.averageRating,
    totalReviews: product._count?.reviews,
    _count: product._count,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">{categoryLabel}</h1>
          <p className="mt-2 text-gray-600">{categoryDescription}</p>
          
          {pagination && (
            <p className="mt-2 text-sm text-gray-500">
              {pagination.totalCount} product{pagination.totalCount !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiFilter />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              aria-label="Sort products"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="condition-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  id="condition-filter"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">All Conditions</option>
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="No limit"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="inStock"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label htmlFor="inStock" className="text-sm text-gray-700">
                In Stock Only
              </label>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={updateFilters}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <FiX />
                Reset
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <BiLoaderAlt className="w-10 h-10 animate-spin text-black" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={mapToProductCard(product)} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>

                <span className="px-4 py-2 text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No products found in this category</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
