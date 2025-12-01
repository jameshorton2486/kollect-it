"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

interface CompareProduct {
  id: string;
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
        localStorage.getItem("compareProducts") || "[]",
      );

      if (compareIds.length === 0) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `/api/products/compare?ids=${JSON.stringify(compareIds)}`,
      );

      if (!response.ok) throw new Error("Failed to fetch comparison data");

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetch compare products.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = (productId: string) => {
    setProducts((productsInfor) =>
      productsInfor.filter((product) => product.id !== productId),
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg font-medium">Loading product comparison...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">No items.</h1>
        <p className="text-muted-foreground mb-6">
          There are no itmem in your comparison right now.
        </p>
        <Link
          href="/browse"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const specs = [
    { label: "Name", key: "title" as const },
    { label: "Price", key: "price" as const },
    { label: "Category", key: "category" as const },
    { label: "Condition", key: "condition" as const },
    { label: "Year", key: "year" as const },
    { label: "Artist", key: "artist" as const },
    { label: "Rarity", key: "rarity" as const },
  ];

  const formatValue = (product: CompareProduct, key: keyof CompareProduct) => {
    const value = product[key];

    if (key === "price" && typeof value === "number") {
      return `$${value.toFixed(2)}`;
    }

    if (key === "category") {
      return product.category?.name || "Uncategorized";
    }

    return value || "—";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Comparison</h1>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-[1.2fr_1.5fr_1.5fr] md:grid-cols-[1fr_repeat(\"${products.length}\", 1fr)] gap-4">
          {/* First column with spec labels */}
          <div className="space-y-4">
            <div className="font-semibold text-base">Product</div>
            {specs.map((spec) => (
              <div
                key={spec.key}
                className="py-2 border-b border-muted-foreground font-medium"
              >
                {spec.label}
              </div>
            ))}
          </div>

          {/* Product columns */}
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 relative">
              <button
                onClick={() => removeProduct(product.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-muted text-foreground hover:bg-muted-foreground hover:text-primary"
                aria-label="Remove from comparison table"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <Image
                    src={
                      product.images?.[0]?.url ? product.images[0].url : "/placeholder.svg"
                    }
                    alt={product.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <h2 className="text-base font-semibold text-center mb-2 line-clamp-2">
                  {product.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.category?.name || "Uncategorized"}
                </p>
                <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
              </div>

              <div className="mt-4 space-y-2">
                {specs.map((spec) => (
                  <div
                    className="py-1 border-b border-gray-200 text-sm text-center"
                    key={spec.key}
                  >
                    {formatValue(product, spec.key)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
