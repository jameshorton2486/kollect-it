import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-antique-shop.jpg"
          alt="Collectors browsing authenticated antiques"
          fill
          priority
          className="object-cover"
          quality={90}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
        {/* Tagline */}
        <p className="text-sm tracking-[0.2em] uppercase text-[#D3AF37] mb-6 font-light">
          Curated for the Discerning Collector
        </p>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light mb-6 leading-tight">
          Authenticated Antiques,
          <br />
          Curated with Care
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-200 mb-4 max-w-3xl mx-auto font-light leading-relaxed">
          Discover museum-quality antiques and rare collectibles handpicked by specialists.
          <br />
          Each piece is authenticated, documented, and arrives ready to treasure.
        </p>

        {/* Feature Bullets */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-gray-300 mb-10">
          <span>Fine Art to Rare Books</span>
          <span className="hidden md:inline">•</span>
          <span>Furniture to Collectibles</span>
          <span className="hidden md:inline">•</span>
          <span>Expert Authentication</span>
          <span className="hidden md:inline">•</span>
          <span>Insured Shipping</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            href="/collections"
            className="px-8 py-4 bg-[#D3AF37] text-[#1a1a1a] font-medium hover:bg-[#c9a532] transition-colors duration-300 min-w-[200px]"
          >
            Browse Collections
          </Link>
          <Link
            href="/authentication"
            className="px-8 py-4 border-2 border-white text-white font-medium hover:bg-white hover:text-[#1a1a1a] transition-colors duration-300 min-w-[200px]"
          >
            How We Authenticate
          </Link>
        </div>

        {/* Social Proof */}
        <div className="text-sm text-gray-300">
          <p className="flex items-center justify-center gap-2">
            <span className="text-[#D3AF37]">★★★★★</span>
            <span>Trusted by museums and private collectors</span>
          </p>
        </div>
      </div>
    </section>
  );
}
