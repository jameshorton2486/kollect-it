"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-lux-cream py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-lux-gold/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <div className="text-center lg:text-left">
            {/* Headline - Large serif, lighter weight */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-6 leading-[1.1] text-lux-black tracking-tight">
              Rare Finds,
              <span className="block text-lux-gold mt-2">
                Timeless Treasures
              </span>
            </h1>

            {/* Subheadline - Lighter weight body */}
            <p className="text-lg md:text-xl text-lux-gray-dark mb-8 max-w-xl leading-relaxed font-light">
              Discover authenticated antiques and collectibles from trusted sources. 
              Every piece tells a story worth preserving.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-lux-black hover:bg-lux-charcoal text-lux-white font-medium px-8 py-6 text-base"
              >
                <Link href="/shop">Browse Collection</Link>
              </Button>
              
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-lux-gray-dark hover:text-lux-black font-medium group"
              >
                <Link href="/how-it-works" className="flex items-center gap-2">
                  How It Works 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
              {/* Hero Image - Replace src with your actual image */}
              <Image
                src="/images/hero-collectible.jpg"
                alt="Curated antique collectible - leather-bound book or vintage timepiece"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-lux-black/10 to-transparent" />
            </div>
            
            {/* Optional: Decorative frame accent */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-lux-gold/20 rounded-lg -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
