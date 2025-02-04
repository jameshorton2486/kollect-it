import { Tables } from "@/integrations/supabase/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAIDescription } from "@/hooks/useAIDescription";
import { ProductFormLayout } from "./form/ProductFormLayout";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)), "Price must be a valid number"),
  category_id: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  era: z.string().optional(),
  provenance: z.string().optional(),
  estimated_age: z.string().optional(),
  image_url: z.string().optional(),
});

interface CreateProductFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<{ id: string } | undefined>;
  categories: Tables<"categories">[] | undefined;
}

export function CreateProductForm({ onSubmit, categories }: CreateProductFormProps) {
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const { generateDescription, isGenerating } = useAIDescription();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category_id: "",
      condition: "",
      era: "",
      provenance: "",
      estimated_age: "",
      image_url: "",
    },
  });

  const validateForm = () => {
    const errors: string[] = [];
    const values = form.getValues();

    if (!values.name) errors.push("Product name is required");
    if (!values.description) errors.push("Description is required");
    if (!values.price) errors.push("Price is required");
    if (!values.category_id) errors.push("Category is required");
    if (!values.condition) errors.push("Condition is required");

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submission started", values);
    
    if (!validateForm()) {
      console.log("Form validation failed", formErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting form data...");
      
      const result = await onSubmit(values);
      if (result?.id) {
        console.log("Product created successfully", result.id);
        setCreatedProductId(result.id);
        toast({
          title: "Success",
          description: "Product created successfully. You can now add images.",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIRewrite = async () => {
    const currentDescription = form.getValues("description");
    if (!currentDescription) {
      toast({
        title: "Error",
        description: "Please enter an initial description first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const enhancedDescription = await generateDescription(currentDescription);
      if (enhancedDescription) {
        form.setValue("description", enhancedDescription);
        toast({
          title: "Success",
          description: "Description has been enhanced using AI.",
        });
      }
    } catch (error) {
      console.error("AI rewrite error:", error);
      toast({
        title: "Error",
        description: "Failed to generate AI description. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <ProductFormLayout
      form={form}
      categories={categories}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      formErrors={formErrors}
      createdProductId={createdProductId}
      handleAIRewrite={handleAIRewrite}
      isGenerating={isGenerating}
    />
  );
}