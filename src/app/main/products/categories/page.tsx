'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductsGridLayout from '@/Components/Products/layouts/ProductsGridLayout';
import { Product } from '@/types/products';
import { ProductCategory, getCategoryLabel } from '@/app/api/products/categories/types';
import {
  Shirt,
  Watch,
  Home,
  BookOpen,
  Dumbbell,
  MoreHorizontal,
} from 'lucide-react';

/**
 * Category icon mapping
 */
const categoryIcons: Record<ProductCategory, React.ElementType> = {
  [ProductCategory.CLOTHES]: Shirt,
  [ProductCategory.ACCESSORIES]: Watch,
  [ProductCategory.HOME]: Home,
  [ProductCategory.BOOKS]: BookOpen,
  [ProductCategory.SPORTS_AND_OUTING]: Dumbbell,
  [ProductCategory.OTHERS]: MoreHorizontal,
};

/**
 * Categories Page Component
 */
function CategoriesPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') as ProductCategory | null;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!category) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '20',
        });

        const response = await fetch(
          `/api/products/categories/${category}?${queryParams}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch category products');
        }

        const data = await response.json();

        if (data.success) {
          setProducts(data.data || []);
          setTotalPages(data.pagination?.totalPages || 1);
        } else {
          throw new Error(data.message || 'Failed to load products');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category, page]);

  // Get category icon
  const CategoryIcon = category ? categoryIcons[category] : null;
  const categoryLabel = category ? getCategoryLabel(category) : 'All Categories';

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {CategoryIcon && (
              <div className="p-3 bg-red-100 rounded-lg">
                <CategoryIcon className="w-8 h-8 text-red-600" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {categoryLabel}
              </h1>
              {!loading && products.length > 0 && (
                <p className="text-gray-600 mt-1">
                  {products.length} product{products.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-red-900">Error Loading Products</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* No Category Selected */}
        {!category && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">
              Select a Category
            </h2>
            <p className="text-blue-700">
              Please select a category to view products
            </p>
          </div>
        )}

        {/* Products Grid */}
        <ProductsGridLayout 
          products={products} 
          loading={loading}
          className="mb-8"
        />

        {/* Pagination */}
        {!loading && products.length > 0 && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Categories Page with Suspense wrapper
 */
export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      }
    >
      <CategoriesPageContent />
    </Suspense>
  );
}
