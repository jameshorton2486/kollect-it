import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { formatPrice } from "@/lib/utils";
import { ProductDetail } from "./ProductDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Sparkles, Star } from "lucide-react";
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

  const handleWishlist = () => {
    toast({
      title: "Coming soon!",
      description: "Wishlist functionality will be available soon.",
    });
  };

  const handleQuickAdd = () => {
    addItem(product.id);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <>
      <div
        className="group bg-white rounded-lg shadow-sm border border-shop-200 overflow-hidden hover:shadow-md transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {product.image_url && (
            <div className="relative aspect-square">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                {badges?.isNew && (
                  <Badge className="bg-accent text-white border-none">
                    <Star className="w-3 h-3 mr-1" /> New
                  </Badge>
                )}
                {badges?.isTrending && (
                  <Badge className="bg-secondary text-white border-none">
                    <Sparkles className="w-3 h-3 mr-1" /> Trending
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {/* Quick actions overlay */}
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
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
              onClick={handleWishlist}
            >
              <Heart className="h-4 w-4" />
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
          <p className="text-shop-600 mt-1 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-shop-900 font-bold">
              {formatPrice(product.price)}
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleQuickAdd}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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