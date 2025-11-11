'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {

  // Prefetch links on hover to reduce navigation latency
  const handleLinkHover = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-antique-shop.jpg"
          alt="Collectors browsing authenticated antiques"
          fill
          priority
          className="object-cover"
          quality={75} // Reduced from 90 for faster loading (90/85/75 = LCP improvement)
          sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1280px"
          loading="eager"
        />
        {/* Dark overlay for text readability - use CSS instead of div for performance */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
        {/* Tagline */}
        <p className="text-sm tracking-[0.2em] uppercase text-[#D3AF37] mb-6 font-light will-change-transform">
          Professionally Curated Collectibles
        </p>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light mb-6 leading-tight will-change-transform">
          Collectibles Worth
          <br />
          Collecting
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-200 mb-4 max-w-3xl mx-auto font-light leading-relaxed">
          Professionally described, fairly priced, personally curated.
          <br />
          Items from $500-$15,000 that deserve expert attention.
        </p>

        {/* Feature Bullets */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-gray-300 mb-10">
          <span>Rare Books to Fine Art</span>
          <span className="hidden md:inline">•</span>
          <span>Collectibles to Militaria</span>
          <span className="hidden md:inline">•</span>
          <span>Professionally Authenticated</span>
          <span className="hidden md:inline">•</span>
          <span>Insured & Tracked Shipping</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            href="/shop"
            className="px-8 py-4 bg-[#D3AF37] text-[#1a1a1a] font-medium hover:bg-[#c9a532] transition-colors duration-300 min-w-[200px] rounded-sm"
            onMouseEnter={() => handleLinkHover('/shop')}
          >
            Browse Collectibles
          </Link>
          <Link
            href="/about"
            className="px-8 py-4 border-2 border-white text-white font-medium hover:bg-white hover:text-[#1a1a1a] transition-colors duration-300 min-w-[200px] rounded-sm"
            onMouseEnter={() => handleLinkHover('/about')}
          >
            How We Work
          </Link>
        </div>

        {/* Social Proof */}
        <div className="text-sm text-gray-300">
          <p className="flex items-center justify-center gap-2">
            <span className="text-[#D3AF37]">★★★★★</span>
            <span>Honest descriptions, fair pricing, real communication</span>
          </p>
        </div>
      </div>
    </section>
  );
}
