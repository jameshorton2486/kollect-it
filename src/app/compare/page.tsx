"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Scale } from "lucide-react";

interface CompareProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  images: { url: string }[];
  condition?: string;
  year?: string;
  artist?: string;
  rarity?: string;
  category: { name: string };
}

export default function ComparisonPage() {
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComparison();
  }, []);

  const fetchComparison = async () => {
    try {
      const compareIds = JSON.parse(
        localStorage.getItem("compareProducts") || "[]"
      );

      if (compareIds.length === 0) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `/api/products/compare?ids=${JSON.stringify(compareIds)}`
      );

      if (!response.ok) throw new Error("Failed to fetch comparison data");

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching comparison products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    // Also update localStorage
    const currentIds = JSON.parse(localStorage.getItem("compareProducts") || "[]");
    const newIds = currentIds.filter((id: string) => id !== productId);
    localStorage.setItem("compareProducts", JSON.stringify(newIds));
  };

  const clearAll = () => {
    setProducts([]);
    localStorage.setItem("compareProducts", "[]");
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-[60vh] bg-lux-pearl">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-lux-gold border-t-transparent"></div>
            <p className="text-ink-600">Loading comparison...</p>
          </div>
        </div>
      </main>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <main className="min-h-[60vh] bg-lux-pearl">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="text-center max-w-md mx-auto">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-100">
              <Scale className="h-10 w-10 text-lux-gold" />
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              No Items to Compare
            </h1>
            <p className="mt-4 text-base text-ink-600">
              Add items to your comparison list while browsing to see them side by side.
            </p>
            <div className="mt-8">
              <Link
                href="/browse"
                className="inline-flex items-center justify-center rounded-full bg-lux-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lux-black shadow-sm transition-all hover:bg-lux-gold-light"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const specs = [
    { label: "Category", key: "category" as const },
    { label: "Condition", key: "condition" as const },
    { label: "Year", key: "year" as const },
    { label: "Artist", key: "artist" as const },
    { label: "Rarity", key: "rarity" as const },
  ];

  const formatValue = (product: CompareProduct, key: keyof CompareProduct) => {
    const value = product[key];

    if (key === "category") {
      return product.category?.name || "Uncategorized";
    }

    return value || "—";
  };

  return (
    <main className="min-h-screen bg-lux-pearl">
      {/* Header */}
      <section className="border-b border-border-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-lux-gold">
                Side by Side
              </p>
              <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                Compare Products
              </h1>
            </div>
            <button
              onClick={clearAll}
              className="rounded-full border border-border-300 px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-surface-50"
            >
              Clear All
            </button>
          </div>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Product Cards Row */}
            <div className={`grid gap-4 mb-6 ${
              products.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
              products.length === 2 ? 'grid-cols-2 max-w-2xl mx-auto' :
              'grid-cols-3'
            }`}>
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="relative rounded-xl border border-border-200 bg-white p-4 shadow-sm"
                >
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-100 text-ink-500 transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove from comparison"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <Link href={`/product/${product.slug}`} className="block">
                    <div className="relative mx-auto mb-4 aspect-square w-full max-w-[200px] overflow-hidden rounded-lg bg-surface-100">
                      <Image
                        src={product.images?.[0]?.url || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h2 className="text-center font-medium text-ink-900 line-clamp-2 hover:text-lux-gold transition-colors">
                      {product.title}
                    </h2>
                  </Link>
                  <p className="mt-1 text-center text-sm text-ink-500">
                    {product.category?.name || "Uncategorized"}
                  </p>
                  <p className="mt-2 text-center text-xl font-semibold text-ink-900">
                    ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>

            {/* Specs Table */}
            <div className="rounded-xl border border-border-200 bg-white overflow-hidden">
              {specs.map((spec, index) => (
                <div
                  key={spec.key}
                  className={`grid ${
                    products.length === 1 ? 'grid-cols-2' :
                    products.length === 2 ? 'grid-cols-3' :
                    'grid-cols-4'
                  } ${index !== specs.length - 1 ? 'border-b border-border-100' : ''}`}
                >
                  <div className="bg-surface-50 px-4 py-3 text-sm font-medium text-ink-500">
                    {spec.label}
                  </div>
                  {products.map((product) => (
                    <div key={product.id} className="px-4 py-3 text-sm text-ink-700 text-center">
                      {formatValue(product, spec.key)}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className={`mt-6 grid gap-4 ${
              products.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
              products.length === 2 ? 'grid-cols-2 max-w-2xl mx-auto' :
              'grid-cols-3'
            }`}>
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex items-center justify-center rounded-full bg-lux-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lux-black transition-all hover:bg-lux-gold-light"
                >
                  View Details
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
