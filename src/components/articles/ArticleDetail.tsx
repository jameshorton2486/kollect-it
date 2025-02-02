import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Articles
      </Button>

      {article.image_url && (
        <div className="relative h-[400px] mb-8 rounded-lg overflow-hidden">
          <img
            src={article.image_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      
      <time className="text-shop-500 block mb-8">
        {format(new Date(article.created_at), "MMMM d, yyyy")}
      </time>

      <div className="prose prose-lg max-w-none">
        {article.content}
      </div>
    </article>
  );
}