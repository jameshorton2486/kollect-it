"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { ProductCardData } from "@/components/ProductCard";

interface LatestArrivalsProps {
  products: ProductCardData[];
}

export default function LatestArrivalsClient({ products }: LatestArrivalsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="border-t border-lux-silver bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-12 space-y-6">
        {/* Header row – matches /browse typography */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-lux-gold">
              Just In
            </p>
            <h2 className="mt-1 font-serif text-2xl md:text-3xl text-lux-charcoal">
              Latest Arrivals
            </h2>
            <p className="mt-2 text-sm text-lux-gray">
              Freshly added pieces from trusted sellers across categories.
            </p>
          </div>

          <div className="md:text-right">
            <Link
              href="/browse"
              className="inline-flex items-center text-sm font-medium tracking-[0.14em] uppercase text-lux-gray hover:text-lux-gold transition-colors"
            >
              Browse all pieces
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Grid – reuses the same ProductCard styling as /browse */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

