import { useCallback, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploadArea } from "./upload/ImageUploadArea";
import { ImagePreviewGrid } from "./upload/ImagePreviewGrid";
import { processImage } from "./upload/imageProcessing";

interface ProductImageUploadProps {
  productId: string;
  maxImages?: number;
  onImagesUploaded: () => void;
}

export function ProductImageUpload({ productId, maxImages = 10, onImagesUploaded }: ProductImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; id: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (uploadedImages.length + acceptedFiles.length > maxImages) {
      toast({
        title: "Too many files",
        description: `You can only upload up to ${maxImages} images per product.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const newImages = [];
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        
        setIsProcessing(true);
        const processedFile = await processImage(file);
        setIsProcessing(false);
        
        const fileExt = file.name.split('.').pop();
        const filePath = `${productId}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, processedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        const { data, error: dbError } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: publicUrl,
            display_order: uploadedImages.length + i + 1,
          })
          .select()
          .single();

        if (dbError) throw dbError;

        newImages.push({ url: publicUrl, id: data.id });
      }

      setUploadedImages(prev => [...prev, ...newImages]);
      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
      onImagesUploaded();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [productId, maxImages, onImagesUploaded, uploadedImages.length]);

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await onDrop([file]);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      <ImageUploadArea
        onDrop={onDrop}
        isUploading={isUploading}
        isProcessing={isProcessing}
        maxImages={maxImages}
        onCameraCapture={handleCameraCapture}
      />
      <ImagePreviewGrid images={uploadedImages} />
    </div>
  );
}