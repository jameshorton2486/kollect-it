"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroBanner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

interface HeroBannerProps {
  banners: HeroBanner[];
}

export default function HeroBanner({ banners }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];
  if (!currentBanner) return null;

  return (
    <section className="relative h-[500px] bg-lux-gray-light">
      {/* Banner Image */}
      <div className="absolute inset-0">
        <Image
          src={currentBanner.image}
          alt={currentBanner.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-lux-white/80" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl font-bold mb-4">{currentBanner.title}</h1>
          <p className="text-xl mb-8">{currentBanner.subtitle}</p>
          <Link
            href={currentBanner.ctaLink}
            className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
          >
            {currentBanner.ctaText}
          </Link>
        </div>
      </div>

      {/* Navigation */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-surface-0/80 rounded-full hover:bg-surface-0 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-surface-0/80 rounded-full hover:bg-surface-0 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-surface-0" : "bg-surface-0/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

