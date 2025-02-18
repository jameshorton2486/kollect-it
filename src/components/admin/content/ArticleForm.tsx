
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ArticleFormProps {
  editingId: string | null;
  onSuccess: () => void;
  initialTitle?: string;
  initialContent?: string;
}

export function ArticleForm({ editingId, onSuccess, initialTitle = "", initialContent = "" }: ArticleFormProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      if (editingId) {
        const { error } = await supabase
          .from("articles")
          .update({ 
            title: title.trim(), 
            content: content.trim(),
            updated_at: new Date().toISOString()
          })
          .eq("id", editingId);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Article updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("articles")
          .insert([{ 
            title: title.trim(), 
            content: content.trim(),
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Article created successfully",
        });
      }

      setTitle("");
      setContent("");
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save article",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Article Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={isSubmitting}
        className="disabled:opacity-70"
      />
      <Textarea
        placeholder="Article Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        disabled={isSubmitting}
        className="min-h-[200px] disabled:opacity-70"
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Please wait..." : editingId ? "Update Article" : "Create Article"}
      </Button>
    </form>
  );
}
