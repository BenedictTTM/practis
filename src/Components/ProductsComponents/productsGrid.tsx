import React from 'react';
import { ProductDetail } from '../../types/products';
import ProductCard from './productCard';
import SectionHeader from './sectionHeader';

interface ProductsGridProps {
  products: ProductDetail[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="mt-16">
        <div className="text-center py-12">
          <p className="text-gray-500">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      {/* Horizontal Scrolling Container */}
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide px-4">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-64"> {/* Adjusted width for new card design */}
            <ProductCard
              product={product}
            />
          </div>
        ))}
      </div>
    </div>
  );
}