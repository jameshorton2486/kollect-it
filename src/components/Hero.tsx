"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative bg-ink text-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Authenticated Luxury
            <span className="block text-gold mt-2">
              Collectibles & Antiques
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your trusted marketplace for rare books, fine art, and historical treasures. 
            Every item professionally authenticated and fairly priced.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-gold hover:bg-gold-dark text-ink font-semibold px-8 py-6 text-lg"
            >
              <Link href="/products">Browse Collection</Link>
            </Button>
            
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-ink px-8 py-6 text-lg"
            >
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center">
                <div className="text-gold text-2xl font-bold mb-1">100%</div>
                <div className="text-white/80">Authenticated</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-gold text-2xl font-bold mb-1">$500-$15K</div>
                <div className="text-white/80">Price Range</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-gold text-2xl font-bold mb-1">Expert</div>
                <div className="text-white/80">Curation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

