import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductDetail as Product } from "@/components/products/ProductDetail";
import { Loader } from "@/components/ui/loader";
import { NotFound } from "@/components/ui/not-found";
import type { Tables } from "@/integrations/supabase/types";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Tables<"products"> | null>(null);
  const [seller, setSeller] = useState<{
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductAndSeller = async () => {
      try {
        // Fetch product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;
        setProduct(productData);

        // Fetch seller data
        if (productData?.user_id) {
          const { data: sellerData } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url')
            .eq('id', productData.user_id)
            .maybeSingle();

          setSeller(sellerData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndSeller();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <NotFound message={error} />;
  if (!product) return <NotFound message="Product not found" />;

  const sellerData = seller || {
    first_name: '',
    last_name: '',
    avatar_url: null
  };

  return (
    <div>
      <Product product={product} seller={sellerData} />
    </div>
  );
}