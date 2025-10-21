'use client';

import { useState, useEffect } from 'react';
import { Plus, SlidersHorizontal, Grid3x3, LayoutGrid, Printer, Edit2, Trash2, Eye, Table, Store, Share2 } from 'lucide-react';
import { fetchMyProducts } from '../../../lib/products';
import { Product } from '../../../types/products';
import { formatGhs, calculateDiscountPercent } from '../../../utilities/formatGhs';
import ProductCard from '@/Components/Products/cards/ProductCard';
import { userService } from '@/services/userService';


export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [copied, setCopied] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    storeName?: string;
    profilePic?: string | null;
    firstName?: string;
    lastName?: string;
    username?: string;
    id?: number;
  } | null>(null);

  useEffect(() => {
    loadProducts();
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const authResponse = await fetch('/api/auth/session', {
        credentials: 'include',
      });

      if (!authResponse.ok) {
        return;
      }

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
    if (!storeUrl) {
      alert('Store link not available yet');
      return;
    }
    
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
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product List</h1>
            <p className="text-sm text-red-900 mt-1">
              Track stock levels, availability, and restocking needs in real time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Hide Add Product, Filter, and Print buttons in customer view */}
            {viewMode === 'table' && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Product</span>
                </button>
              </>
            )}

            {/* Share Store Button - Always visible */}
            <button
              onClick={copyStoreLink}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                copied
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
              title="Share your store link"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                {copied ? 'Copied!' : 'Share Store'}
              </span>
            </button>
            
            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="Table View"
              >
                <Table className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="Customer View"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            
            {/* Hide Print button in customer view */}
            {viewMode === 'table' && (
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Printer className="w-4 h-4" />
              </button>
            )}
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
        ) : viewMode === 'grid' ? (
          /* Customer View - Grid Layout */
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            {/* Company Header */}
            <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-4">
                {/* Company/Profile Image */}
                <div className="relative">
                  {userProfile?.profilePic ? (
                    <img
                      src={userProfile.profilePic}
                      alt={userProfile.storeName || 'Store'}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center border-2 border-gray-200 shadow-sm">
                      <Store className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                  )}
                </div>

                {/* Company Name and Info */}
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {userProfile?.storeName || 'My Store'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {userProfile?.firstName && userProfile?.lastName
                      ? `${userProfile.firstName} ${userProfile.lastName}`
                      : 'Welcome to our store'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-900 border border-red-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      {products.length} Product{products.length !== 1 ? 's' : ''} Available
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-1 ">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              </div>
            </div>
            <div className="p-6">
              {/* Responsive Grid - Better column distribution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {products.map((product) => (
                  <div key={product.id} className="w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              {/* Product count */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-700">{products.length}</span> product{products.length !== 1 ? 's' : ''}
                </p>
              </div>
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