"use client";

/**
 * ProductImage Component
 *
 * Reusable ImageKit image component for displaying product images
 * with automatic transformations and optimization.
 *
 * Features:
 * - Responsive sizing
 * - WebP format conversion
 * - Lazy loading with LQIP
 * - Quality optimization
 * - Dark theme compatible
 * - Error handling
 *
 * Usage:
 * ```tsx
 * <ProductImage
 *   path="/products/antique-vase.jpg"
 *   alt="Beautiful antique vase"
 *   width={400}
 *   height={300}
 *   className="rounded-lg"
 * />
 * ```
 */

import React, { useState, useCallback } from "react";
import Image from "next/image";
import type { ProductImageProps } from "../../types/imagekit";

/**
 * Get ImageKit transformation URL
 */
function getImageKitUrl(
  basePath: string,
  width?: number,
  height?: number,
  quality: number = 80,
): string {
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!endpoint) {
    console.warn("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not configured");
    return basePath;
  }

  // Construct transformation parameters
  const params = [
    "w-auto",
    "ar-auto",
    "q-auto",
    `quality-${quality}`,
    "f-webp",
    "crop-smart",
  ];

  if (width && height) {
    params.unshift(`w-${width}`);
    params.unshift(`h-${height}`);
  } else if (width) {
    params.unshift(`w-${width}`);
  } else if (height) {
    params.unshift(`h-${height}`);
  }

  const transformation = params.join("/");
  return `${endpoint}/${transformation}${basePath}`;
}

/**
 * ProductImage Component
 */
export default function ProductImage({
  path,
  alt,
  width = 400,
  height = 300,
  className = "",
  priority = false,
  quality = 80,
  onLoad,
  onError,
}: ProductImageProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageUrl = getImageKitUrl(path, width, height, quality);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    onError?.(new Error(`Failed to load image: ${path}`));
  }, [path, onError]);

  // Build className with loading and error states
  const finalClassName = `
    ${className}
    transition-opacity duration-300
    ${isLoading ? "opacity-0" : "opacity-100"}
    ${hasError ? "bg-surface-800" : ""}
  `.trim();

  return (
    <div className="relative overflow-hidden rounded-lg bg-surface-900">
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-surface-800" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-800 text-ink-400">
          <svg
            className="mb-2 h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">Failed to load image</span>
        </div>
      )}

      {/* Image */}
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={finalClassName}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        quality={quality}
        onLoadingComplete={handleLoadingComplete}
        onError={handleError}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
      />
    </div>
  );
}

/**
 * Product Image Grid Component
 *
 * Display multiple product images in a responsive grid
 */
interface ProductImageGridProps {
  images: Array<{
    path: string;
    alt: string;
  }>;
  className?: string;
  imageSize?: "small" | "medium" | "large";
}

const imageSizeMap = {
  small: { width: 200, height: 150 },
  medium: { width: 400, height: 300 },
  large: { width: 600, height: 450 },
};

export function ProductImageGrid({
  images,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
  imageSize = "medium",
}: ProductImageGridProps): React.ReactElement {
  const { width, height } = imageSizeMap[imageSize];

  return (
    <div className={className}>
      {images.map((image, index) => (
        <ProductImage
          key={`${image.path}-${index}`}
          path={image.path}
          alt={image.alt}
          width={width}
          height={height}
        />
      ))}
    </div>
  );
}

/**
 * Responsive Product Image Component
 *
 * Automatically adjusts size based on viewport
 */
interface ResponsiveProductImageProps
  extends Omit<ProductImageProps, "width" | "height"> {
  sizes?: "small" | "medium" | "large" | "full";
}

export function ResponsiveProductImage({
  path,
  alt,
  className = "",
  sizes = "medium",
  ...props
}: ResponsiveProductImageProps): React.ReactElement {
  const sizeMap = {
    small: { width: 200, height: 200 },
    medium: { width: 400, height: 300 },
    large: { width: 800, height: 600 },
    full: { width: 1200, height: 800 },
  };

  const { width, height } = sizeMap[sizes];

  return (
    <ProductImage
      path={path}
      alt={alt}
      width={width}
      height={height}
      className={`w-full h-auto ${className}`}
      {...props}
    />
  );
}

