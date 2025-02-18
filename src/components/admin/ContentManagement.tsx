
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ArticleForm } from "./content/ArticleForm";
import { ArticleCard } from "./content/ArticleCard";
import { ArticleLoadingSkeleton } from "./content/ArticleLoadingSkeleton";

export function ContentManagement() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: articles, refetch, isLoading, error } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    throw error;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <ArticleForm
          editingId={editingId}
          onSuccess={() => {
            setEditingId(null);
            refetch();
          }}
          initialTitle={articles?.find(a => a.id === editingId)?.title}
          initialContent={articles?.find(a => a.id === editingId)?.content}
        />

        <div className="grid gap-4">
          {isLoading ? (
            <ArticleLoadingSkeleton />
          ) : (
            articles?.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                content={article.content}
                onEdit={() => {
                  setEditingId(article.id);
                }}
                onDelete={() => handleDelete(article.id)}
                isSubmitting={isSubmitting}
              />
            ))
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
