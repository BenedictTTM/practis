'use client';

import type { ChangeEvent } from 'react';
import Image from 'next/image';
import { memo, useEffect, useMemo } from 'react';
import { IoAdd, IoCamera, IoClose } from 'react-icons/io5';

interface ProductImagesSectionProps {
  images: File[];
  maxImages: number;
  onRemoveImage: (index: number) => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
}

const ProductImagesSection = memo(function ProductImagesSection({
  images,
  maxImages,
  onRemoveImage,
  onImageUpload,
  errorMessage,
}: ProductImagesSectionProps) {
  const previewUrls = useMemo(() => {
    return images.map(file => ({
      key: `${file.name}-${file.lastModified}`,
      url: URL.createObjectURL(file),
    }));
  }, [images]);

  useEffect(() => {
    return () => {
      previewUrls.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const mainPreview = previewUrls[0]?.url;
  const secondaryPreviews = previewUrls.slice(1);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Product Images *</h2>
        <p className="text-xs text-gray-500 mt-1">Add up to {maxImages} images (Required)</p>
      </div>
      <div className="p-5">
        <div className="mb-3">
          <div
            className={`aspect-square bg-gray-50 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden transition-colors ${
              errorMessage ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {mainPreview ? (
              <div className="relative w-full h-full">
                <Image src={mainPreview} alt="Main product image" fill className="object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => onRemoveImage(0)}
                  aria-label="Remove main image"
                  title="Remove image"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-colors "
                >
                  <IoClose className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center p-4">
                <IoCamera className="mx-auto h-10 w-10 text-gray-400" />
                <div className="mt-3">
                  <label htmlFor="main-image" className="cursor-pointer">
                    <span className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">
                      Upload main image
                    </span>
                    <input id="main-image" type="file" accept="image/*" onChange={onImageUpload} className="sr-only" />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {errorMessage && <p className="mb-3 text-sm text-red-600">{errorMessage}</p>}

        <div className="grid grid-cols-3 gap-2">
          {secondaryPreviews.map(({ key, url }, index) => (
            <div key={key} className="relative aspect-square">
              <Image src={url} alt={`Product image ${index + 2}`} fill className="object-cover rounded-lg border border-gray-200" />
              <button
                type="button"
                onClick={() => onRemoveImage(index + 1)}
                aria-label={`Remove image ${index + 2}`}
                title="Remove image"
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors "
              >
                <IoClose className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {images.length < maxImages && (
            <div className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer">
              <label htmlFor="additional-images" className="cursor-pointer w-full h-full flex items-center justify-center">
                <span className="sr-only">Add more images</span>
                <IoAdd className="h-7 w-7 text-gray-400" />
                <input
                  id="additional-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onImageUpload}
                  className="sr-only"
                  aria-label="Upload additional product images"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductImagesSection;
