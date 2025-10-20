'use client';

import { useState, useEffect } from 'react';
import { Plus, SlidersHorizontal, Grid3x3, LayoutGrid, Printer, Edit2, Trash2 } from 'lucide-react';
import { fetchMyProducts } from '../../../lib/products';
import { Product } from '../../../types/products';
import { formatGhs, calculateDiscountPercent } from '../../../utilities/formatGhs';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchMyProducts();
      
      if (result.success && result.data) {
        setProducts(result.data);
        console.log('✅ Loaded user products:', result.data.length);
      } else {
        setError(result.message || 'Failed to load products');
      }
    } catch (err) {
      console.error('💥 Error loading products:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.isSold) {
      return { label: 'Sold Out', color: 'text-red-600 bg-red-50' };
    }
    if (!product.stock || product.stock === 0) {
      return { label: 'Sold Out', color: 'text-red-600 bg-red-50' };
    }
    if (product.stock <= 5) {
      return { label: 'Low Stock', color: 'text-yellow-600 bg-yellow-50' };
    }
    return { label: 'In Stock', color: 'text-green-600 bg-green-50' };
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((pid) => pid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="w-full">
        <div className="w-full max-w-none">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full">
        <div className="w-full max-w-none">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={loadProducts}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full max-w-none">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product List</h1>
            <p className="text-sm text-red-900 mt-1">
              Track stock levels, availability, and restocking needs in real time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Product</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Grid3x3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first product</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Product</span>
              </button>
            </div>
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Product ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Stock Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product);
                    const discountPercent = calculateDiscountPercent(product.originalPrice, product.discountedPrice);
                    
                    return (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => toggleSelect(product.id)}
                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          #{product.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {product.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.category || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {formatGhs(product.discountedPrice)}
                            </span>
                            {discountPercent > 0 && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatGhs(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {product.views || 0}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${stockStatus.color}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0"></span>
                            {stockStatus.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer - Product Count */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-900">{products.length}</span> product{products.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}