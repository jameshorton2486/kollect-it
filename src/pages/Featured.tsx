import { DashboardLayout } from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Featured() {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) throw error;
      return data;
    },
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Star className="w-6 h-6 text-yellow-500" />
          <h1 className="text-3xl font-bold text-shop-900">Featured Items</h1>
        </div>
        
        <p className="text-shop-600 mb-8">
          Discover our most exceptional and valuable pieces, carefully curated for discerning collectors.
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
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
                      <Badge className="bg-yellow-500 text-white border-none flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Featured
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
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}