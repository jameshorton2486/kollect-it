"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Scale } from "lucide-react";
import { EmptyState } from "@/components/ui";

interface CompareProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  Image: { url: string }[];
  condition?: string;
  year?: string;
  artist?: string;
  rarity?: string;
  Category: { name: string };
}

export default function ComparisonPage() {
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComparison();
  }, []);

  const fetchComparison = async () => {
    try {
      const compareIds = JSON.parse(localStorage.getItem("compareProducts") || "[]");

      if (compareIds.length === 0) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/products/compare?ids=${JSON.stringify(compareIds)}`);

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
    const currentIds = JSON.parse(localStorage.getItem("compareProducts") || "[]");
    const newIds = currentIds.filter((id: string) => id !== productId);
    localStorage.setItem("compareProducts", JSON.stringify(newIds));
  };

  const clearAll = () => {
    setProducts([]);
    localStorage.setItem("compareProducts", "[]");
  };

  const specs = [
    { label: "Category", key: "category" as const },
    { label: "Condition", key: "condition" as const },
    { label: "Year", key: "year" as const },
    { label: "Artist", key: "artist" as const },
    { label: "Rarity", key: "rarity" as const },
  ];

  const formatValue = (product: CompareProduct, key: string): string => {
    if (key === "category") {
      return product.Category?.name || "Uncategorized";
    }
    if (key === "price") {
      return `$${product.price.toLocaleString()}`;
    }
    const value = (product as any)[key];
    if (Array.isArray(value)) {
      return `${value.length} ${value.length === 1 ? 'item' : 'items'}`;
    }
    return String(value || "—");
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-[60vh] bg-lux-pearl">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-lux-gold/30 border-t-lux-gold"></div>
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
          <EmptyState
            icon={Scale}
            title="No Items to Compare"
            description="Add items to your comparison list while browsing to see them side by side."
            primaryAction={{ label: "Browse Products", href: "/browse" }}
          />
        </div>
      </main>
    );
  }

  const gridCols =
    products.length === 1
      ? "grid-cols-1 max-w-sm mx-auto"
      : products.length === 2
      ? "grid-cols-2 max-w-2xl mx-auto"
      : "grid-cols-3";

  const tableCols =
    products.length === 1
      ? "grid-cols-2"
      : products.length === 2
      ? "grid-cols-3"
      : "grid-cols-4";

  return (
    <main className="min-h-screen bg-lux-pearl">
      {/* Header */}
      <section className="bg-lux-cream section-normal border-b border-lux-silver-soft">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label text-lux-gold mb-2">Side by Side</p>
              <h1 className="heading-page text-lux-black">Compare Products</h1>
            </div>
            <button
              onClick={clearAll}
              className="btn-secondary rounded-full text-sm"
              aria-label="Clear all products from comparison"
            >
              Clear All
            </button>
          </div>
        </div>
      </section>

      {/* Comparison Content */}
      <section className="container mx-auto max-w-6xl px-4 py-10">
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Product Cards Row */}
            <div className={`grid gap-4 mb-8 ${gridCols}`}>
              {products.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-lux-white rounded-xl border border-lux-silver-soft p-4 shadow-clean"
                >
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-lux-cream text-lux-gray-dark transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label={`Remove ${product.title} from comparison`}
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <Link href={`/product/${product.slug}`} className="block">
                    <div className="relative mx-auto mb-4 aspect-square w-full max-w-[200px] overflow-hidden rounded-lg bg-lux-cream">
                      <Image
                        src={product.Image?.[0]?.url || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h2 className="text-center font-medium text-lux-black line-clamp-2 hover:text-lux-gold transition-colors">
                      {product.title}
                    </h2>
                  </Link>
                  <p className="mt-1 text-center text-sm text-ink-600">
                    {product.Category?.name || "Uncategorized"}
                  </p>
                  <p className="mt-2 text-center text-xl font-semibold text-lux-black">
                    ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>

            {/* Specs Table */}
            <div className="bg-lux-white rounded-xl border border-lux-silver-soft overflow-hidden">
              {specs.map((spec, index) => (
                <div
                  key={spec.key}
                  className={`grid ${tableCols} ${
                    index !== specs.length - 1 ? "border-b border-lux-silver-soft" : ""
                  }`}
                >
                  <div className="bg-lux-cream px-4 py-3 text-sm font-medium text-lux-gray-dark">
                    {spec.label}
                  </div>
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="px-4 py-3 text-sm text-ink-600 text-center"
                    >
                      {formatValue(product, spec.key)}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className={`mt-6 grid gap-4 ${gridCols}`}>
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="btn-primary text-center rounded-full"
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
