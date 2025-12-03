"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const highlights = [
  "Each piece authenticated and carefully reviewed",
  "Personal service from inquiry to delivery",
  "Provenance and history documented when available",
];

export function Hero() {
  return (
    <section className="bg-lux-pearl pt-24 pb-16 sm:pt-32 sm:pb-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6 animate-fade-in-up">
          <p className="text-xs uppercase tracking-[0.25em] text-lux-gold mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Discover exceptional pieces, thoughtfully curated
          </p>
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              Curated fine art, rare books, collectibles, and militaria—handpicked for discerning collectors.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
              Every piece is thoughtfully photographed and reviewed so you can shop with confidence—whether you're discovering a single standout object or building an entire wall or shelf story.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-ink-600 sm:flex-row animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" variant="gold" className="rounded-full px-8 transition-all duration-luxury hover:scale-[1.02] hover:shadow-soft">
              <Link href="/browse">Browse the Collection</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-border-300 px-8 text-ink-700 hover:text-ink-900 transition-all duration-luxury hover:scale-[1.02] hover:shadow-clean"
            >
              <Link href="/categories">Explore Categories</Link>
            </Button>
          </div>

          <ul className="space-y-2 text-sm text-ink-600">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-lux-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="rounded-[36px] border border-white/60 bg-white p-4 shadow-[0_25px_80px_rgba(15,23,42,0.18)] transition-all duration-smooth hover:shadow-soft">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] group/image">
              <Image
                src="/images/homepage/hero/homepage-main-hero-v1.webp"
                alt="Kollect-It curated antiques"
                fill
                className="object-cover transition-transform duration-smooth group-hover/image:scale-105"
                priority
              />
            </div>
            <div className="mt-4 rounded-2xl bg-lux-ink-soft px-4 py-3 text-sm text-ink-700">
              “Listings feel straight out of a gallery catalogue—every detail is
              documented.” – Private collector
            </div>
          </div>
          <div className="absolute -left-6 -top-6 hidden rounded-2xl border border-white/50 bg-white/90 px-4 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-ink-400 shadow-lg md:block">
            Curated • Documented • Ready to ship
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
