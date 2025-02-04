import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";

export interface ProductGalleryProps {
  images: { id: string; image_url: string; display_order: number; }[];
  defaultImage: string;
}

export function ProductGallery({ images, defaultImage }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(defaultImage);

  return (
    <div className="space-y-4">
      <div className="aspect-square w-full overflow-hidden rounded-lg">
        <img
          src={selectedImage}
          alt="Product"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image.image_url)}
            className={`aspect-square w-full overflow-hidden rounded-lg border-2 ${
              selectedImage === image.image_url ? 'border-primary' : 'border-transparent'
            }`}
          >
            <img
              src={image.image_url}
              alt="Product thumbnail"
              className="h-full w-full object-cover object-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
}