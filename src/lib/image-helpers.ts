/**
 * Image Helper Utilities
 * 
 * Centralized image transformation and rendering helpers
 * Ensures all product images use ImageKit transformations
 * and WebP format for optimal performance.
 */

import { imageTransformations, getImageKitUrl } from "./imagekit";

/**
 * Apply ImageKit transformation to a product image URL
 * 
 * @param imageUrl - Original image URL (may or may not be ImageKit URL)
 * @param transformation - Transformation preset name
 * @returns Transformed ImageKit URL
 */
export function getOptimizedImageUrl(
  imageUrl: string,
  transformation: "product_grid" | "product_detail" | "admin_preview" | "thumbnail" = "product_grid",
): string {
  // Skip transformation for placeholder or empty URLs
  if (!imageUrl || imageUrl === "/placeholder.svg" || imageUrl.startsWith("/placeholder")) {
    return imageUrl;
  }
  
  // Get transformation string from preset
  const transformationString = imageTransformations[transformation];
  
  // If it's already an ImageKit URL, add transformation
  if (imageUrl.includes("imagekit.io")) {
    try {
      const urlObj = new URL(imageUrl);
      
      // Check if transformation already exists in path (tr: syntax)
      if (urlObj.pathname.includes("/tr:")) {
        // Transformation already exists, return as-is to avoid double transformation
        return imageUrl;
      }
      
      // Check if transformation exists in query params
      if (urlObj.searchParams.has("tr")) {
        // Transformation already exists, return as-is
        return imageUrl;
      }
      
      // Extract just the path (without query params for transformation)
      // ImageKit paths typically look like: /path/to/image.jpg or /kollect-it/products/image.jpg
      const path = urlObj.pathname;
      
      // Apply transformation using ImageKit path-based syntax
      return getImageKitUrl(path, transformationString);
    } catch {
      // Invalid URL or relative URL, try to use as path directly
      if (imageUrl.startsWith("/")) {
        return getImageKitUrl(imageUrl, transformationString);
      }
      // Invalid URL, return as-is
      return imageUrl;
    }
  }
  
  // If it's a local/relative URL (not ImageKit), return as-is (fallback)
  if (imageUrl.startsWith("/") || !imageUrl.startsWith("http")) {
    return imageUrl;
  }
  
  // For external non-ImageKit URLs, return as-is (shouldn't happen in production)
  return imageUrl;
}

/**
 * Get product grid image URL (600px square)
 */
export function getProductGridImageUrl(imageUrl: string): string {
  return getOptimizedImageUrl(imageUrl, "product_grid");
}

/**
 * Get product detail image URL (2000px max width)
 */
export function getProductDetailImageUrl(imageUrl: string): string {
  return getOptimizedImageUrl(imageUrl, "product_detail");
}

/**
 * Get admin preview image URL (400px square)
 */
export function getAdminPreviewImageUrl(imageUrl: string): string {
  return getOptimizedImageUrl(imageUrl, "admin_preview");
}

/**
 * Generate alt text for product image
 * 
 * @param productTitle - Product title
 * @param index - Image index (0 = main image)
 * @param isMain - Whether this is the main/primary image
 * @returns Alt text string
 */
export function getProductImageAltText(
  productTitle: string,
  index: number = 0,
  isMain: boolean = false,
): string {
  const base = productTitle.trim();
  if (isMain || index === 0) {
    return base;
  }
  return `${base} - Image ${index + 1}`;
}

/**
 * Check if URL is an ImageKit URL
 */
export function isImageKitUrl(url: string): boolean {
  return url.includes("imagekit.io");
}

/**
 * Ensure image URL uses WebP format via ImageKit
 * Adds WebP transformation if ImageKit URL
 */
export function ensureWebPFormat(imageUrl: string): string {
  if (isImageKitUrl(imageUrl)) {
    // Add WebP format transformation
    const separator = imageUrl.includes("?") ? "&" : "?";
    const hasTransformation = imageUrl.includes("tr:");
    
    if (!hasTransformation) {
      return `${imageUrl}${separator}tr:f-webp`;
    } else if (!imageUrl.includes("f-webp")) {
      // Append WebP format to existing transformation
      return imageUrl.replace("tr:", "tr:f-webp,");
    }
  }
  
  return imageUrl;
}
