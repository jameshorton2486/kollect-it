"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { ProductCardData } from "@/components/ProductCard";

interface RecentAdditionsProps {
  products: ProductCardData[];
}

export default function RecentAdditions({ products }: RecentAdditionsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-lux-pearl section-normal">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <p className="text-label text-lux-gold mb-2">Just In</p>
            <h2 className="heading-section text-lux-black">Recent Additions</h2>
            <p className="text-muted mt-2">
              Fresh consignments and estate finds, published within the last few days.
            </p>
          </div>
          <Link
            href="/browse"
            className="text-label text-lux-gold hover:text-lux-gold-light transition-colors flex items-center gap-2"
          >
            Browse all pieces
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-luxury">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
