"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Captions } from "lucide-react";
import Image from "next/image";

interface ProductGalleryProps {
  images: { url: string; alt?: string | null }[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handlePreviousImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex === 0 ? images.length : prevIndex - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const actualImage =
    selectedImageIndex >= 0 && selectedImageIndex < images.length
      ? images[selectedImageIndex]
      : images[0] ?? { url: "/placeholder.svg", alt: productName };

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative aspect-square bg-surface-100 rounded-2xl overflow-hidden group border border-border-200 p-4">
        <Image
          src={actualImage.url || "/placeholder.svg"}
          alt={actualImage.alt || productName}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePreviousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-ink-900" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-ink-900" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-ink-700 flex items-center gap-2 shadow-sm">
            <Captions className="h-3.5 w-3.5" />
            <span>
              {selectedImageIndex + 1} / {images.length}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                index === selectedImageIndex
                  ? "border-lux-gold ring-2 ring-lux-gold/20"
                  : "border-border-200 hover:border-border-300"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.alt || `${productName} - image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 20vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
