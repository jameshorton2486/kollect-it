import { Tables } from "@/integrations/supabase/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Tables<"products">;
  categoryName?: string;
}

export function ProductCard({ product, categoryName }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-shop-200 overflow-hidden hover:shadow-md transition-all duration-300">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-shop-800 mb-2">
          {product.name}
        </h3>
        <p className="text-shop-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-shop-700 font-semibold">
            {formatPrice(product.price)}
          </span>
          {categoryName && (
            <span className="text-shop-500 text-sm">{categoryName}</span>
          )}
        </div>
      </div>
    </div>
  );
}