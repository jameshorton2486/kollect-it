"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const highlights = [
  "Authenticated consignments",
  "Concierge shipping coordination",
  "Documented provenance when available",
];

export function Hero() {
  return (
    <section className="bg-lux-pearl">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-400">
            Kollect-It Marketplace
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              Curated art, objects, and design with collector-grade detail.
            </h1>
            <p className="text-base leading-relaxed text-ink-700 sm:text-lg">
              Each listing is photographed, catalogued, and authenticated by our
              in-house curator so you can acquire confidently—whether it&apos;s a
              single sculptural object or a full salon wall.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-ink-600 sm:flex-row">
            <Button asChild size="lg" variant="gold" className="rounded-full px-8">
              <Link href="/browse">Browse Collection</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-border-300 px-8 text-ink-700 hover:text-ink-900"
            >
              <Link href="/how-it-works">How It Works</Link>
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

        <div className="relative">
          <div className="rounded-[36px] border border-white/60 bg-white p-4 shadow-[0_25px_80px_rgba(15,23,42,0.18)]">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px]">
              <Image
                src="/images/homepage/hero/homepage-main-hero-v1.webp"
                alt="Kollect-It curated antiques"
                fill
                className="object-cover"
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

