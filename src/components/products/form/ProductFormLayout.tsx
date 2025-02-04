import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ProductBasicDetails } from "./ProductBasicDetails";
import { ProductAdditionalDetails } from "./ProductAdditionalDetails";
import { ProductDescriptionSection } from "./ProductDescriptionSection";
import { ProductImageSection } from "./ProductImageSection";
import { Tables } from "@/integrations/supabase/types";

interface ProductFormLayoutProps {
  form: UseFormReturn<any>;
  categories: Tables<"categories">[] | undefined;
  onSubmit: (values: any) => Promise<{ id: string } | undefined>;
  isSubmitting: boolean;
  formErrors: string[];
  createdProductId: string | null;
  handleAIRewrite: () => Promise<void>;
  isGenerating: boolean;
}

export function ProductFormLayout({
  form,
  categories,
  onSubmit,
  isSubmitting,
  formErrors,
  createdProductId,
  handleAIRewrite,
  isGenerating,
}: ProductFormLayoutProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {formErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Validation Error</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4">
                {formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Basic Details Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Basic Details</h3>
            <ProductBasicDetails form={form} categories={categories} />
          </div>

          {/* Additional Details Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Additional Details</h3>
            <ProductAdditionalDetails form={form} />
          </div>

          {/* Description Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Description</h3>
            <ProductDescriptionSection 
              form={form} 
              handleAIRewrite={handleAIRewrite} 
              isGenerating={isGenerating} 
            />
          </div>

          {/* Image Upload Section - Only shown after product creation */}
          {createdProductId && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Product Images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload up to 10 images. The first image will be used as the main product image.
              </p>
              <ProductImageSection productId={createdProductId} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}