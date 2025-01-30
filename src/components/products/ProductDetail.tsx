import { useState, useEffect } from "react";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";

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
    }
  }, [isOpen, product.id, product.image_url]);

  const handleAddToCart = async () => {
    await addItem(product.id, quantity);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={selectedImage || product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image.image_url)}
                  className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2
                    ${selectedImage === image.image_url ? 'border-primary' : 'border-transparent'}`}
                >
                  <img
                    src={image.image_url}
                    alt={`${product.name} - Image ${image.display_order}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-shop-800">{product.name}</h2>
              {categoryName && (
                <span className="text-shop-500 text-sm">{categoryName}</span>
              )}
            </div>
            <p className="text-shop-600">{product.description}</p>
            <div className="space-y-4">
              <p className="text-xl font-semibold text-shop-700">
                {formatPrice(product.price)}
              </p>
              {product.condition && (
                <p className="text-shop-600">
                  <span className="font-medium">Condition:</span> {product.condition}
                </p>
              )}
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20"
                />
                <Button onClick={handleAddToCart}>Add to Cart</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}