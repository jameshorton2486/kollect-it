import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductGallery } from "@/components/products/detail/ProductGallery";
import { ProductInfo } from "@/components/products/detail/ProductInfo";
import { ProductActions } from "@/components/products/detail/ProductActions";
import { RelatedProducts } from "@/components/products/detail/RelatedProducts";
import { Footer } from "@/components/home/Footer";
import type { ProductWithDetails } from "@/components/products/detail/types";

export default function ProductDetailPage() {
  const { id } = useParams();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(name),
          seller:profiles(first_name, last_name, avatar_url)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Product not found");

      // Handle potential error in seller data
      const processedData: ProductWithDetails = {
        ...data,
        seller: data.seller?.error 
          ? { first_name: null, last_name: null, avatar_url: null }
          : data.seller
      };

      return processedData;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !product) {
    return <div>Error loading product</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative">
            <ProductGallery defaultImage={product.image_url || ''} images={[]} />
          </div>
          <div>
            <ProductInfo 
              product={product} 
              categoryName={product.category?.name || undefined} 
            />
            <ProductActions product={product} />
          </div>
        </div>
        <RelatedProducts 
          categoryId={product.category_id} 
          currentProductId={product.id} 
        />
      </main>
      <Footer />
    </div>
  );
}