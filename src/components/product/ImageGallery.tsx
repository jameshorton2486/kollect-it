"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/image";

interface ProductImage {
  url: string;
  alt?: string | null;
}

interface ImageGalleryProps {
  images: ProductImage[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHoverZoom, setIsHoverZoom] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);

  // Fade-in on image change
  useEffect(() => {
    setShowImage(false);
    const t = setTimeout(() => setShowImage(true), 10);
    return () => clearTimeout(t);
  }, [selectedIndex]);

  // If no images, show placeholder
  if (images.length === 0) {
    return (
      <div className="product-gallery">
        <div className="product-gallery-main">
          <div className="product-gallery-placeholder">
            <span>No Image Available</span>
          </div>
        </div>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="product-gallery space-y-6">
      {/* Main Image Container */}
      <div
        className="product-gallery-main relative"
        ref={mainRef}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          if (start == null) return;
          const end = e.changedTouches[0].clientX;
          const dx = end - start;
          const threshold = 40; // swipe threshold in px
          if (dx > threshold) {
            setSelectedIndex((i) => (i > 0 ? i - 1 : images.length - 1));
          } else if (dx < -threshold) {
            setSelectedIndex((i) => (i < images.length - 1 ? i + 1 : 0));
          }
          touchStartX.current = null;
        }}
      >
        <div
          className="group relative overflow-hidden rounded-lg border border-ink-tertiary/10 bg-surface-0 aspect-square flex items-center justify-center"
          onMouseEnter={() => setIsHoverZoom(true)}
          onMouseLeave={() => setIsHoverZoom(false)}
          title={isHoverZoom ? "Zoom enabled - Hover to zoom" : "Hover to zoom"}
        >
          <Image
            key={`img-${selectedIndex}`}
            src={selectedImage.url}
            alt={selectedImage.alt || title}
            width={1200}
            height={1200}
            priority
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className={`h-full w-full object-contain transition-all duration-500 cursor-zoom-in ${
              showImage ? "opacity-100" : "opacity-0"
            } ${isHoverZoom ? "scale-[1.8]" : "scale-100"}`}
          />

          {/* Authentication Watermark Badge on Image */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-surface-0/95 backdrop-blur-sm px-3 py-1.5 shadow-md border border-white/50">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-green-600"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span className="text-[11px] font-semibold text-ink">
              Authenticated
            </span>
          </div>

          {/* Hover Zoom Indicator */}
          {!isHoverZoom && (
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs text-ink-secondary bg-surface-0/90 backdrop-blur-sm rounded px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Hover to zoom
            </div>
          )}

          {/* Image Counter Badge */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 rounded-full bg-cta/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white border border-gold/30">
              {selectedIndex + 1} / {images.length}
            </div>
          )}

          {/* Image Navigation Buttons */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 flex gap-2 md:hidden">
              <button
                onClick={() =>
                  setSelectedIndex((i) => (i > 0 ? i - 1 : images.length - 1))
                }
                className="rounded-full bg-surface-0/90 backdrop-blur-sm p-2 shadow-md hover:bg-surface-0 transition-colors"
                aria-label="Previous image"
                title="Previous image"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={() =>
                  setSelectedIndex((i) => (i < images.length - 1 ? i + 1 : 0))
                }
                className="rounded-full bg-surface-0/90 backdrop-blur-sm p-2 shadow-md hover:bg-surface-0 transition-colors"
                aria-label="Next image"
                title="Next image"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails Grid */}
      {images.length > 1 && (
        <div className="product-gallery-thumbnails">
          <p className="text-xs uppercase tracking-wider text-ink-secondary font-semibold mb-3">
            More Views
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
            {images.map((image, index) => (
              <button
                key={index}
                className={`product-gallery-thumbnail shrink-0 snap-start rounded-lg border-2 transition-all overflow-hidden hover:border-gold ${
                  index === selectedIndex
                    ? "border-gold shadow-md ring-2 ring-gold/20"
                    : "border-ink-tertiary/20 hover:border-gold/50"
                }`}
                onClick={() => setSelectedIndex(index)}
                title={`View image ${index + 1}`}
                aria-label={`View image ${index + 1} of ${images.length}`}
                aria-current={index === selectedIndex ? "page" : undefined}
              >
                <Image
                  src={image.url}
                  alt={`${title} view ${index + 1}`}
                  width={80}
                  height={80}
                  className={`h-20 w-20 object-cover transition-transform ${index === selectedIndex ? "scale-100" : "hover:scale-105"}`}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
                {index === selectedIndex && (
                  <div
                    className="absolute inset-0 bg-gold/10 pointer-events-none"
                    aria-hidden="true"
                  ></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

