import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { ProductFormLayout } from "./form/ProductFormLayout";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useAIDescription } from "@/hooks/useAIDescription";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  condition: z.string().min(1, "Condition is required"),
  category_id: z.string().min(1, "Category is required"),
  era: z.string().optional(),
  estimated_age: z.string().optional(),
  provenance: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function CreateProductForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateDescription } = useAIDescription();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      condition: "",
      category_id: "",
      era: "",
      estimated_age: "",
      provenance: "",
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to create a product",
          variant: "destructive",
        });
        return { id: "" };
      }

      const { data: result, error } = await supabase
        .from("products")
        .insert({
          ...data,
          price: parseFloat(data.price),
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (result) {
        setCreatedProductId(result.id);
        toast({
          title: "Success",
          description: "Product created successfully. You can now add images.",
        });
        return result;
      }
      return { id: "" };
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
      return { id: "" };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIRewrite = async () => {
    setIsGenerating(true);
    try {
      const currentDescription = form.getValues("description");
      const enhancedDescription = await generateDescription(currentDescription);
      
      if (enhancedDescription) {
        form.setValue("description", enhancedDescription);
        toast({
          title: "Success",
          description: "Description enhanced successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to enhance description",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("AI rewrite error:", error);
      toast({
        title: "Error",
        description: "Failed to enhance description",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImagesUploaded = () => {
    toast({
      title: "Success",
      description: "Images uploaded successfully.",
    });
  };

  return (
    <ProductFormLayout
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      createdProductId={createdProductId}
      handleAIRewrite={handleAIRewrite}
      isGenerating={isGenerating}
      onImagesUploaded={handleImagesUploaded}
    />
  );
}