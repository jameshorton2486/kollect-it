import { ProductImageUpload } from "../ProductImageUpload";

interface ProductImageSectionProps {
  productId: string;
  onImagesUploaded: () => void;
}

export function ProductImageSection({ productId, onImagesUploaded }: ProductImageSectionProps) {
  return (
    <div className="space-y-2">
      <ProductImageUpload
        productId={productId}
        maxImages={8}
        onImagesUploaded={onImagesUploaded}
      />
    </div>
  );
}