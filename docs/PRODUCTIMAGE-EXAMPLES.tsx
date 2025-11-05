// ============================================================
// ProductImage Component Usage Examples
// ============================================================
// This file demonstrates how to use the ProductImage component
// in your product pages and listings throughout Kollect-It
// ============================================================

import { ProductImage, ProductImageGrid, ResponsiveProductImage } from '@/components/ProductImage';

// ============================================================
// Example 1: Simple Product Detail Page
// ============================================================
export function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#D3AF37] mb-8">
          Antique Victorian Vase - Late 1800s
        </h1>

        {/* Single Product Image */}
        <div className="bg-[#2a2a2a] p-8 rounded-lg mb-8">
          <ProductImage
            path="/products/antique-vase-001.jpg"
            alt="Victorian Vase Front View"
            width={600}
            height={800}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-300 leading-relaxed">
              Beautiful hand-painted Victorian vase with gold leaf accents.
              In excellent condition, no chips or cracks.
            </p>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Price</h3>
              <p className="text-[#D3AF37] text-2xl font-bold">$1,250.00</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Additional Info</h2>
            <ul className="space-y-2 text-gray-300">
              <li>
                <strong>Condition:</strong> Excellent
              </li>
              <li>
                <strong>Era:</strong> Victorian (1880-1890)
              </li>
              <li>
                <strong>Height:</strong> 14 inches
              </li>
              <li>
                <strong>Material:</strong> Porcelain with hand-painted design
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Example 2: Product Gallery with Multiple Images
// ============================================================
export function ProductGalleryPage() {
  const productImages = [
    {
      path: '/products/antique-vase-001.jpg',
      alt: 'Vase Front View - Full Body',
    },
    {
      path: '/products/antique-vase-002.jpg',
      alt: 'Vase Detail - Painted Design',
    },
    {
      path: '/products/antique-vase-003.jpg',
      alt: 'Vase Base - Maker Mark',
    },
    {
      path: '/products/antique-vase-004.jpg',
      alt: 'Vase Angle View - Side Profile',
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#D3AF37] mb-12">
          Product Gallery
        </h2>

        <ProductImageGrid
          images={productImages}
          imageSize="medium"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        />
      </div>
    </div>
  );
}

// ============================================================
// Example 3: Homepage Hero Image
// ============================================================
export function HomePageHero() {
  return (
    <div className="relative w-full h-96 bg-[#2a2a2a] overflow-hidden rounded-xl">
      <ResponsiveProductImage
        path="/featured/collectible-showcase.jpg"
        alt="Featured Collectible Items"
        sizes="full"
      />

      {/* Text Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent flex items-end">
        <div className="p-8 text-white">
          <h2 className="text-4xl font-bold text-[#D3AF37] mb-2">
            Featured Collection
          </h2>
          <p className="text-gray-300">
            Discover rare and authentic collectibles from around the world
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Example 4: Product Listing Grid
// ============================================================
export function ProductListingGrid() {
  const products = [
    {
      id: 1,
      name: 'Victorian Vase',
      price: '$1,250',
      image: '/products/antique-vase-001.jpg',
    },
    {
      id: 2,
      name: 'Vintage Watch',
      price: '$850',
      image: '/products/vintage-watch-001.jpg',
    },
    {
      id: 3,
      name: 'Porcelain Figurine',
      price: '$450',
      image: '/products/porcelain-figurine-001.jpg',
    },
    {
      id: 4,
      name: 'Rare Book',
      price: '$2,100',
      image: '/products/rare-book-001.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#D3AF37] mb-12">
          Our Collection
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#2a2a2a] rounded-lg overflow-hidden hover:border border-[#D3AF37] transition-all cursor-pointer"
            >
              {/* Product Image Container */}
              <div className="w-full h-64 bg-[#3a3a3a] overflow-hidden">
                <ProductImage
                  path={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {product.name}
                </h3>
                <p className="text-[#D3AF37] text-xl font-bold">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Example 5: Product with Transformation
// ============================================================
export function ProductWithTransformation() {
  return (
    <div className="bg-[#1a1a1a] text-white p-8">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-[#D3AF37] mb-6">
          Image Transformations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Original Size */}
          <div>
            <p className="text-sm text-gray-400 mb-3">Original (400x300)</p>
            <div className="bg-[#2a2a2a] p-4 rounded">
              <ProductImage
                path="/products/item.jpg"
                alt="Original Image"
                width={400}
                height={300}
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <p className="text-sm text-gray-400 mb-3">Thumbnail (150x150)</p>
            <div className="bg-[#2a2a2a] p-4 rounded">
              <ProductImage
                path="/products/item.jpg"
                alt="Thumbnail"
                width={150}
                height={150}
              />
            </div>
          </div>

          {/* Responsive */}
          <div>
            <p className="text-sm text-gray-400 mb-3">Responsive (Large)</p>
            <div className="bg-[#2a2a2a] p-4 rounded">
              <ResponsiveProductImage
                path="/products/item.jpg"
                alt="Responsive Large"
                sizes="large"
              />
            </div>
          </div>

          {/* Full Width */}
          <div>
            <p className="text-sm text-gray-400 mb-3">Full Width</p>
            <div className="bg-[#2a2a2a] p-4 rounded">
              <ResponsiveProductImage
                path="/products/item.jpg"
                alt="Full Width"
                sizes="full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Example 6: Loading and Error States
// ============================================================
export function ImageStatesDemo() {
  return (
    <div className="bg-[#1a1a1a] text-white p-8">
      <h2 className="text-2xl font-bold text-[#D3AF37] mb-6">
        Image States (Automatic Handling)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Loading State */}
        <div>
          <p className="text-sm text-gray-400 mb-3">Loading State</p>
          <div className="bg-[#2a2a2a] p-4 rounded">
            {/* While image loads, a skeleton animation appears */}
            <ProductImage
              path="/products/item.jpg"
              alt="Loading"
              width={300}
              height={300}
            />
          </div>
        </div>

        {/* Error State */}
        <div>
          <p className="text-sm text-gray-400 mb-3">Error Fallback</p>
          <div className="bg-[#2a2a2a] p-4 rounded">
            {/* If image fails to load, fallback UI appears */}
            <ProductImage
              path="/invalid/path/image.jpg"
              alt="Error State"
              width={300}
              height={300}
            />
          </div>
        </div>

        {/* Successful Load */}
        <div>
          <p className="text-sm text-gray-400 mb-3">Successfully Loaded</p>
          <div className="bg-[#2a2a2a] p-4 rounded">
            <ProductImage
              path="/products/item.jpg"
              alt="Successful"
              width={300}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Component Props Reference
// ============================================================
/*
ProductImage Props:
  - path: string (required) - Path to image in ImageKit (e.g., "/products/item.jpg")
  - alt: string (required) - Alternative text for accessibility
  - width?: number - Image width in pixels (default: 400)
  - height?: number - Image height in pixels (default: 300)
  - className?: string - Additional CSS classes
  - priority?: boolean - Load image eagerly (default: false)
  - quality?: number - JPEG quality 0-100 (default: 80)
  - transformation?: ImageTransformation - Custom transformations

ProductImageGrid Props:
  - images: Array<{path: string, alt: string}> - Array of image objects
  - imageSize?: "small" | "medium" | "large" - Size preset
  - className?: string - Grid container CSS classes

ResponsiveProductImage Props:
  - path: string (required) - Path to image in ImageKit
  - alt: string (required) - Alternative text
  - sizes?: "small" | "medium" | "large" | "full" - Size preset
  - className?: string - Additional CSS classes

Features:
  ✅ Automatic WebP conversion for modern browsers
  ✅ Lazy loading for performance
  ✅ Quality optimization (default 80)
  ✅ Responsive sizing with breakpoints
  ✅ Error handling with fallback UI
  ✅ Loading skeleton animation
  ✅ Dark theme compatible styling
  ✅ Next.js Image optimization

Dark Theme Colors:
  - Background: #1a1a1a
  - Secondary Background: #2a2a2a
  - Tertiary Background: #3a3a3a
  - Accent/Gold: #D3AF37
  - Text: white
*/
