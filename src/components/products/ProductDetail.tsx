import { useState, useEffect } from "react";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductGallery } from "./detail/ProductGallery";
import { ProductInfo } from "./detail/ProductInfo";
import { ProductActions } from "./detail/ProductActions";
import { RelatedProducts } from "./detail/RelatedProducts";

interface ProductDetailProps {
  product: Tables<"products"> & {
    category?: {
      name: string | null;
    } | null;
    seller?: {
      first_name: string | null;
      last_name: string | null;
      avatar_url: string | null;
    } | null;
  };
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
}

export function ProductDetail({ product, isOpen, onClose, categoryName }: ProductDetailProps) {
  const [images, setImages] = useState<{ id: string; image_url: string; display_order: number; }[]>([]);
  
  // Process seller data to handle potential errors
  const processedProduct = {
    ...product,
    seller: product.seller?.error 
      ? { first_name: null, last_name: null, avatar_url: null }
      : product.seller
  };

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

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <ProductGallery images={images} defaultImage={product.image_url || ''} />
      <div className="space-y-6">
        <ProductInfo product={processedProduct} categoryName={categoryName} />
        <ProductActions product={product} />
      </div>
      <div className="col-span-1 md:col-span-2 border-t border-gray-200 pt-6">
        <RelatedProducts currentProductId={product.id} categoryId={product.category_id} />
      </div>
    </div>
  );

  if (onClose) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return <div className="max-w-7xl mx-auto">{content}</div>;
}