'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Product } from '../../../types/products';
import ProductActions from './ProductActions';
import { addToCart as addToCartAPI } from '../../../lib/cart';

interface ProductActionsClientProps {
  product: Product;
  inStock: boolean;
}

export default function ProductActionsClient({ product, inStock }: ProductActionsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [quantity, setQuantity] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);

  function increaseQuantity() {
    if (!product?.stock) return;
    setQuantity((q) => Math.min(product.stock!, q + 1));
  }

  function decreaseQuantity() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  async function addToCart() {
    if (!product || !inStock || addingToCart) return;

    setAddingToCart(true);
    console.log("🛒 Adding to cart:", { productId: product.id, quantity });

    const result = await addToCartAPI(product.id, quantity);

    if (result.success) {
      console.log("✅ Successfully added to cart:", product.title);
      alert(`${product.title} (${quantity}) added to cart successfully!`);
      setQuantity(1);
    } else {
        console.error("❌ Failed to add to cart:", result.message);
    }

    setAddingToCart(false);
  }

  return (
    <ProductActions
      productId={product.id}
      quantity={quantity}
      maxQuantity={product.stock}
      inStock={inStock}
      onIncreaseQuantity={increaseQuantity}
      onDecreaseQuantity={decreaseQuantity}
      onAddToCart={addToCart}
      productData={product}
    />
  );
}
