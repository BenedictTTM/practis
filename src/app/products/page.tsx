'use client';

import React, { useState, useEffect } from 'react';
import { ProductDetail } from '../../types/products';
import HeroSection from '../../Components/Hero/hero';
import { ProductsGrid } from '../../Components/ProductsComponents/productCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setProducts(Array.isArray(data) ? data : (data.data || []));
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

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <HeroSection />

      {/* Products Section */}
      <div className="px-8 py-28">
          <>
            <ProductsGrid products={products} /> 
          </>
      </div>
    </div>
  );
}