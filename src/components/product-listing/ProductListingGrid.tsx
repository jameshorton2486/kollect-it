
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "../products/ProductCard";
import { NoProductsFound } from "./NoProductsFound";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Product, ProductListingGridProps } from "./types";

export function ProductListingGrid({ sortBy, filters }: ProductListingGridProps) {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", sortBy, filters],
    queryFn: async () => {
      const [field, direction] = sortBy.split("_");
      let query = supabase
        .from("products")
        .select("*, categories(*), subcategories(*)");

      query = query.order(field, { ascending: direction === "asc" });

      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      if (filters.category !== "all") {
        query = query.eq("category_id", filters.category);
      }

      if (filters.condition !== "all") {
        query = query.eq("condition", filters.condition);
      }

      if (filters.priceRange.min) {
        query = query.gte("price", parseFloat(filters.priceRange.min));
      }
      if (filters.priceRange.max) {
        query = query.lte("price", parseFloat(filters.priceRange.max));
      }

      if (filters.era !== "all") {
        query = query.eq("era", filters.era);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as Product[];
    },
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!products?.length) {
    return <NoProductsFound />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categoryName={product.categories?.name || undefined}
        />
      ))}
    </div>
  );
}
