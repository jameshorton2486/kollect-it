"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="bg-lux-cream section-grand">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="space-y-6">
          <p className="text-label text-lux-gold">
            Curated for Discerning Collectors
          </p>
          
          <h1 className="heading-page text-lux-black">
            Curated Antiques & Fine Collectibles
          </h1>
          
          <p className="lead">
            Discover fine art, rare books, militaria, and one-of-a-kind treasures—each piece professionally described and fairly priced.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button asChild className="btn-primary rounded-full px-8">
              <Link href="/browse">Browse the Collection</Link>
            </Button>
            <Button asChild variant="outline" className="btn-secondary rounded-full px-8">
              <Link href="/categories">Explore Categories</Link>
            </Button>
          </div>

          {/* Trust Points */}
          <ul className="space-y-2 pt-4">
            {[
              "Each piece authenticated and carefully reviewed",
              "Personal service from inquiry to delivery",
              "Provenance documented when available",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-ink-600">
                <span className="h-2 w-2 rounded-full bg-lux-gold flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Featured Image */}
        <div className="relative">
          <div className="rounded-2xl border border-lux-silver-soft bg-lux-white p-4 shadow-soft">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
              <Image
                src="/images/homepage/hero/homepage-main-hero-v1.webp"
                alt="Curated antiques and collectibles"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-4 rounded-lg bg-lux-pearl px-4 py-3">
              <p className="text-sm text-ink-600 italic">
                "Every detail documented, every piece tells a story."
              </p>
              <p className="text-label mt-1">— Private Collector</p>
            </div>
          </div>
          
          {/* Floating Badge */}
          <div className="absolute -left-4 -top-4 hidden md:block rounded-lg bg-lux-white border border-lux-silver-soft px-4 py-2 shadow-clean">
            <p className="text-label text-lux-gold">Curated • Documented • Trusted</p>
          </div>
        </div>
      </div>
    </section>
  );
}


