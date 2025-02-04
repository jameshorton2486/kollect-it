import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/product/Product";
import { Loader } from "@/components/ui/loader";
import { NotFound } from "@/components/ui/not-found";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <NotFound message={error} />;

  const { data: seller } = await supabase
    .from('profiles')
    .select('first_name, last_name, avatar_url')
    .eq('id', product.user_id)
    .maybeSingle();

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
