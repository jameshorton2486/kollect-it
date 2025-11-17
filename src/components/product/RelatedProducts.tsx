"use client";

import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/image";
import { useRef } from "react";
import { formatUSD0 } from "@/lib/currency";

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
    <div className="related-products-section section-spacing py-12 bg-gradient-to-b from-white to-parchment">
      <div className="container">
        {/* Section Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider font-semibold text-gold mb-2">
            Continue Exploring
          </p>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="related-products-title font-serif text-ink text-3xl md:text-4xl">
                You May Also Like
              </h2>
              <p className="text-sm text-ink-secondary mt-2">
                More authenticated pieces from our {categoryName} collection
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                className="rounded-full border border-gold/30 bg-white hover:bg-gold/10 p-2 transition-colors"
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
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="rounded-full border border-gold/30 bg-white hover:bg-gold/10 p-2 transition-colors"
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
              className="related-product-card snap-start shrink-0 w-[240px] group"
              data-card="true"
            >
              {/* Product Image Container */}
              <div className="related-product-image relative h-[200px] w-full overflow-hidden rounded-lg border border-ink-tertiary/10 bg-white">
                {product.images[0] ? (
                  <>
                    <Image
                      src={product.images[0].url}
                      alt={`${product.title} - ${product.category.name}`}
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
                  <div className="related-product-placeholder h-full w-full bg-gradient-to-br from-parchment to-ink-tertiary/10 flex items-center justify-center">
                    <span className="text-xs text-ink-secondary">No Image</span>
                  </div>
                )}

                {/* Authentication Badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-2 py-1 shadow-sm">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-green-600"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className="text-[10px] font-semibold text-ink">
                    Auth.
                  </span>
                </div>

                {/* View Details CTA */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-ink hover:bg-white">
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
              <div className="related-product-info mt-3 space-y-2">
                {/* Category Badge */}
                <p className="text-[10px] uppercase tracking-wider font-bold text-gold">
                  {product.category.name}
                </p>

                {/* Title */}
                <h3 className="related-product-title font-serif text-sm text-ink line-clamp-2 min-h-[2.5rem] group-hover:text-gold transition-colors">
                  {product.title}
                </h3>

                {/* Price */}
                <div className="flex items-baseline justify-between pt-1">
                  <p className="related-product-price font-serif text-lg font-bold text-ink">
                    {formatUSD0(product.price)}
                  </p>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gold opacity-0 group-hover:opacity-100 transition-opacity"
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
        <div className="mt-8 rounded-lg border border-gold/20 bg-gradient-to-r from-gold/5 to-transparent p-6 text-center">
          <p className="text-sm text-ink-secondary mb-3">
            Didn't find what you're looking for?
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-cta hover:bg-cta-hover text-white px-6 py-3 font-medium transition-colors"
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

