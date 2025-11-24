"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative bg-gradient-subtle py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="font-serif text-display-xl font-bold mb-6 leading-tight text-ink-900">
            Rare Finds, Timeless
            <span className="block text-gold-600 mt-2">
              Treasures
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-body-lg text-ink-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover authenticated antiques and collectibles from trusted sources. 
            Every piece tells a story worth preserving.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-cta-600 hover:bg-cta-700 text-white font-semibold shadow-cta"
            >
              <Link href="/shop">Browse Collection</Link>
            </Button>
            
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-border-300 text-ink-900 hover:bg-surface-100 hover:text-ink-900"
            >
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-section-small pt-8 border-t border-border-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center">
                <div className="text-gold-600 text-2xl font-bold mb-1">100%</div>
                <div className="text-ink-600">Authenticated</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-gold-600 text-2xl font-bold mb-1">5,000+</div>
                <div className="text-ink-600">Happy Collectors</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-gold-600 text-2xl font-bold mb-1">$2M+</div>
                <div className="text-ink-600">Items Sold</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

