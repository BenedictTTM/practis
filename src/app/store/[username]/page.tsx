'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Store, Star, Share2, ArrowLeft } from 'lucide-react';
import ProductCard from '@/Components/Products/cards/ProductCard';
import { Product } from '@/types/products';
import Link from 'next/link';

interface StoreOwner {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  storeName?: string;
  profilePic?: string | null;
}

export default function PublicStorePage() {
  const params = useParams();
  const userId = params.username as string; // Still called 'username' in route, but we're using it as userId
  
  const [storeOwner, setStoreOwner] = useState<StoreOwner | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (userId) {
      loadStoreData();
    }
  }, [userId]);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🛒 Loading store for user ID:', userId);

      // Fetch store owner info and their products
      const response = await fetch(`/api/store/${userId}`);
      
      if (!response.ok) {
        throw new Error('Store not found');
      }

      const data = await response.json();
      console.log('✅ Store data loaded:', data);
      setStoreOwner(data.owner);
      setProducts(data.products);
    } catch (err: any) {
      console.error('Error loading store:', err);
      setError(err.message || 'Failed to load store');
    } finally {
      setLoading(false);
    }
  };

  const copyStoreLink = async () => {
    const storeUrl = `${window.location.origin}/store/${userId}`;
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStoreName = () => {
    return storeOwner?.storeName || 
           `${storeOwner?.firstName || ''} ${storeOwner?.lastName || ''}`.trim() ||
           'Store';
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !storeOwner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p className="text-gray-600 mb-4">
            The store you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation/Back Button */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Store Content - Matching Grid Customer View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Company Header - Matching Grid Page Design */}
          <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Company/Profile Image */}
              <div className="relative">
                {storeOwner.profilePic ? (
                  <img
                    src={storeOwner.profilePic}
                    alt={getStoreName()}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center border-2 border-gray-200 shadow-sm">
                    <Store className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                )}
              </div>

              {/* Company Name and Info */}
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                      {getStoreName()}
                    </h1>
                    <p className="text-sm text-gray-600 mb-3">
                      {storeOwner.firstName && storeOwner.lastName
                        ? `${storeOwner.firstName} ${storeOwner.lastName}`
                        : `@${username}`}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-900 border border-red-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        {products.length} Product{products.length !== 1 ? 's' : ''} Available
                      </span>
                    </div>
                  </div>

                  {/* Share Button */}
                  <button
                    onClick={copyStoreLink}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                      copied
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {copied ? 'Copied!' : 'Share Store'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="p-6">
            {products.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-500">This store hasn't added any products yet. Check back soon!</p>
              </div>
            ) : (
              <>
                {/* Responsive Grid - Matching Grid Page */}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
