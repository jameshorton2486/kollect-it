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
import { toast } from "@/components/ui/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import { useAIDescription } from "@/hooks/useAIDescription";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const result = await onSubmit(values);
      if (result?.id) {
        setCreatedProductId(result.id);
        toast({
          title: "Success",
          description: "Product created successfully. You can now add images.",
        });
      }
    } catch (error) {
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
      toast({
        title: "Error",
        description: "Failed to generate AI description. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-4">
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
          </div>

          {/* Right Column - Additional Details */}
          <div className="space-y-4">
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
          </div>
        </div>

        {/* Full Width Description Section */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Description</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAIRewrite}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4 mr-2" />
                    )}
                    Enhance with AI
                  </Button>
                </div>
                <FormControl>
                  <Textarea 
                    placeholder="Detailed description of the item"
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {createdProductId && (
          <div className="space-y-2">
            <ProductImageUpload
              productId={createdProductId}
              maxImages={10}
              onImagesUploaded={() => {
                toast({
                  title: "Success",
                  description: "Images uploaded successfully",
                });
              }}
            />
          </div>
        )}

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}