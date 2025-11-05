'use client';

import React, { useEffect, useRef, useState } from "react";

interface ProductGalleryProps {
  images: string[];
  title: string;
  selectedImageIndex: number;
}

export default function ProductGallery({
  images,
  title,
  selectedImageIndex,
}: ProductGalleryProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const mainImgRef = useRef<HTMLImageElement | null>(null);
  const [mainLoaded, setMainLoaded] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState<Record<number, boolean>>({});
  const placeholderImage = "/placeholder-image.png";

  const imagesToShow = images.length ? images : [placeholderImage];
  const primaryImage = imagesToShow[selectedImageIndex] || placeholderImage;



  // Robustly detect if the main image is already cached and loaded
  useEffect(() => {
    // Reset loading state when primary image changes
    setMainLoaded(false);
    const img = mainImgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      // Image already loaded by the browser cache
      setMainLoaded(true);
    }
  }, [primaryImage]);

  return (
    <section className="rounded-lg shadow-xs overflow-hidden w-full">
      {/* Main Image with skeleton only */}
      <div className="relative flex items-center justify-center bg-gray-50">
        {/* Skeleton */}
        {!mainLoaded && (
          <div
            className="absolute inset-0 animate-pulse bg-gray-200/70 pointer-events-none"
            aria-hidden="true"
          />
        )}
        <img
          ref={mainImgRef}
          src={primaryImage}
          alt={title}
          className="object-contain w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px] p-3 sm:p-4"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onLoad={() => setMainLoaded(true)}
          onLoadCapture={() => setMainLoaded(true)}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = placeholderImage;
            setMainLoaded(true);
          }}
        />
      </div>

      {/* Thumbnail Navigation */}
      <div className="px-2 sm:px-4 py-3 border-t border-gray-200">
        <div
          ref={carouselRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          {imagesToShow.map((src, idx) => (
            <button
              key={idx}
              data-idx={idx}
              className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                idx === selectedImageIndex
                  ? "hover:scale-105  border-gray-100 "
                  : "border-gray-200 hover:border-gray-300"
              } w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20`}
            >
              {!thumbLoaded[idx] && (
                <div className="absolute inset-0 animate-pulse bg-gray-200/70" />
              )}
              <img
                src={src}
                alt={`${title} ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onLoad={() => setThumbLoaded((m) => ({ ...m, [idx]: true }))}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = placeholderImage;
                  setThumbLoaded((m) => ({ ...m, [idx]: true }));
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
