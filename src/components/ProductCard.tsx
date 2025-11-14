"use client";

import Link from "next/link";
import Image from "next/image";
import { formatUSDWhole } from "@/lib/currency";
import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { useWishlist } from "@/contexts/WishlistContext";
import { BLUR_DATA_URL, transformCloudinary } from "@/lib/image";

export interface ProductCardData {
  id: string;
  title: string;
  price: number;
  slug: string;
  image?: string | null;
  category?: string;
  description?: string | null;
}

export default function ProductCard({
  product,
  variant = "grid",
}: {
  product: ProductCardData;
  variant?: "grid" | "list";
}) {
  const { isInWishlist, toggleWishlist, loading } = useWishlist();
  const [hovered, setHovered] = useState(false);
  const wishlisted = isInWishlist(product.id);

  const imgSrc = product.image
    ? transformCloudinary(product.image, "thumbnail")
    : "/placeholder.jpg";

  if (variant === "list") {
    return (
      <div className="flex gap-4 rounded border border-[var(--color-gray-light)] bg-white p-3">
        <Link
          href={`/product/${product.slug}`}
          className="block h-36 w-36 shrink-0 overflow-hidden rounded"
        >
          <Image
            src={imgSrc}
            alt={`${product.title} - ${product.category || "Product"} thumbnail`}
            width={150}
            height={150}
            className="h-full w-full object-cover"
            quality={85}
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </Link>
        <div className="flex flex-1 items-center justify-between gap-4">
          <div>
            {product.category && (
              <div className="text-[11px] uppercase tracking-wide text-brand-gold">
                {product.category}
              </div>
            )}
            <Link href={`/product/${product.slug}`} className="no-underline">
              <h3 className="font-serif text-[20px] leading-snug text-brand-navy line-clamp-2">
                {product.title}
              </h3>
            </Link>
            {product.description && (
              <p className="mt-1 text-[14px] text-[var(--color-gray-dark)] line-clamp-2">
                {product.description}
              </p>
            )}
            <div className="mt-2 text-[20px] font-semibold text-brand-gold">
              {formatUSDWhole(product.price)}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <AddToCartButton
                variant="secondary"
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  slug: product.slug,
                  image: imgSrc,
                  categoryName: product.category || "General",
                }}
                quantity={1}
              />
              <button
                className={`inline-flex items-center gap-2 rounded border border-[var(--color-gray-light)] px-3 py-2 text-[14px] ${wishlisted ? "text-brand-gold" : ""}`}
                aria-label={
                  wishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                onClick={async (e) => {
                  e.preventDefault();
                  await toggleWishlist(product.id);
                }}
                disabled={loading}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={wishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // grid variant
  return (
    <div
      className="group rounded-lg border-2 border-[var(--color-gray-light)] bg-white overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[var(--color-accent)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Section - 70% of card height */}
      <div className="relative overflow-hidden aspect-[4/5]">
        <Link href={`/product/${product.slug}`} className="block h-full">
          <Image
            src={imgSrc}
            alt={`${product.title} - ${product.category || "Product"} image`}
            width={400}
            height={500}
            className={`h-full w-full object-cover transition-transform duration-500 ${hovered ? "scale-110" : "scale-100"}`}
            quality={90}
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
          {/* Category badge - top left */}
          {product.category && (
            <span className="absolute left-3 top-3 rounded bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)] shadow-md backdrop-blur-sm border-2 border-[var(--color-accent)]">
              {product.category}
            </span>
          )}
        </Link>
        {/* Wishlist button - top right */}
        <button
          className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full border-2 border-white bg-white/95 p-2.5 backdrop-blur-sm transition-all hover:scale-110 hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-white shadow-md"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={async (e) => {
            e.preventDefault();
            await toggleWishlist(product.id);
          }}
          disabled={loading}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={wishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Content Section - 30% of card height */}
      <div className="p-4 flex flex-col gap-2">
        <Link href={`/product/${product.slug}`} className="no-underline">
          <h3 className="font-serif text-[22px] leading-tight text-[var(--color-charcoal)] line-clamp-2 transition-colors hover:text-[var(--color-accent)]">
            {product.title}
          </h3>
        </Link>

        {/* Large, scannable price */}
        <div className="text-[28px] font-bold text-[var(--color-accent)] mt-1">
          {formatUSDWhole(product.price)}
        </div>

        {/* Add to cart button - shows on hover */}
        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <AddToCartButton
            variant="card"
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              slug: product.slug,
              image: imgSrc,
              categoryName: product.category || "General",
            }}
            quantity={1}
          />
        </div>
      </div>
    </div>
  );
}
