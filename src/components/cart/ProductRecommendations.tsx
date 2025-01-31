import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ProductRecommendations() {
  const { addItem } = useCart();
  
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["product-recommendations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(4)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return null;

  return (
    <ScrollArea className="w-full">
      <div className="flex space-x-4 pb-4">
        {recommendations?.map((product) => (
          <Card key={product.id} className="flex-shrink-0 w-48">
            <div className="p-2">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-md"
                />
              )}
              <h4 className="mt-2 font-medium text-sm line-clamp-1">{product.name}</h4>
              <p className="text-shop-600 text-sm mt-1">{formatPrice(product.price)}</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => addItem(product.id)}
              >
                Add to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}