import { Tables } from "@/integrations/supabase/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ProductImageUpload } from "./ProductImageUpload";
import { useState } from "react";
import { ProductBasicInfo } from "./form/ProductBasicInfo";
import { ProductCategorySelect } from "./form/ProductCategorySelect";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
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
        
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condition</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mint">Mint</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="very-good">Very Good</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="era"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Era/Period</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select era" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="victorian">Victorian (1837-1901)</SelectItem>
                  <SelectItem value="edwardian">Edwardian (1901-1910)</SelectItem>
                  <SelectItem value="art-nouveau">Art Nouveau (1890-1910)</SelectItem>
                  <SelectItem value="art-deco">Art Deco (1920-1940)</SelectItem>
                  <SelectItem value="mid-century">Mid-Century Modern (1940-1970)</SelectItem>
                  <SelectItem value="vintage">Vintage (50+ years old)</SelectItem>
                  <SelectItem value="contemporary">Contemporary</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimated_age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Age</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 'Circa 1920s' or '100+ years'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="provenance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provenance (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="History of ownership, documentation, or certificates of authenticity"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
