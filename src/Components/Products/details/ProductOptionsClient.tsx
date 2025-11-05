'use client';

import React, { useState } from 'react';
import ProductOptions from './ProductOptions';

interface ProductOptionsClientProps {
  sizes: string[];
}

export default function ProductOptionsClient({ sizes }: ProductOptionsClientProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <ProductOptions
      sizes={sizes}
      selectedSize={selectedSize}
      onSelectSize={(size) => setSelectedSize(size)}
    />
  );
}
