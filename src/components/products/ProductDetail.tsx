import { useState, useEffect } from "react";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductGallery } from "./detail/ProductGallery";
import { ProductInfo } from "./detail/ProductInfo";
import { ProductActions } from "./detail/ProductActions";

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

  useEffect(() => {
    async function loadImages() {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', product.id)
        .order('display_order');

      if (!error && data) {
        setImages(data);
      }
    }

    if (isOpen) {
      loadImages();
    }
  }, [isOpen, product.id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <ProductGallery images={images} defaultImage={product.image_url || ''} />
          <div className="p-6 space-y-6">
            <ProductInfo product={product} categoryName={categoryName} />
            <ProductActions product={product} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}