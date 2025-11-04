import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white section-spacing text-center">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        {/* Premium eyebrow */}
        <p className="text-sm md:text-base font-semibold text-accent-gold uppercase tracking-widest mb-4">
          Curated for the Discerning Collector
        </p>
        
        <h1 className="font-serif text-5xl md:text-7xl text-ink mb-6 leading-tight">
          Authenticated Antiques, Curated with Care
        </h1>
        
        <p className="text-lg md:text-xl text-ink-light leading-relaxed max-w-3xl mx-auto mb-4">
          Discover museum-quality antiques and rare collectibles handpicked by specialists. Each piece is authenticated, documented, and arrives ready to treasure.
        </p>
        
        <p className="text-base text-accent-gold font-medium max-w-2xl mx-auto mb-10">
          From Fine Art to Rare Books • Furniture to Collectibles • Expert Authentication • Insured Shipping
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-block bg-accent-gold text-white font-semibold px-10 py-4 rounded-lg hover:opacity-90 transition-opacity text-lg"
          >
            Shop Now
          </Link>
          <Link
            href="/about"
            className="inline-block bg-white border-2 border-accent-gold text-accent-gold font-semibold px-10 py-4 rounded-lg hover:bg-accent-gold hover:text-white transition-all text-lg"
          >
            Learn About Us
          </Link>
        </div>
        
        {/* Trust indicators below CTA */}
        <div className="mt-16 pt-12 border-t border-surface-2 grid grid-cols-3 gap-6">
          <div>
            <p className="text-2xl font-bold text-accent-gold">100%</p>
            <p className="text-sm text-ink-light">Authenticated</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent-gold">1000+</p>
            <p className="text-sm text-ink-light">Curated Items</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent-gold">30-Day</p>
            <p className="text-sm text-ink-light">Returns</p>
          </div>
        </div>
      </div>

      {/* Premium background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(253,251,247,1)_0%,_rgba(253,251,247,0.8)_40%,_rgba(253,251,247,0.5)_65%,_rgba(253,251,247,0.2)_85%,_transparent_100%)]"
      />
      <Image
        src="https://ik.imagekit.io/kollectit/home-hero.jpg"
        alt="Kollect-It antique gallery background"
        width={1920}
        height={900}
        className="absolute inset-0 h-full w-full object-cover opacity-5"
        priority
      />
    </section>
  );
}
