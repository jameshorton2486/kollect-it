# ImageKit & ProductImage Component - Usage Examples

Complete examples showing how to use the ProductImage component in your Kollect-It application pages and components.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Product Detail Page Example](#product-detail-page-example)
3. [Product Grid Example](#product-grid-example)
4. [Image Gallery Example](#image-gallery-example)
5. [Responsive Images](#responsive-images)
6. [Error Handling](#error-handling)
7. [Dark Theme Styling](#dark-theme-styling)
8. [Performance Tips](#performance-tips)

---

## Basic Usage

### Single Product Image

```tsx
import { ProductImage } from '@/components/ProductImage';

export default function SingleImageExample() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <ProductImage
        path="/products/antique-vase-001.jpg"
        alt="Beautiful antique vase from 1800s collection"
        width={500}
        height={400}
      />
    </div>
  );
}
```

### With Custom Styling

```tsx
import { ProductImage } from '@/components/ProductImage';

export default function StyledImageExample() {
  return (
    <div className="rounded-lg overflow-hidden border border-[#D3AF37] shadow-lg">
      <ProductImage
        path="/products/vase-detailed.jpg"
        alt="Ornate vase with detailed patterns"
        width={600}
        height={450}
        className="object-cover"
      />
    </div>
  );
}
```

---

## Product Detail Page Example

```tsx
'use client';

import { ProductImage, ProductImageGrid } from '@/components/ProductImage';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  mainImage: string;
  galleryImages: string[];
  description: string;
}

export default function ProductDetailPage({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState<string>(product.mainImage);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#1a1a1a] p-8 rounded-lg">
      {/* Main Image Display */}
      <div className="flex flex-col gap-4">
        <div className="bg-[#2a2a2a] rounded-lg overflow-hidden border border-[#D3AF37]">
          <ProductImage
            path={selectedImage}
            alt={product.name}
            width={500}
            height={600}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Thumbnail Gallery */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[product.mainImage, ...product.galleryImages].map((image, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(image)}
              className={`flex-shrink-0 w-20 h-20 rounded border-2 transition-colors ${
                selectedImage === image
                  ? 'border-[#D3AF37]'
                  : 'border-[#3a3a3a] hover:border-[#D3AF37]'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <ProductImage
                path={image}
                alt={`${product.name} thumbnail ${idx + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-between text-white">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-[#D3AF37]">
            {product.name}
          </h1>
          <p className="text-gray-400 mb-4">{product.category}</p>

          <div className="mb-6 pb-6 border-b border-[#3a3a3a]">
            <p className="text-3xl font-bold text-[#D3AF37]">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <p className="text-gray-300 leading-relaxed">{product.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button className="flex-1 bg-[#D3AF37] text-black font-bold py-3 rounded hover:bg-opacity-90 transition">
            Add to Cart
          </button>
          <button className="flex-1 border-2 border-[#D3AF37] text-[#D3AF37] font-bold py-3 rounded hover:bg-[#D3AF37] hover:text-black transition">
            Save for Later
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Product Grid Example

```tsx
'use client';

import { ProductImageGrid } from '@/components/ProductImage';
import Link from 'next/link';

interface GridProduct {
  id: string;
  name: string;
  price: number;
  mainImage: string;
}

export default function ProductGridPage({
  products,
}: {
  products: GridProduct[];
}) {
  const productImages = products.map((product) => ({
    path: product.mainImage,
    alt: product.name,
  }));

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8">
      <h1 className="text-4xl font-bold text-[#D3AF37] mb-12">
        Collectibles Collection
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="bg-[#2a2a2a] rounded-lg overflow-hidden border border-[#3a3a3a] hover:border-[#D3AF37] transition-all duration-300 transform hover:-translate-y-2">
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-[#1a1a1a]">
                <ProductImageGrid
                  images={[
                    {
                      path: product.mainImage,
                      alt: product.name,
                    },
                  ]}
                  imageSize="medium"
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-white font-bold truncate group-hover:text-[#D3AF37] transition">
                  {product.name}
                </h3>
                <p className="text-[#D3AF37] font-bold text-lg mt-2">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              {/* Hover Action Button */}
              <div className="px-4 pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-full bg-[#D3AF37] text-black font-bold py-2 rounded text-sm hover:bg-opacity-90 transition">
                  View Details
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

---

## Image Gallery Example

```tsx
'use client';

import { ProductImage } from '@/components/ProductImage';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryImage {
  id: string;
  path: string;
  caption: string;
}

export default function ImageGalleryExample({
  images,
}: {
  images: GalleryImage[];
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const goToPrevious = () => {
    if (selectedIdx !== null) {
      setSelectedIdx(
        selectedIdx === 0 ? images.length - 1 : selectedIdx - 1
      );
    }
  };

  const goToNext = () => {
    if (selectedIdx !== null) {
      setSelectedIdx(
        selectedIdx === images.length - 1 ? 0 : selectedIdx + 1
      );
    }
  };

  return (
    <div className="bg-[#1a1a1a] min-h-screen p-8">
      <h1 className="text-4xl font-bold text-[#D3AF37] mb-8">Gallery</h1>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {images.map((image, idx) => (
          <button
            key={image.id}
            onClick={() => setSelectedIdx(idx)}
            className="group relative rounded-lg overflow-hidden border-2 border-[#3a3a3a] hover:border-[#D3AF37] transition-all aspect-square"
          >
            <ProductImage
              path={image.path}
              alt={image.caption}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition text-2xl">
                +
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setSelectedIdx(null)}
            className="absolute top-4 right-4 text-white hover:text-[#D3AF37] transition z-60"
            aria-label="Close gallery"
          >
            <X size={32} />
          </button>

          {/* Image Container */}
          <div className="max-w-4xl w-full">
            <ProductImage
              path={images[selectedIdx].path}
              alt={images[selectedIdx].caption}
              width={800}
              height={800}
              priority
              className="w-full h-auto"
            />

            {/* Caption */}
            <p className="text-center text-[#D3AF37] mt-4 font-semibold">
              {images[selectedIdx].caption}
            </p>

            {/* Counter */}
            <p className="text-center text-gray-400 text-sm mt-2">
              {selectedIdx + 1} / {images.length}
            </p>
          </div>

          {/* Navigation */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#D3AF37] transition z-60 p-2"
            aria-label="Previous image"
          >
            <ChevronLeft size={40} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#D3AF37] transition z-60 p-2"
            aria-label="Next image"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Responsive Images

### Different Sizes for Different Viewports

```tsx
import { ResponsiveProductImage } from '@/components/ProductImage';

export default function ResponsiveImageExample() {
  return (
    <div className="space-y-12">
      {/* Small Size - Sidebar Thumbnail */}
      <div className="bg-[#2a2a2a] p-4 rounded inline-block">
        <ResponsiveProductImage
          path="/products/small-item.jpg"
          alt="Small collectible thumbnail"
          sizes="small"
        />
      </div>

      {/* Medium Size - Product Card */}
      <div className="bg-[#2a2a2a] p-4 rounded inline-block">
        <ResponsiveProductImage
          path="/products/medium-item.jpg"
          alt="Medium collectible card"
          sizes="medium"
        />
      </div>

      {/* Large Size - Product Detail */}
      <div className="bg-[#2a2a2a] p-4 rounded inline-block">
        <ResponsiveProductImage
          path="/products/large-item.jpg"
          alt="Large detailed collectible view"
          sizes="large"
        />
      </div>

      {/* Full Width - Hero Banner */}
      <div className="bg-[#2a2a2a] rounded overflow-hidden">
        <ResponsiveProductImage
          path="/products/featured-banner.jpg"
          alt="Featured collectible banner"
          sizes="full"
        />
      </div>
    </div>
  );
}
```

---

## Error Handling

### Handling Missing Images Gracefully

```tsx
'use client';

import { ProductImage } from '@/components/ProductImage';
import { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorHandlingExample() {
  const [retryKey, setRetryKey] = useState(0);

  const handleRetry = () => {
    setRetryKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-8 bg-[#1a1a1a] p-8">
      {/* Normal Image */}
      <div className="bg-[#2a2a2a] p-6 rounded">
        <h3 className="text-white font-bold mb-4">Working Image</h3>
        <ProductImage
          key={`image-1-${retryKey}`}
          path="/products/valid-image.jpg"
          alt="A valid product image"
          width={400}
          height={300}
        />
      </div>

      {/* Image with Retry Capability */}
      <div className="bg-[#2a2a2a] p-6 rounded">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold">Image with Retry</h3>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 text-[#D3AF37] hover:text-white transition text-sm"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
        <ProductImage
          key={`image-2-${retryKey}`}
          path="/products/might-fail.jpg"
          alt="Image that might fail to load"
          width={400}
          height={300}
        />
      </div>

      {/* Error State Example */}
      <div className="bg-[#2a2a2a] p-6 rounded border border-red-500/50">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={20} className="text-red-500" />
          <h3 className="text-white font-bold">Error Handling Demo</h3>
        </div>
        <div className="bg-[#1a1a1a] p-8 rounded flex flex-col items-center justify-center h-64">
          <AlertTriangle size={32} className="text-red-500 mb-2" />
          <p className="text-red-500 font-semibold">Failed to load image</p>
          <p className="text-gray-400 text-sm mt-1">
            Path: /products/invalid-path.jpg
          </p>
          <button className="mt-4 px-4 py-2 bg-[#D3AF37] text-black font-bold rounded hover:bg-opacity-90 transition">
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Dark Theme Styling

### Complete Dark Theme Product Page

```tsx
import { ProductImage } from '@/components/ProductImage';

interface Product {
  id: string;
  name: string;
  seller: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  condition: string;
  era: string;
  images: string[];
  description: string;
}

export default function DarkThemeProductPage({
  product,
}: {
  product: Product;
}) {
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Breadcrumb */}
      <div className="bg-[#2a2a2a] border-b border-[#3a3a3a] px-8 py-3">
        <nav className="text-gray-400 text-sm">
          Home / Products / <span className="text-[#D3AF37]">{product.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 max-w-7xl mx-auto">
        {/* Image Section */}
        <div className="lg:col-span-2">
          <div className="bg-[#2a2a2a] rounded-lg overflow-hidden border border-[#3a3a3a] mb-6">
            <ProductImage
              path={product.images[0]}
              alt={product.name}
              width={600}
              height={700}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto">
            {product.images.map((image, idx) => (
              <button
                key={idx}
                className="flex-shrink-0 w-24 h-24 rounded border-2 border-[#3a3a3a] hover:border-[#D3AF37] transition"
              >
                <ProductImage
                  path={image}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-[#2a2a2a] rounded-lg p-8 border border-[#3a3a3a] h-fit">
          {/* Seller Info */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#3a3a3a]">
            <div>
              <p className="text-gray-400 text-sm">Seller</p>
              <p className="text-white font-semibold">{product.seller}</p>
            </div>
            <div className="text-center">
              <div className="flex gap-1 justify-center mb-1">
                {'⭐'.repeat(Math.floor(product.rating))}
              </div>
              <p className="text-gray-400 text-xs">
                ({product.reviews} reviews)
              </p>
            </div>
          </div>

          {/* Product Details */}
          <h1 className="text-2xl font-bold text-white mb-4">{product.name}</h1>

          <div className="space-y-3 mb-6 pb-6 border-b border-[#3a3a3a]">
            <div className="flex justify-between">
              <span className="text-gray-400">Condition:</span>
              <span className="text-[#D3AF37] font-semibold">{product.condition}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Era:</span>
              <span className="text-white">{product.era}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <div className="flex items-baseline gap-3 mb-2">
              <p className="text-4xl font-bold text-[#D3AF37]">
                ${product.price.toFixed(2)}
              </p>
              {discountPercent > 0 && (
                <p className="text-lg text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            {discountPercent > 0 && (
              <p className="text-red-500 font-semibold">
                Save {discountPercent}% off original price
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-[#D3AF37] text-black font-bold py-3 rounded hover:bg-opacity-90 transition">
              Add to Cart
            </button>
            <button className="w-full border-2 border-[#D3AF37] text-[#D3AF37] font-bold py-3 rounded hover:bg-[#D3AF37] hover:text-black transition">
              Save for Later
            </button>
            <button className="w-full border border-[#3a3a3a] text-gray-300 font-semibold py-3 rounded hover:border-[#D3AF37] transition">
              Report Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Performance Tips

### 1. Use `priority` for Above-the-Fold Images

```tsx
// Main product image - load immediately
<ProductImage
  path={mainImage}
  alt="Main product view"
  width={600}
  height={700}
  priority  // This disables lazy loading
/>

// Gallery thumbnails - lazy load
{galleryImages.map((img) => (
  <ProductImage
    key={img}
    path={img}
    alt="Product detail"
    width={150}
    height={150}
    // No priority - uses lazy loading
  />
))}
```

### 2. Optimize Image Quality

```tsx
// High quality for hero images
<ProductImage
  path="/products/featured.jpg"
  alt="Featured collectible"
  quality={95}  // High quality
  priority
/>

// Standard quality for thumbnails
<ProductImage
  path="/products/thumb.jpg"
  alt="Thumbnail"
  quality={70}  // Reduced quality, faster load
/>
```

### 3. Responsive Image Sizing

```tsx
// Responsive sizing reduces bandwidth
<ProductImage
  path="/products/item.jpg"
  alt="Product"
  width={600}
  height={600}
  // Automatically serves 1x, 2x, 3x versions
  // based on device pixel ratio
/>
```

---

## Running the Sync

### Trigger Sync via CLI

```bash
# One-time sync
bun run sync-images

# Watch mode (useful during development)
bun run sync-images:watch
```

### Trigger Sync via API

```typescript
// In your Next.js API route or client-side function
async function triggerImageSync() {
  const response = await fetch('/api/sync-images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: process.env.WEBHOOK_SECRET,
      skipExisting: true,
    }),
  });

  const data = await response.json();
  console.log('Sync started:', data.syncId);
  
  // Poll for status
  const checkStatus = async () => {
    const statusResponse = await fetch(
      `/api/sync-images?syncId=${data.syncId}`
    );
    const status = await statusResponse.json();
    console.log('Sync status:', status);
  };

  checkStatus();
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Image not loading | Check image path in ImageKit dashboard |
| Sync not running | Verify `GOOGLE_APPLICATION_CREDENTIALS` path |
| Service account error | Re-share Drive folder with service account email |
| Rate limiting | Increase delay in sync script (already 500ms) |
| Build errors | Run `bun install` to install dependencies |

---

**Last Updated:** November 5, 2025  
**Version:** 1.0.0
