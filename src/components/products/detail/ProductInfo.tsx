import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatPrice } from "@/lib/utils";

interface ProductInfoProps {
  product: Tables<"products">;
  categoryName?: string;
}

export function ProductInfo({ product, categoryName }: ProductInfoProps) {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to share this product.",
        variant: "destructive",
      });
    }
  };

  const handleWishlist = () => {
    toast({
      title: "Coming soon",
      description: "Wishlist functionality will be available soon!",
    });
  };

  const getConditionDescription = (condition: string) => {
    const descriptions = {
      new: "Never used, original packaging",
      "like-new": "Minimal wear, excellent condition",
      excellent: "Minor wear, no significant flaws",
      good: "Normal wear, all pieces intact",
      fair: "Visible wear, may need minor repairs",
    };
    return descriptions[condition as keyof typeof descriptions] || condition;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-semibold text-shop-800">{product.name}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleWishlist}>
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categoryName && (
          <Badge variant="secondary" className="text-sm">
            {categoryName}
          </Badge>
        )}
        {product.era && (
          <Badge variant="outline" className="text-sm">
            {product.era} Era
          </Badge>
        )}
      </div>

      <div className="text-2xl font-bold text-shop-900">
        {formatPrice(product.price)}
      </div>

      <p className="text-shop-600 leading-relaxed">{product.description}</p>

      <div className="grid grid-cols-2 gap-4 pt-4">
        {product.condition && (
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-shop-700">Condition</span>
              <HoverCard>
                <HoverCardTrigger>
                  <Info className="h-4 w-4 text-shop-400" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <p className="text-sm">{getConditionDescription(product.condition)}</p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <p className="text-shop-800 capitalize">{product.condition}</p>
          </div>
        )}
        
        {product.estimated_age && (
          <div className="space-y-1">
            <span className="text-sm font-medium text-shop-700">Estimated Age</span>
            <p className="text-shop-800">{product.estimated_age}</p>
          </div>
        )}
      </div>

      {product.provenance && (
        <div className="pt-2">
          <span className="text-sm font-medium text-shop-700">Provenance</span>
          <p className="text-shop-800 mt-1">{product.provenance}</p>
        </div>
      )}
    </div>
  );
}