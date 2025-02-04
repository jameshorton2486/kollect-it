import { useParams } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { ArticleDetail } from "@/components/articles/ArticleDetail";
import { ProductDetail } from "@/components/products/ProductDetail";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function ProductDetailPage() {
  const { id } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data: product, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(name),
          seller:profiles(first_name, last_name, avatar_url)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return product;
    },
  });

  const { data: categoryName } = useQuery({
    queryKey: ["category", product?.category_id],
    enabled: !!product?.category_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("name")
        .eq("id", product?.category_id)
        .single();

      if (error) throw error;
      return data?.name;
    },
  });

  if (isLoading) {
    return (
      <PageLayout>
        <div className="animate-pulse">Loading...</div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div>Product not found</div>
      </PageLayout>
    );
  }

  const breadcrumbs = [
    { label: "Products", href: "/products" },
    { label: categoryName || "Category", href: `/categories/${product.category_id}` },
    { label: product.name },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs} showBackButton>
      <ProductDetail 
        product={product} 
        isOpen={true} 
        onClose={() => {}} 
        categoryName={categoryName} 
      />
    </PageLayout>
  );
}