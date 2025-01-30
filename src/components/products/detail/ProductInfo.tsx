import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";

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

  return (
    <div className="space-y-2">
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
      {categoryName && (
        <Badge variant="secondary" className="text-sm">
          {categoryName}
        </Badge>
      )}
      <p className="text-shop-600 leading-relaxed">{product.description}</p>
    </div>
  );
}