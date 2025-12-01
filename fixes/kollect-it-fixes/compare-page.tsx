"use client";

import { useState, useEffect } from "react";
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
        `/api/products/compare?ids=${compareIds.join(",")}`,
      );
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch comparison:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = (productId: string) => {
    const compareIds = JSON.parse(
      localStorage.getItem("compareProducts") || "[]",
    );
    const updated = compareIds.filter((id: string) => id !== productId);
    localStorage.setItem("compareProducts", JSON.stringify(updated));
    fetchComparison();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading comparison...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">No products to compare</h1>
        <p className="text-muted-foreground mb-6">
          Add products to compare side-by-side
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const specs = [
    { label: "Price", key: "price" },
    { label: "Category", key: "category" },
    { label: "Condition", key: "condition" },
    { label: "Year", key: "year" },
    { label: "Artist", key: "artist" },
    { label: "Rarity", key: "rarity" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Comparison</h1>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-muted">
              <th className="p-4 text-left font-semibold border-r">
                Specification
              </th>
              {products.map((product) => (
                <th key={product.id} className="p-4 border-r min-w-[250px]">
                  <div className="relative">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <Link href={`/products/${product.id}`}>
                      <div className="relative aspect-square bg-muted rounded mb-3">
                        <Image
                          src={product.images[0]?.url || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specs.map((spec) => (
              <tr key={spec.key} className="border-t">
                <td className="p-4 font-semibold border-r bg-muted/30">
                  {spec.label}
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 border-r text-center">
                    {spec.key === "price"
                      ? `$${product.price.toFixed(2)}`
                      : spec.key === "category"
                        ? product.category.name
                        : (product as any)[spec.key] || "—"}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t">
              <td className="p-4 font-semibold border-r bg-muted/30">
                Actions
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-4 border-r">
                  <div className="space-y-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="block w-full bg-primary text-primary-foreground px-4 py-2 rounded text-center font-semibold hover:bg-primary/90"
                    >
                      View Details
                    </Link>
                    <button className="w-full border px-4 py-2 rounded font-semibold hover:bg-muted">
                      Add to Cart
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

