import { useState, useEffect } from "react";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Heart, Share2, ShoppingCart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ProductDetailProps {
  product: Tables<"products">;
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
}

interface ProductImage {
  id: string;
  image_url: string;
  display_order: number;
}

export function ProductDetail({ product, isOpen, onClose, categoryName }: ProductDetailProps) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    async function loadImages() {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', product.id)
        .order('display_order');

      if (!error && data) {
        setImages(data);
        setSelectedImage(data[0]?.image_url || product.image_url);
      }
    }

    if (isOpen) {
      loadImages();
      setQuantity(1);
      setCurrentImageIndex(0);
    }
  }, [isOpen, product.id, product.image_url]);

  const handleAddToCart = async () => {
    try {
      await addItem(product.id, quantity);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  const nextImage = () => {
    const allImages = [...(images || []), { id: 'main', image_url: product.image_url, display_order: -1 }];
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    setSelectedImage(allImages[(currentImageIndex + 1) % allImages.length].image_url);
  };

  const prevImage = () => {
    const allImages = [...(images || []), { id: 'main', image_url: product.image_url, display_order: -1 }];
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setSelectedImage(allImages[(currentImageIndex - 1 + allImages.length) % allImages.length].image_url);
  };

  const allImages = [...images, { id: 'main', image_url: product.image_url, display_order: -1 }];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative">
            <div className="aspect-square">
              <img
                src={selectedImage || product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              {allImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentImageIndex === index ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="p-6 space-y-6">
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
            </div>

            <p className="text-shop-600 leading-relaxed">{product.description}</p>

            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-shop-700">
                  {formatPrice(product.price)}
                </span>
              </div>

              {product.condition && (
                <div className="flex items-center gap-2">
                  <span className="text-shop-600 font-medium">Condition:</span>
                  <Badge variant="outline">{product.condition}</Badge>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20"
                  />
                </div>
                <Button onClick={handleAddToCart} className="flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => {
                    setSelectedImage(image.image_url);
                    setCurrentImageIndex(index);
                  }}
                  className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors
                    ${selectedImage === image.image_url ? 'border-primary' : 'border-transparent'}`}
                >
                  <img
                    src={image.image_url}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}