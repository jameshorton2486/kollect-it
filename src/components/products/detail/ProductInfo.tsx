import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Facebook, Twitter, Instagram, Link as LinkIcon, Info } from "lucide-react";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

const getConditionDescription = (condition: string): string => {
  const descriptions: Record<string, string> = {
    mint: "Item is in perfect, like-new condition",
    excellent: "Item shows minimal signs of wear",
    "very-good": "Item shows light wear but maintains overall good condition",
    good: "Item shows normal signs of use",
    fair: "Item shows significant wear but remains functional",
    poor: "Item shows heavy wear and may need restoration",
  };
  return descriptions[condition.toLowerCase()] || "Condition description not available";
};

interface ProductInfoProps {
  product: Tables<"products">;
  categoryName?: string;
}

export function ProductInfo({ product, categoryName }: ProductInfoProps) {
  useEffect(() => {
    // Update metadata when component mounts
    if (product.seo_title || product.seo_description) {
      document.title = product.seo_title || product.name;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", product.seo_description || product.description || "");
      }
    }
  }, [product]);

  const handleShare = async (platform: string) => {
    try {
      const shareUrl = window.location.href;
      let shareLink = "";

      switch (platform) {
        case "facebook":
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          break;
        case "twitter":
          shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(product.name)}`;
          break;
        case "instagram":
          // Instagram sharing is typically done through their app/stories
          toast({
            title: "Instagram Sharing",
            description: "Please use the Instagram app to share this product.",
          });
          return;
        case "copy":
          await navigator.clipboard.writeText(shareUrl);
          toast({
            title: "Link Copied",
            description: "Product link has been copied to clipboard!",
          });
          return;
      }

      // Log the share
      await supabase.from("social_shares").insert({
        product_id: product.id,
        platform,
        shared_by: (await supabase.auth.getUser()).data.user?.id,
      });

      // Open share dialog
      if (shareLink) {
        window.open(shareLink, "_blank", "width=600,height=400");
      }

      toast({
        title: "Shared Successfully",
        description: `Product has been shared on ${platform}!`,
      });
    } catch (error) {
      console.error("Share error:", error);
      toast({
        title: "Share Failed",
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
    <div className="space-y-4">
      <Helmet>
        <title>{product.seo_title || product.name}</title>
        <meta name="description" content={product.seo_description || product.description || ""} />
        {product.seo_keywords && (
          <meta name="keywords" content={product.seo_keywords.join(", ")} />
        )}
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description || ""} />
        {product.image_url && <meta property="og:image" content={product.image_url} />}
      </Helmet>

      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-semibold text-shop-800">{product.name}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleWishlist}>
            <Heart className="h-5 w-5" />
          </Button>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => handleShare("facebook")}>
              <Facebook className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleShare("twitter")}>
              <Twitter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleShare("instagram")}>
              <Instagram className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleShare("copy")}>
              <LinkIcon className="h-5 w-5" />
            </Button>
          </div>
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
