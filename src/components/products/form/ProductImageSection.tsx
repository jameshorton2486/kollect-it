import { ProductImageUpload } from "../ProductImageUpload";
import { toast } from "@/components/ui/use-toast";

interface ProductImageSectionProps {
  productId: string;
}

export function ProductImageSection({ productId }: ProductImageSectionProps) {
  return (
    <div className="space-y-2">
      <ProductImageUpload
        productId={productId}
        maxImages={8}
        onImagesUploaded={() => {
          toast({
            title: "Success",
            description: "Images uploaded successfully",
          });
        }}
      />
    </div>
  );
}