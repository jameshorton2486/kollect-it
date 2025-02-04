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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ProductBasicDetails form={form} categories={categories} />
          </div>
          <div className="space-y-6">
            <ProductAdditionalDetails form={form} />
          </div>
        </div>

        <ProductDescriptionSection 
          form={form} 
          handleAIRewrite={handleAIRewrite} 
          isGenerating={isGenerating} 
        />

        {createdProductId && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">Product Images</h3>
            <ProductImageSection productId={createdProductId} />
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