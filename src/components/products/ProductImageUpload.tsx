import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Image as ImageIcon, Loader2, Camera } from "lucide-react";
import { removeBackground } from "@/lib/imageProcessing";

interface ProductImageUploadProps {
  productId: string;
  maxImages?: number;
  onImagesUploaded: () => void;
}

export function ProductImageUpload({ productId, maxImages = 10, onImagesUploaded }: ProductImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; id: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = async (file: File): Promise<File> => {
    try {
      setIsProcessing(true);
      
      // Create an image element from the file
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => (img.onload = resolve));

      // Create a canvas for resizing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Set fixed dimensions
      const targetSize = 500;
      canvas.width = targetSize;
      canvas.height = targetSize;

      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetSize, targetSize);

      // Calculate dimensions maintaining aspect ratio
      let drawWidth = targetSize;
      let drawHeight = targetSize;
      const aspectRatio = img.width / img.height;

      if (aspectRatio > 1) {
        drawHeight = targetSize / aspectRatio;
      } else {
        drawWidth = targetSize * aspectRatio;
      }

      // Center the image
      const x = (targetSize - drawWidth) / 2;
      const y = (targetSize - drawHeight) / 2;

      // Draw the image
      ctx.drawImage(img, x, y, drawWidth, drawHeight);

      // Remove background if possible
      try {
        const processedBlob = await removeBackground(img);
        const processedFile = new File([processedBlob], file.name, { type: 'image/png' });
        return processedFile;
      } catch (error) {
        console.error('Background removal failed, using original image:', error);
        // If background removal fails, continue with the resized image
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/png' }));
            }
          }, 'image/png');
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

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
        
        // Process the image
        const processedFile = await processImage(file);
        
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: maxImages,
  });

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
      <div className="flex gap-4 mb-4">
        <div
          {...getRootProps()}
          className={`flex-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
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
            {(isUploading || isProcessing) && (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm text-gray-500">
                  {isProcessing ? "Processing images..." : "Uploading..."}
                </p>
              </div>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleCameraCapture}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Take Photo
        </Button>
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
                  <div key={image.id} className="relative aspect-square bg-white">
                    <img
                      src={image.url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-contain rounded-md"
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