import { Tables } from "@/integrations/supabase/types";
import { ProductCard } from "./ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductGridProps {
  products: Tables<"products">[];
  categories: Tables<"categories">[] | undefined;
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  // Fetch trending products for badges
  const { data: trendingProducts } = useQuery({
    queryKey: ["trending-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data.map(p => p.id);
    },
  });

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return undefined;
    return categories?.find((c) => c.id === categoryId)?.name;
  };

  const isProductTrending = (productId: string) => {
    return trendingProducts?.includes(productId);
  };

  const isProductNew = (createdAt: string) => {
    const productDate = new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return productDate > thirtyDaysAgo;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-shop-800">No products found</h3>
        <p className="text-shop-500 mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categoryName={getCategoryName(product.category_id)}
          badges={{
            isNew: isProductNew(product.created_at),
            isTrending: isProductTrending(product.id),
          }}
        />
      ))}
    </div>
  );
}