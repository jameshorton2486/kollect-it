import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductListingGridProps {
  sortBy: string;
  filters: {
    search: string;
    category: string;
    subcategory: string;
    condition: string;
    priceRange: { min: string; max: string };
    era: string;
  };
}

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: string;
  categories?: {
    name: string | null;
  } | null;
  subcategories?: {
    name: string | null;
  } | null;
};

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
      return data as Product[];
    },
  });

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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading ? (
          [...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </Card>
          ))
        ) : products?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-shop-600">No products found matching your criteria.</p>
          </div>
        ) : (
          products?.map((product) => (
            <Card 
              key={product.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
            >
              {product.image_url && (
                <div className="relative aspect-square">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </Badge>
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-shop-800 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-shop-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-shop-900 font-bold">
                    {formatPrice(product.price)}
                  </span>
                  {product.categories && (
                    <span className="text-shop-500 text-sm">
                      {product.categories.name}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}