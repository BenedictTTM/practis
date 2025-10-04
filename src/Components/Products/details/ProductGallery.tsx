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
  onImageSelect 
}: ProductGalleryProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const placeholderImage = "/placeholder-image.png";
  
  const imagesToShow = images.length ? images : [placeholderImage];
  const primaryImage = imagesToShow[selectedImageIndex] || placeholderImage;

  function scrollThumbnail(idx: number) {
    onImageSelect(idx);
    const container = carouselRef.current;
    const node = container?.querySelector<HTMLButtonElement>(`button[data-idx="${idx}"]`);
    node?.scrollIntoView({ behavior: "smooth", inline: "center" });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Main Image */}
      <div className="h-96 flex items-center justify-center bg-gray-50">
        <img
          src={primaryImage}
          alt={title}
          className="max-h-full max-w-full object-contain p-4"
        />
      </div>

      {/* Thumbnail Navigation */}
      <div className="px-3 py-2 border-t">
        <div ref={carouselRef} className="flex gap-2 overflow-x-auto py-2">
          {imagesToShow.map((src, idx) => (
            <button
              key={idx}
              data-idx={idx}
              onClick={() => scrollThumbnail(idx)}
              className={`flex-shrink-0 w-14 h-14 rounded border ${
                idx === selectedImageIndex ? "ring-1 ring-red-200" : "border-gray-200"
              } overflow-hidden bg-white`}
            >
              <img 
                src={src} 
                alt={`${title} ${idx + 1}`} 
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}