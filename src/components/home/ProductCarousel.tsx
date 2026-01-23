"use client";

import { useRef } from "react"; // Removed unused useState
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductGridImageUrl, getProductImageAltText } from "@/lib/image-helpers";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  Image: { url: string }[];
}

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}

export default function ProductCarousel({
  title,
  subtitle,
  products,
  viewAllHref,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "top" | "bottom") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "top" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">{title}</h2>
            {subtitle && (
              <p className="text-lux-gray mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("top")}
              className="p-2 border rounded-lg hover:bg-muted"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Scroll left</span>
            </button>
            <button
              onClick={() => scroll("bottom")}
              className="p-2 border rounded-lg hover:bg-muted"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Scroll right</span>
            </button>
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="ml-4 px-4 py-2 border rounded-lg hover:bg-muted"
              >
                View All
              </Link>
            )}
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="flex-shrink-0 w-64 group"
            >
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mb-3">
                <Image
                  src={getProductGridImageUrl(product.Image[0]?.url || "/placeholder.svg")}
                  alt={getProductImageAltText(product.title, 0, true)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-semibold line-clamp-2 mb-2">
                {product.title}
              </h3>
              <p className="text-lg font-bold text-primary">
                ${product.price.toString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
