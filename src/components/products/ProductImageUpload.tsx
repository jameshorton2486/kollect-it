import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Image as ImageIcon, Loader2 } from "lucide-react";

interface ProductImageUploadProps {
  productId: string;
  maxImages?: number;
  onImagesUploaded: () => void;
}

export function ProductImageUpload({ productId, maxImages = 10, onImagesUploaded }: ProductImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; id: string }[]>([]);

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
        const fileExt = file.name.split('.').pop();
        const filePath = `${productId}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

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
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [productId, maxImages, onImagesUploaded, uploadedImages.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: maxImages,
  });

  return (
    <div className="space-y-4">
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
              <p>Drag & drop up to {maxImages} images here, or click to select files</p>
            )}
          </div>
          {isUploading && (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          )}
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="images">
            <AccordionTrigger className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span>View Uploaded Images ({uploadedImages.length})</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {uploadedImages.map((image, index) => (
                  <div key={image.id} className="relative aspect-square">
                    <img
                      src={image.url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-xs">
                        Main Image
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}