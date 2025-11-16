"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    id: "rare-books",
    name: "Rare Books",
    description: "First editions, signed copies, and literary treasures from around the world.",
    imageUrl: "/images/collections/rare-books.jpg",
    itemCount: 156,
  },
  {
    id: "fine-art",
    name: "Fine Art",
    description: "Original paintings, sculptures, and prints from established and emerging artists.",
    imageUrl: "/images/collections/fine-art.jpg",
    itemCount: 89,
  },
  {
    id: "militaria",
    name: "Militaria",
    description: "Authentic military artifacts, medals, and historical memorabilia.",
    imageUrl: "/images/collections/militaria.jpg",
    itemCount: 124,
  },
  {
    id: "collectibles",
    name: "Collectibles",
    description: "Unique pieces spanning coins, stamps, watches, and more.",
    imageUrl: "/images/collections/collectibles.jpg",
    itemCount: 203,
  },
];

export function FeaturedCollection() {
  return (
    <section className="py-16 md:py-24 bg-surface-2">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-4">
            Featured Collections
          </h2>
          <p className="text-ink/70 max-w-2xl mx-auto">
            Explore our curated categories of authenticated luxury collectibles and antiques.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/categories/${collection.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Collection Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-3">
                  <Image
                    src={collection.imageUrl}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  
                  {/* Item Count Badge */}
                  <div className="absolute top-4 right-4 bg-gold text-ink px-3 py-1 rounded-full text-sm font-semibold">
                    {collection.itemCount} items
                  </div>
                  
                  {/* Collection Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-2xl font-bold text-white mb-2">
                      {collection.name}
                    </h3>
                  </div>
                </div>

                {/* Collection Description */}
                <div className="p-6">
                  <p className="text-ink/70 text-sm leading-relaxed mb-4">
                    {collection.description}
                  </p>
                  <div className="flex items-center text-gold font-semibold group-hover:translate-x-2 transition-transform">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-ink text-ink hover:bg-ink hover:text-white"
          >
            <Link href="/categories">
              View All Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
