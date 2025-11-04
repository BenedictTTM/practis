'use client';

import dynamic from 'next/dynamic';
import { memo } from 'react';
import { Store } from 'lucide-react';
import type { Product } from '@/types/products';

interface UserProfileSummary {
  storeName?: string;
  profilePic?: string | null;
  firstName?: string;
  lastName?: string;
  username?: string;
  id?: number;
}

interface GridViewProps {
  products: Product[];
  userProfile: UserProfileSummary | null;
}

const ProductCardFallback = () => (
  <div className="h-[320px] w-full rounded-2xl border border-gray-200 bg-gray-100 animate-pulse" />
);

const ProductCard = dynamic(() => import('@/Components/Products/cards/ProductCard'), {
  loading: () => <ProductCardFallback />,
});

function GridView({ products, userProfile }: GridViewProps) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row items-center gap-4">
        {userProfile?.profilePic ? (
          <img
            src={userProfile.profilePic}
            alt={userProfile.storeName || 'Store'}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-200 shadow-sm">
            <Store className="w-8 h-8 text-white" />
          </div>
        )}

        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            {userProfile?.storeName || 'My Store'}
          </h2>
          <p className="text-sm text-gray-600">
            {userProfile?.firstName
              ? `${userProfile.firstName} ${userProfile.lastName}`
              : 'Welcome to our store'}
          </p>
          <p className="inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-900 border border-red-200">
            {products.length} Product{products.length !== 1 ? 's' : ''} Available
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold">{products.length}</span>{' '}
            product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(GridView);
