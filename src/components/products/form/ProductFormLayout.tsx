import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductDescriptionSection } from "./ProductDescriptionSection";
import { ProductAdditionalDetails } from "./ProductAdditionalDetails";
import { ProductImageSection } from "./ProductImageSection";
import { UseFormReturn } from "react-hook-form";

interface ProductFormLayoutProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<any>;
  isSubmitting: boolean;
  createdProductId: string | null;
  handleAIRewrite: () => Promise<void>;
  isGenerating: boolean;
  onImagesUploaded: () => void;
}

export function ProductFormLayout({
  form,
  onSubmit,
  isSubmitting,
  createdProductId,
  handleAIRewrite,
  isGenerating,
  onImagesUploaded,
}: ProductFormLayoutProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <ProductBasicInfo form={form} />
          <ProductDescriptionSection
            form={form}
            handleAIRewrite={handleAIRewrite}
            isGenerating={isGenerating}
          />
          <ProductAdditionalDetails form={form} />

          {createdProductId && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Product Images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload up to 8 images. The first image will be used as the main product image.
              </p>
              <ProductImageSection 
                productId={createdProductId} 
                onImagesUploaded={onImagesUploaded}
              />
            </div>
          )}
        </div>

        {!createdProductId && (
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </DialogFooter>
        )}
      </form>
    </Form>
  );
}