'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import {
  Plus,
  Grid3x3,
  Printer,
  Edit2,
  Trash2,
  Eye,
  Table,
  Share2,
} from 'lucide-react';
import { fetchMyProducts } from '../../../lib/products';
import { Product } from '../../../types/products';
import { formatGhs, calculateDiscountPercent } from '../../../utilities/formatGhs';
import { userService } from '@/services/userService';

interface UserProfileSummary {
  storeName?: string;
  profilePic?: string | null;
  firstName?: string;
  lastName?: string;
  username?: string;
  id?: number;
}

const GridView = dynamic(() => import('./components/GridView'), {
  loading: () => (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white animate-pulse">
        <div className="h-14 w-48 bg-gray-200 rounded-lg" />
      </div>
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-[320px] w-full rounded-2xl border border-gray-200 bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    </div>
  ),
});

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [copied, setCopied] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileSummary | null>(null);

  useEffect(() => {
    loadProducts();
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const authResponse = await fetch('/api/auth/session', {
        credentials: 'include',
      });

      if (!authResponse.ok) return;

      const authData = await authResponse.json();
      const currentUserId = authData.user?.id || authData.id;

      if (currentUserId) {
        const profile = await userService.getUserProfile(currentUserId);
        setUserProfile({
          id: profile.id,
          storeName: profile.storeName,
          profilePic: profile.profilePic,
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
        });
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
    }
  };

  const getStoreUrl = () => {
    if (typeof window !== 'undefined' && userProfile?.id) {
      return `${window.location.origin}/store/${userProfile.id}`;
    }
    return '';
  };

  const copyStoreLink = async () => {
    const storeUrl = getStoreUrl();
    if (!storeUrl) return alert('Store link not available yet');
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link');
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchMyProducts();

      if (result.success && result.data) {
        setProducts(result.data);
      } else {
        setError(result.message || 'Failed to load products');
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.isSold || !product.stock || product.stock === 0)
      return { label: 'Sold Out', color: 'text-red-600 bg-red-50' };
    if (product.stock <= 5)
      return { label: 'Low Stock', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'In Stock', color: 'text-green-600 bg-green-50' };
  };

  const toggleSelectAll = () =>
    setSelectedProducts(
      selectedProducts.length === products.length ? [] : products.map((p) => p.id)
    );

  const toggleSelect = (id: number) =>
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your products...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product List</h1>
          <p className="text-sm text-red-900 mt-1">
            Track stock levels, availability, and restocking needs in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          {viewMode === 'table' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Product</span>
            </button>
          )}

          <button
            onClick={copyStoreLink}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition ${
              copied
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">{copied ? 'Copied!' : 'Share Store'}</span>
          </button>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 transition ${
                viewMode === 'table'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              aria-label="Switch to table view"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition ${
                viewMode === 'grid'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              aria-label="Switch to grid view"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {viewMode === 'table' && (
            <button
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              aria-label="Print product list"
            >
              <Printer className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Grid3x3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-4">Create your first product to get started.</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Product</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <GridView products={products} userProfile={userProfile} />
      ) : (
        // Table View
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                      aria-label="Select all products"
                    />
                  </th>
                  {[
                    'Product ID',
                    'Name',
                    'Category',
                    'Price',
                    'Views',
                    'Stock',
                    'Action',
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const stockStatus = getStockStatus(product);
                  const discountPercent = calculateDiscountPercent(
                    product.originalPrice,
                    product.discountedPrice
                  );

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 sm:px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                          aria-label={`Select product ${product.title}`}
                        />
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">
                        #{product.id}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-800">{product.title}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                        {product.category || 'Uncategorized'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        <span className="font-medium text-gray-900">
                          {formatGhs(product.discountedPrice)}
                        </span>
                        {discountPercent > 0 && (
                          <span className="text-xs text-gray-400 line-through ml-1">
                            {formatGhs(product.originalPrice)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                        {product.views || 0}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                            aria-label={`Edit ${product.title}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                            aria-label={`Delete ${product.title}`}
                          >
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
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{products.length}</span>{' '}
              product{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
