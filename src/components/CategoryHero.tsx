"use client";

import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/image";

interface CategoryHeroProps {
  title: string;
  headline?: string;
  description: string;
  backgroundImage: string;
  productCount: number;
  features?: string[];
  collectingTip?: string;
  overlayGradient?: string;
}

/**
 * Luxury Category Hero Banner
 * 
 * Inspired by 1stDibs category pages with:
 * - Full-width hero image
 * - Elegant typography with editorial headline
 * - Product count badge
 * - Optional feature highlights
 * - Subtle gradient overlay for text readability
 */
export default function CategoryHero({
  title,
  headline,
  description,
  backgroundImage,
  productCount,
  features,
  collectingTip,
  overlayGradient = "from-lux-carbon/80 via-lux-carbon/50 to-transparent",
}: CategoryHeroProps) {
  // Check if image exists or use fallback
  const hasImage = backgroundImage && !backgroundImage.includes("undefined");
  
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 -z-10">
        {hasImage ? (
          <Image
            src={backgroundImage}
            alt={`${title} collection`}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center scale-105"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        ) : (
          // Fallback gradient when no image
          <div className="w-full h-full bg-gradient-to-br from-lux-charcoal via-lux-carbon to-lux-espresso" />
        )}
        
        {/* Gradient Overlay - Editorial Style */}
        <div className={`absolute inset-0 bg-gradient-to-r ${overlayGradient}`} />
        
        {/* Additional bottom fade for content transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative min-h-[400px] md:min-h-[480px] lg:min-h-[520px] flex items-center">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
          <div className="max-w-3xl">
            {/* Category Label */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 text-lux-gold-light text-xs font-semibold uppercase tracking-[0.2em]">
                <span className="w-8 h-px bg-lux-gold-light" />
                Collection
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-white text-[clamp(2.5rem,6vw,4rem)] leading-[1.1] tracking-tight mb-4">
              {title}
            </h1>

            {/* Editorial Headline */}
            {headline && (
              <p className="font-serif text-white/90 text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed italic mb-6">
                {headline}
              </p>
            )}

            {/* Description */}
            {description && (
              <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
                {description}
              </p>
            )}

            {/* Stats & Features Row */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Product Count Badge */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5">
                <span className="text-lux-gold-light font-semibold text-lg">
                  {productCount}
                </span>
                <span className="text-white/80 text-sm">
                  {productCount === 1 ? "Item Available" : "Items Available"}
                </span>
              </div>

              {/* Feature Pills */}
              {features && features.length > 0 && (
                <div className="hidden md:flex items-center gap-3">
                  {features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 text-white/70 text-sm"
                    >
                      <svg
                        className="w-4 h-4 text-lux-gold-light"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Collecting Tip - Subtle Editorial Note */}
            {collectingTip && (
              <div className="mt-8 pt-6 border-t border-white/10 max-w-xl">
                <p className="text-white/60 text-sm italic">
                  <span className="text-lux-gold-light font-medium not-italic">
                    Collector&apos;s Note:
                  </span>{" "}
                  {collectingTip}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lux-gold/30 to-transparent" />
    </section>
  );
}

