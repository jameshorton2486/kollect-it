"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    condition?: string | null;
    year?: string | null;
    images: { url: string }[];
    category?: { name: string; slug: string } | null;
  };
  view?: "grid" | "list";
}

export function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = product.images?.[0]?.url || "/placeholder.svg";

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch("/api/wishlist", {
        method: isWishlisted ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      if (response.ok) {
        setIsWishlisted(!isWishlisted);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  if (view === "list") {
    return (
      <Link
        href={`/product/${product.id}`}
        className="group flex gap-4 rounded-xl border border-border-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-border-300 sm:gap-6"
      >
        {/* Image */}
        <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-surface-100 sm:h-36 sm:w-36">
          <Image
            src={imageError ? "/placeholder.svg" : imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 112px, 144px"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between py-1">
          <div>
            {product.category && (
              <p className="text-xs font-medium uppercase tracking-wider text-lux-gold">
                {product.category.name}
              </p>
            )}
            <h3 className="mt-1 font-medium text-ink-900 line-clamp-2 group-hover:text-lux-gold transition-colors">
              {product.title}
            </h3>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-ink-500">
              {product.condition && <span>{product.condition}</span>}
              {product.year && <span>• {product.year}</span>}
            </div>
          </div>
          <p className="mt-2 text-lg font-semibold text-ink-900">
            ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border-200 text-ink-700 transition-all hover:border-lux-gold hover:text-lux-gold self-start"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-lux-gold text-lux-gold" : ""}`} />
        </button>
      </Link>
    );
  }

  // Grid view (default)
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col rounded-xl border border-border-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-border-300"
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-surface-100">
        <Image
          src={imageError ? "/placeholder.svg" : imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Wishlist button overlay */}
        <button
          onClick={handleWishlistToggle}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-ink-500 shadow-sm opacity-0 transition-all group-hover:opacity-100 hover:text-lux-gold hover:scale-110"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-lux-gold text-lux-gold" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <p className="text-xs font-medium uppercase tracking-wider text-lux-gold">
            {product.category.name}
          </p>
        )}
        <h3 className="mt-1 font-medium text-ink-900 line-clamp-2 group-hover:text-lux-gold transition-colors min-h-[2.5rem]">
          {product.title}
        </h3>
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-ink-500">
          {product.condition && <span>{product.condition}</span>}
          {product.year && <span>• {product.year}</span>}
        </div>
        <p className="mt-auto pt-3 text-lg font-semibold text-ink-900">
          ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
