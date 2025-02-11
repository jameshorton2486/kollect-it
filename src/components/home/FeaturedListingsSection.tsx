
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedListingsSection() {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .limit(3)
        .order("price", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-4">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <h2 className="text-3xl md:text-4xl font-bold text-center text-shop-900 font-display">
            Featured Listings
          </h2>
        </div>
        <p className="text-lg text-shop-600 text-center mb-12 max-w-3xl mx-auto font-sans">
          Discover exceptional pieces from our curated collection
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts?.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
              >
                {product.image_url && (
                  <div className="relative aspect-[4/3]">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500/90 text-white border-none flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </Badge>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <Badge variant="secondary" className="mb-2">
                    {product.categories?.name || "Uncategorized"}
                  </Badge>
                  <h3 className="text-xl font-semibold mb-2 text-shop-800 font-display">
                    {product.name}
                  </h3>
                  <p className="text-shop-600 mb-4 line-clamp-2 font-sans">
                    {product.description}
                  </p>
                  <div className="text-xl font-bold text-shop-900">
                    {formatPrice(product.price)}
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
