"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Product } from "../../../../types/products";
import {
  ProductDetailSkeleton,
  ErrorMessage,
  NotFoundMessage,
  ShareProduct,
} from "../../../../Components/Products/common";
import {
  ProductGallery,
  ProductHeader,
  ProductInfo,
  ProductOptions,
  ProductActions,
  ProductDetails,
  ProductReviews,
} from "../../../../Components/Products/details";
import { addToCart as addToCartAPI } from "../../../../lib/cart";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const productId = params?.id as string | undefined;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(!!productId);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);

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
          const message =
            payload?.message ?? response.statusText ?? "Failed to fetch product";
          setError(`Error fetching product: ${message}`);
          setProduct(null);
        } else {
          setProduct(payload as Product);
          setSelectedImageIndex(0);
          setQuantity(1);
          setSelectedSize(null);
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error(err);
        setError(String(err?.message ?? err));
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [productId]);

  const images =
    product?.images && product.images.length > 0
      ? product.images
      : product?.imageUrl ?? [];
  const inStock = (product?.stock ?? 0) > 0 && !product?.isSold;
  const sizes =
    product?.tags?.filter((t) =>
      /^(s|m|l|xl|xxl|3xl|4xl|5xl)$/i.test(t)
    ) ?? ["S", "M", "L", "XL", "XXL"];

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

  async function addToCart() {
    if (!product || !inStock || addingToCart) return;

    setAddingToCart(true);
    console.log("🛒 Adding to cart:", { productId: product.id, quantity, selectedSize });

    const result = await addToCartAPI(product.id, quantity);

    if (result.success) {
      console.log("✅ Successfully added to cart:", product.title);
      alert(`${product.title} (${quantity}) added to cart successfully!`);
      setQuantity(1);
    } else {
      if (result.statusCode === 401) {
        console.log("🔐 Redirecting to login...");
        const redirectUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`;
        router.push(redirectUrl);
        return;
      }
      console.error("❌ Failed to add to cart:", result.message);
      alert(`Failed to add to cart: ${result.message}`);
    }

    setAddingToCart(false);
  }

  function retryFetch() {
    if (productId) {
      setError(null);
      setLoading(true);
    }
  }

  if (loading) return <ProductDetailSkeleton />;

  if (error) {
    return (
      <ErrorMessage
        message={error}
        subText="Try refreshing or check that the product ID in the URL is correct."
        onRetry={retryFetch}
      />
    );
  }

  if (!product) {
    return <NotFoundMessage />;
  }

  return (
    <div className="px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 md:py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
          {/* Left: Product Gallery */}
          <div className="lg:col-span-1 space-y-4">
            <ProductGallery
              images={images}
              title={product.title}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
            />
            <div className="mt-4 sm:mt-6">
              <ShareProduct />
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="lg:col-span-2 space-y-8">
            <ProductHeader product={product} />

            <ProductInfo product={product} inStock={inStock} />

            <ProductOptions
              sizes={sizes}
              selectedSize={selectedSize}
              onSelectSize={selectSize}
            />

            <ProductActions
              productId={product.id}
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
    </div>
  );
}
