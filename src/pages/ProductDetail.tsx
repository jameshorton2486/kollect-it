
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductDetail } from "@/components/products/ProductDetail";
import { Loader } from "@/components/ui/loader";
import { NotFound } from "@/components/ui/not-found";
import type { Tables } from "@/integrations/supabase/types";
import type { ProductWithDetails } from "@/components/products/detail/types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category:category_id (
              name
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <NotFound message={error} />;
  if (!product) return <NotFound message="Product not found" />;

  return (
    <div>
      <ProductDetail 
        product={product} 
        isOpen={true} 
        onClose={() => {}} 
        categoryName={product.category?.name || undefined}
      />
    </div>
  );
}
