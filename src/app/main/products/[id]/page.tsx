import React from "react";
import { notFound } from "next/navigation";
import { Product } from "../../../../types/products";
import {
  ErrorMessage,
  ShareProduct,
} from "../../../../Components/Products/common";
import {
  ProductGallery,
  ProductHeader,
  ProductInfo,
  ProductOptionsClient,
  ProductDetails,
  ProductReviews,
  ProductActionsClient,
} from "../../../../Components/Products/details";

// Enable static params generation for dynamic routes
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

// Fetch product data on the server
async function getProduct(productId: string): Promise<Product | null> {
  try {
    // For server-side rendering, we need to use the full URL
    // In production, use NEXT_PUBLIC_SITE_URL; in dev, use localhost:3000
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer 
      ? (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
      : '';
    
    const url = `${baseUrl}/api/products/${productId}`;
    
    console.log(`[SSR] Fetching product ${productId} from: ${url}`);
    console.log(`[SSR] Environment:`, {
      isServer,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
      NODE_ENV: process.env.NODE_ENV,
    });
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
      cache: 'no-store',
    });

    console.log(`[SSR] Response status: ${response.status}`);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      console.error(`[SSR] Failed to fetch product ${productId}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return null;
    }

    const body = await response.json();
    console.log(`[SSR] Response body:`, JSON.stringify(body).substring(0, 200));
    
    const product = (body && (body.data ?? body)) ?? null;
    
    if (product) {
      console.log(`[SSR] Product fetched successfully: ${product.title}`);
    } else {
      console.error(`[SSR] Product data is null or undefined`);
    }
    
    return product;
  } catch (error) {
    console.error(`[SSR] Error fetching product ${productId}:`, error);
    return null;
  }
}

// Generate metadata for SEO (runs on server)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: 'Product Not Found | myPlug',
      description: 'The requested product could not be found.',
    };
  }

  const images = product?.images && product.images.length > 0
    ? product.images
    : product?.imageUrl ?? [];

  return {
    title: `${product.title} | myPlug`,
    description: product.description?.substring(0, 160) || `Buy ${product.title} at myPlug`,
    openGraph: {
      title: product.title,
      description: product.description,
      images: images.slice(0, 1),
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Fetch product data on the server - this runs before the page is sent to client
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Pre-calculate data on server
  const images =
    product?.images && product.images.length > 0
      ? product.images
      : product?.imageUrl ?? [];
  const inStock = (product?.stock ?? 0) > 0 && !product?.isSold;
  const sizes =
    product?.tags?.filter((t) =>
      /^(s|m|l|xl|xxl|3xl|4xl|5xl)$/i.test(t)
    ) ?? ["S", "M", "L", "XL", "XXL"];

  return (
    <div className="px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 md:py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
          {/* Left: Product Gallery - Render immediately */}
          <div className="lg:col-span-1 space-y-4">
            <ProductGallery
              images={images}
              title={product.title}
              selectedImageIndex={0}
            />
            <div className="mt-4 sm:mt-6">
              <ShareProduct />
            </div>
          </div>

          {/* Right: Product Details - Render immediately */}
          <div className="lg:col-span-2 space-y-8">
            {/* Critical above-the-fold content */}
            <ProductHeader product={product} />
            <ProductInfo product={product} inStock={inStock} />

            {/* Interactive elements - render directly (no skeletons) */}
            <ProductOptionsClient sizes={sizes} />

            {/* Client-side interactive actions - render directly (no skeletons) */}
            <ProductActionsClient
              product={product}
              inStock={inStock}
            />

            {/* Non-critical below-the-fold content - render directly (no skeletons) */}
            <ProductDetails product={product} />

            <ProductReviews product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
