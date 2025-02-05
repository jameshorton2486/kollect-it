import { ProductGrid } from "@/components/products/ProductGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ProductListingSort } from "./ProductListingSort";

interface Filters {
  search: string;
  category: string;
  subcategory: string;
  condition: string;
  priceRange: { min: string; max: string };
  era: string;
}

export function ProductListingGrid() {
  const [sortBy, setSortBy] = useState("created_at_desc");
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "all",
    subcategory: "all",
    condition: "all",
    priceRange: { min: "", max: "" },
    era: "all"
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", sortBy, filters],
    queryFn: async () => {
      const [field, direction] = sortBy.split("_");
      
      let query = supabase
        .from("products")
        .select("*, categories(*), subcategories(*)")
        .order(field, { ascending: direction === "asc" });

      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      if (filters.category !== "all") {
        query = query.eq("category_id", filters.category);
      }

      if (filters.subcategory !== "all") {
        query = query.eq("subcategory_id", filters.subcategory);
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
      return data;
    },
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-shop-600">
          {isLoading ? (
            "Loading products..."
          ) : (
            `${products?.length || 0} products found`
          )}
        </p>
        <ProductListingSort sortBy={sortBy} onSortChange={setSortBy} />
      </div>
      <ProductGrid 
        products={products || []} 
        categories={[]}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}