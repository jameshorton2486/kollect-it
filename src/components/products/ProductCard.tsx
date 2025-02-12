
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { formatPrice } from "@/lib/utils";
import { ProductDetail } from "./ProductDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Clock, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Tables<"products">;
  categoryName?: string;
  badges?: {
    isNew?: boolean;
    isTrending?: boolean;
  };
}

export function ProductCard({ product, categoryName, badges }: ProductCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { addItem } = useCart();

  const handleQuickAdd = () => {
    addItem(product.id);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const getConditionColor = (condition: string | null) => {
    const colors: Record<string, string> = {
      mint: "bg-emerald-500",
      excellent: "bg-green-500",
      "very-good": "bg-blue-500",
      good: "bg-yellow-500",
      fair: "bg-orange-500",
      poor: "bg-red-500",
    };
    return colors[condition?.toLowerCase() ?? ""] || "bg-gray-500";
  };

  return (
    <>
      <div
        className="group bg-white rounded-lg shadow-sm border border-shop-200 overflow-hidden hover:shadow-md transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="article"
        aria-label={`${product.name} - ${categoryName || 'Uncategorized'}`}
      >
        <div className="relative">
          {product.image_url && (
            <div className="relative aspect-square">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                {product.condition && (
                  <Badge className={`${getConditionColor(product.condition)} text-white border-none`}>
                    {product.condition}
                  </Badge>
                )}
                {product.era && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {product.era}
                  </Badge>
                )}
                {badges?.isTrending && (
                  <Badge className="bg-shop-accent1 text-white border-none flex items-center gap-1">
                    <Award className="w-3 h-3" aria-hidden="true" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          <div 
            className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
              onClick={() => setIsDetailOpen(true)}
              aria-label={`View details for ${product.name}`}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          {categoryName && (
            <span className="text-shop-500 text-sm">{categoryName}</span>
          )}
          <h3 className="text-lg font-semibold text-shop-800 mt-1 line-clamp-1">
            {product.name}
          </h3>
          {product.estimated_age && (
            <p className="text-shop-600 text-sm mt-1">
              Age: {product.estimated_age}
            </p>
          )}
          <p className="text-shop-600 mt-1 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-shop-900 font-bold">
              {formatPrice(product.price)}
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleQuickAdd}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-h-[2.5rem]"
              aria-label={`Quick add ${product.name} to cart`}
            >
              Quick Add
            </Button>
          </div>
        </div>
      </div>

      <ProductDetail
        product={product}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        categoryName={categoryName}
      />
    </>
  );
}
