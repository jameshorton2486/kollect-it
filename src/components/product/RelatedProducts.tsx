"use client";

import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/image";
import { useRef } from "react";
import { formatUSD0 } from "@/lib/currency";
import { getProductGridImageUrl, getProductImageAltText } from "@/lib/image-helpers";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  images: { url: string }[];
  category: { name: string };
}

interface RelatedProductsProps {
  products: Product[];
  categoryName: string;
}

export default function RelatedProducts({
  products,
  categoryName,
}: RelatedProductsProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card=true]");
    const amount = card ? card.offsetWidth + 16 : 300; // include gap
    el.scrollBy({ left: dir * amount * 1.5, behavior: "smooth" });
  };

  return (
    <div className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-lux-white to-lux-pearl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-lux-gold mb-2">
            Continue Exploring
          </p>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-ink-900 text-3xl md:text-4xl">
                You May Also Like
              </h2>
              <p className="text-sm text-ink-600 mt-2">
                More authenticated pieces from our {categoryName} collection
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                className="rounded-full border border-lux-gold/30 bg-lux-white hover:bg-lux-gold/10 p-2 transition-colors"
                aria-label="Scroll left"
                onClick={() => scrollByCards(-1)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-lux-charcoal"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="rounded-full border border-lux-gold/30 bg-lux-white hover:bg-lux-gold/10 p-2 transition-colors"
                aria-label="Scroll right"
                onClick={() => scrollByCards(1)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-lux-charcoal"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Products Carousel */}
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x pb-4 -mx-4 px-4"
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="snap-start shrink-0 w-[240px] group"
              data-card="true"
            >
              {/* Product Image Container */}
              <div className="relative h-[200px] w-full overflow-hidden rounded-lg border border-border-200 bg-lux-white">
                {product.images[0] ? (
                  <>
                    <Image
                      src={getProductGridImageUrl(product.images[0].url)}
                      alt={getProductImageAltText(product.title, 0, true)}
                      width={300}
                      height={200}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      quality={85}
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                    {/* Overlay Gradient */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-hidden="true"
                    ></div>
                  </>
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-lux-pearl to-lux-gray-light/10 flex items-center justify-center">
                    <span className="text-xs text-ink-600">Image Coming Soon</span>
                  </div>
                )}

                {/* Authentication Badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full border border-white/40 bg-white/80 px-2 py-1 text-ink-700 shadow-sm backdrop-blur">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-lux-gold"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className="text-[10px] font-semibold text-ink-900">
                    Auth.
                  </span>
                </div>

                {/* View Details CTA */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-lux-white/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-ink-900 hover:bg-lux-white">
                    View Details
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-3 space-y-2">
                {/* Category Badge */}
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-lux-gold">
                  {product.category.name}
                </p>

                {/* Title */}
                <h3 className="font-serif text-sm text-ink-900 line-clamp-2 min-h-[2.5rem] group-hover:text-lux-gold transition-colors">
                  {product.title}
                </h3>

                {/* Price */}
                <div className="flex items-baseline justify-between pt-1">
                  <p className="font-serif text-lg font-bold text-ink-900">
                    {formatUSD0(product.price)}
                  </p>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-lux-gold opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-8 rounded-lg border border-lux-gold/20 bg-gradient-to-r from-lux-gold/5 to-transparent p-6 text-center">
          <p className="text-sm text-ink-600 mb-3">
            Didn't find what you're looking for?
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 rounded-full bg-lux-gold hover:bg-lux-gold-light text-lux-black px-6 py-3 font-medium transition-colors"
          >
            Browse Full Inventory
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
          </Link>
        </div>
      </div>
    </div>
  );
}
