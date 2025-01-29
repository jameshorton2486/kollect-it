import { Tables } from "@/integrations/supabase/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Tables<"products">[];
  categories: Tables<"categories">[] | undefined;
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return undefined;
    return categories?.find((c) => c.id === categoryId)?.name;
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
        />
      ))}
    </div>
  );
}