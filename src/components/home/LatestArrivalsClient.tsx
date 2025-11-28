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
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-400">
              Just In
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-ink-900">
              Latest Arrivals
            </h2>
            <p className="mt-2 text-sm text-ink-600">
              Fresh consignments and estate finds, published within the last few
              days.
            </p>
          </div>
          <Link
            href="/browse"
            className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.3em] text-ink-500 hover:text-ink-900"
          >
            Browse all pieces
            <span aria-hidden="true" className="ml-3">
              ↗
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

