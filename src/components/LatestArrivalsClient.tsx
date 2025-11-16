"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export function LatestArrivalsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch latest products
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products?limit=8&sort=newest");
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-surface-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-4">
              Latest Arrivals
            </h2>
            <p className="text-ink/70 max-w-2xl mx-auto">
              Loading our newest authenticated pieces...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-surface-2 animate-pulse rounded-lg h-80"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-surface-1">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-4">
            Latest Arrivals
          </h2>
          <p className="text-ink/70 max-w-2xl mx-auto">
            Discover our newest authenticated pieces. Each item is expertly curated
            and ready for your collection.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-surface-2">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="text-xs text-gold uppercase tracking-wide mb-2">
                    {product.category}
                  </div>
                  <h3 className="font-serif text-ink font-semibold mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-ink/60 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="text-xl font-bold text-ink">
                    ${product.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-cta hover:bg-cta-hover text-white"
          >
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
