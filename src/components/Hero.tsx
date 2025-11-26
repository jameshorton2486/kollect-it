"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] lg:min-h-screen overflow-hidden bg-ink-900 text-surface-0">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage:
            "url('/images/homepage/hero/homepage-main-hero-v1.webp')",
        }}
      />

      {/* Black luxury gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/85" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 flex items-center justify-center min-h-[70vh] md:min-h-[80vh] lg:min-h-screen">
        <div className="flex w-full justify-center">
          <div className="bg-black/65 backdrop-blur-sm px-6 py-10 sm:px-10 sm:py-12 rounded-[32px] shadow-elevated border border-white/10 max-w-2xl w-full text-center">
            {/* NEW Luxury Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight text-surface-0">
              Curated Fine Art &amp; Antiques
            </h1>

            {/* Subheadline (unchanged text wording) */}
            <p className="text-base md:text-lg lg:text-xl text-surface-100/90 mb-8 leading-relaxed">
              Discover authenticated antiques and collectibles from trusted
              sources. Each listing is personally reviewed before it goes
              live.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg">
                <Link href="/browse">Browse Collection</Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-surface-0 hover:text-surface-0 hover:bg-surface-0/10"
              >
                <Link href="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

