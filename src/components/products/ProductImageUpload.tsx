import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ProductImageUploadProps {
  productId: string;
  onImagesUploaded: () => void;
}

export function ProductImageUpload({ productId, onImagesUploaded }: ProductImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 4) {
      toast({
        title: "Too many files",
        description: "You can only upload up to 4 images per product.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${productId}/${crypto.randomUUID()}.${fileExt}`;

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        // Save image reference to database
        const { error: dbError } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: publicUrl,
            display_order: i + 1,
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
      onImagesUploaded();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [productId, onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 4,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drag & drop up to 4 images here, or click to select files</p>
          )}
        </div>
        {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
      </div>
    </div>
  );
}