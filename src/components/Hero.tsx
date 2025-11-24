"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative bg-gradient-subtle py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-lux-gold/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column: Text Content */}
        <div className="text-center md:text-left">
          {/* Headline */}
          <h1 className="font-serif text-display-xl font-normal mb-6 leading-tight text-lux-black">
            Rare Finds, Timeless
            <span className="block text-lux-gold mt-2">
              Treasures
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-body-lg text-lux-gray-dark mb-8 max-w-2xl leading-relaxed">
            Discover authenticated antiques and collectibles from trusted sources. Every piece tells a story worth preserving.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              asChild
              size="lg"
              className="bg-lux-black hover:bg-lux-charcoal text-lux-white font-semibold shadow-cta"
            >
              <Link href="/shop">Browse Collection</Link>
            </Button>
            
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-lux-black text-lux-black hover:bg-lux-pearl"
            >
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>

        {/* Right Column: Decorative Image */}
        <div className="relative">
          <img
            src="/images/hero-image.jpg"
            alt="Hero Decorative"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;

