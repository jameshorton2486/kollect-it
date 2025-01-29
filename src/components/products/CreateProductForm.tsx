import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { DialogFooter } from "@/components/ui/dialog";
import { ProductImageUpload } from "./ProductImageUpload";
import { useState } from "react";
import { ProductBasicInfo } from "./form/ProductBasicInfo";
import { ProductCategorySelect } from "./form/ProductCategorySelect";
import { ProductConditionInput } from "./form/ProductConditionInput";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  category_id: z.string().min(1, "Category is required"),
  condition: z.string().optional(),
  image_url: z.string().optional(),
});

interface CreateProductFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<{ id: string } | undefined>;
  categories: Tables<"categories">[] | undefined;
}

export function CreateProductForm({ onSubmit, categories }: CreateProductFormProps) {
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category_id: "",
      condition: "",
      image_url: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await onSubmit(values);
    if (result?.id) {
      setCreatedProductId(result.id);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <ProductBasicInfo form={form} />
        <ProductCategorySelect form={form} categories={categories} />
        <ProductConditionInput form={form} />

        {createdProductId && (
          <div className="space-y-2">
            <ProductImageUpload
              productId={createdProductId}
              onImagesUploaded={() => {
                // Handle successful upload
              }}
            />
          </div>
        )}

        <DialogFooter>
          <Button type="submit">Create Product</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
