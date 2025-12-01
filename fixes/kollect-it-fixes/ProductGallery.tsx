"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import Image from "next/image";

interface ProductGalleryProps {
  images: { url: string; alt?: string }[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
        <Image
          src={currentImage?.url || "/placeholder.svg"}
          alt={currentImage?.alt || productName}
          fill
          className="object-contain"
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute bottom-4 right-4 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ZoomIn className="h-5 w-5" />
        </button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-background/80 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                index === selectedIndex
                  ? "border-primary"
                  : "border-transparent"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoomed Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-2 bg-background/80 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <Image
              src={currentImage?.url || "/placeholder.svg"}
              alt={currentImage?.alt || productName}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

