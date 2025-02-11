
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Tables } from "@/integrations/supabase/types";

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string;
}

export function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
  const { data: relatedProducts, isLoading } = useQuery({
    queryKey: ["related-products", currentProductId, categoryId],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .neq("id", currentProductId)
        .limit(4);
      
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !relatedProducts?.length) return null;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold text-shop-800 mb-6">Related Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Card 
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            {product.image_url && (
              <div className="aspect-square">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h4 className="font-semibold text-shop-800 mb-2 line-clamp-1">
                {product.name}
              </h4>
              <p className="text-shop-600 text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <p className="text-shop-900 font-bold">
                {formatPrice(product.price)}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
