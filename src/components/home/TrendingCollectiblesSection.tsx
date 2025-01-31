import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function TrendingCollectiblesSection() {
  const { data: trendingProducts, isLoading } = useQuery({
    queryKey: ["trending-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .limit(4)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-shop-50/50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Flame className="w-6 h-6 text-orange-500" />
          <h2 className="text-3xl md:text-4xl font-bold text-center text-shop-900">
            Trending Now
          </h2>
        </div>
        <p className="text-lg text-shop-600 text-center mb-12 max-w-3xl mx-auto">
          Discover the most sought-after collectibles making waves in our community
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts?.map((product) => (
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}