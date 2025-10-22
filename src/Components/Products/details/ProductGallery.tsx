import React, { useRef } from "react";

interface ProductGalleryProps {
  images: string[];
  title: string;
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
}

export default function ProductGallery({
  images,
  title,
  selectedImageIndex,
  onImageSelect,
}: ProductGalleryProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const placeholderImage = "/placeholder-image.png";

  const imagesToShow = images.length ? images : [placeholderImage];
  const primaryImage = imagesToShow[selectedImageIndex] || placeholderImage;

  function scrollThumbnail(idx: number) {
    onImageSelect(idx);
    const container = carouselRef.current;
    const node = container?.querySelector<HTMLButtonElement>(
      `button[data-idx="${idx}"]`
    );
    node?.scrollIntoView({ behavior: "smooth", inline: "center" });
  }

  return (
    <section className="bg-white rounded-xl shadow-sm overflow-hidden w-full">
      {/* Main Image */}
      <div className="flex items-center justify-center bg-gray-50">
        <img
          src={primaryImage}
          alt={title}
          className="object-contain w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px] p-3 sm:p-4"
        />
      </div>

      {/* Thumbnail Navigation */}
      <div className="px-2 sm:px-4 py-3 border-t">
        <div
          ref={carouselRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          {imagesToShow.map((src, idx) => (
            <button
              key={idx}
              data-idx={idx}
              onClick={() => scrollThumbnail(idx)}
              className={`flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                idx === selectedImageIndex
                  ? "border-red-500 scale-105 shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              } w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20`}
            >
              <img
                src={src}
                alt={`${title} ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = placeholderImage;
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
