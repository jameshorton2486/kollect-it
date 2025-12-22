"use client";

import ProductCard from "./ProductCard";

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  condition?: string | null;
  year?: string | null;
  images: { url: string }[];
  category?: { name: string; slug: string } | null;
}

interface ProductGridProps {
  products: Product[];
  view?: "grid" | "list";
  /** Center items when there are fewer than 4 products */
  centerSparse?: boolean;
}

export function ProductGrid({ products, view = "grid", centerSparse = true }: ProductGridProps) {
  const isSparse = products.length < 4;
  
  if (view === "list") {
    return (
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} view="list" />
        ))}
      </div>
    );
  }

  // Grid view with optional centering for sparse inventory
  return (
    <div
      className={`grid gap-4 sm:gap-6 ${
        isSparse && centerSparse
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} view="grid" />
      ))}
    </div>
  );
}

export default ProductGrid;
