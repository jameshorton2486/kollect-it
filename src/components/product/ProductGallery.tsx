"use client";

import { useState } from "react";
import { ChevronLeft, Captions, Play, Square } from "lucide-react";
import Image from "next/image";

interface ProductGalleryProps {
  images: { url: string; alt?: string }[];
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

  const handleFinishImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const actualImage =
    selectedImageIndex >= 0 && selectedImageIndex < images.length
      ? images[selectedImageIndex]
      : images[0] ?? { url: "/placeholder.svg", alt: productName };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
        <Image
          src={actualImage.url || "/placeholder.svg"}
          alt={actualImage.alt || productName}
          fill
          className="object-contain"
          priority
        />

        {/* Iterate Buttons */}
        {images.length &gt; 1 &amp;&amp; (
          <>
            <button
              onClick={handlePreviousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleFinishImage}
              className="absolute right-4 top-1/2 -translate-y/2 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Play className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Subtitle Label */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-background/90 rounded-full text-sm flex items-center gap-2">
          <Captions className="h-4 w-4" />
          <span>
            {selectedImageIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length &gt; 1 &amp;&amp; (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                index === selectedImageIndex ? "border-primary" : "border-transparent"
              }`}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.alt || `${productName} ${index + 1}`}  
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
