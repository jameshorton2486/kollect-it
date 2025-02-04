import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductInfo } from "@/components/products/detail/ProductInfo";
import { ProductGallery } from "@/components/products/detail/ProductGallery";
import { ProductActions } from "@/components/products/detail/ProductActions";
import { RelatedProducts } from "@/components/products/detail/RelatedProducts";
import { Footer } from "@/components/home/Footer";
import { Tables } from "@/integrations/supabase/types";

interface ProductWithDetails extends Tables<"products"> {
  category?: {
    name: string | null;
  } | null;
  seller?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

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

      return data as ProductWithDetails;
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