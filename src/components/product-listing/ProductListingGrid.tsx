import { ProductGrid } from "@/components/products/ProductGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ProductListingSort } from "./ProductListingSort";

export function ProductListingGrid() {
  const [sortBy, setSortBy] = useState("created_at_desc");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", sortBy],
    queryFn: async () => {
      const [field, direction] = sortBy.split("_");
      
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .order(field, { ascending: direction === "asc" });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ProductListingSort sortBy={sortBy} onSortChange={setSortBy} />
      </div>
      <ProductGrid products={products || []} categories={categories} />
    </div>
  );
}