"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "../../../../types/products";
import { 
  ProductDetailSkeleton, 
  ErrorMessage, 
  NotFoundMessage,
  ShareProduct 
} from "../../../../Components/Products/common";
import {
  ProductGallery,
  ProductHeader,
  ProductInfo,
  ProductOptions,
  ProductActions,
  ProductDetails,
  ProductReviews
} from "../../../../Components/Products/details";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string | undefined;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(!!productId);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("No product id provided.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/products/${productId}`, { signal });
        const body = await response.json().catch(() => null);
        const payload = (body && (body.data ?? body)) ?? null;

        if (!response.ok) {
          const message = payload?.message ?? response.statusText ?? "Failed to fetch product";
          setError(`Error fetching product: ${message}`);
          setProduct(null);
        } else {
          setProduct(payload as Product);
          // ensure selected image index reset
          setSelectedImageIndex(0);
          setQuantity(1);
          setSelectedSize(null);
        }
      } catch (err: any) {
        if (err.name === "AbortError") return; // ignore
        console.error(err);
        setError(String(err?.message ?? err));
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [productId]);

  // Derived data
  const images = product?.images && product.images.length > 0 ? product.images : product?.imageUrl ?? [];
  const inStock = (product?.stock ?? 0) > 0 && !product?.isSold;
  
  // Extract sizes from tags or use defaults
  const sizes = product?.tags?.filter((t) => /^(s|m|l|xl|xxl|3xl|4xl|5xl)$/i.test(t)) ?? ["S", "M", "L", "XL", "XXL"];

  // Event handlers
  function increaseQuantity() {
    if (!product?.stock) return;
    setQuantity((q) => Math.min(product.stock!, q + 1));
  }

  function decreaseQuantity() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function selectSize(size: string) {
    setSelectedSize(size);
  }

  function addToCart() {
    if (!product || !inStock) return;
    console.log("Add to cart:", { productId: product.id, quantity, selectedSize });
    alert(`${product.title} (${quantity}) added to cart`);
  }

  function retryFetch() {
    if (productId) {
      setError(null);
      // Re-trigger the fetch by updating a dependency
      setLoading(true);
    }
  }

  // Handle loading and error states
  if (loading) return <ProductDetailSkeleton />;
  
  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        subText="Try refreshing or check that the product id in the URL is correct." 
        onRetry={retryFetch}
      />
    );
  }

  if (!product) {
    return <NotFoundMessage />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images */}
        <div className="lg:col-span-1">
          <ProductGallery 
            images={images}
            title={product.title}
            selectedImageIndex={selectedImageIndex}
            onImageSelect={setSelectedImageIndex}
          />
            <ShareProduct/>
        </div>
      

        {/* Right: Details */}
        <div className="lg:col-span-2">
          <ProductHeader product={product} />

          <ProductInfo 
            product={product}
            inStock={inStock}
          />

          <ProductOptions 
            sizes={sizes}
            selectedSize={selectedSize}
            onSelectSize={selectSize}
          />

          <ProductActions 
            quantity={quantity}
            maxQuantity={product.stock}
            inStock={inStock}
            onIncreaseQuantity={increaseQuantity}
            onDecreaseQuantity={decreaseQuantity}
            onAddToCart={addToCart}
          />

          <ProductDetails product={product} />
          
          <ProductReviews product={product} />
        </div>
      </div>
    </div>
  );
}