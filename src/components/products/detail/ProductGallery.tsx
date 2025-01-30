import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface ProductGalleryProps {
  images: ProductImage[];
  defaultImage: string;
}

export function ProductGallery({ images, defaultImage }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = [...images, { id: 'main', image_url: defaultImage, display_order: -1 }];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    setSelectedImage(allImages[(currentImageIndex + 1) % allImages.length].image_url);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setSelectedImage(allImages[(currentImageIndex - 1 + allImages.length) % allImages.length].image_url);
  };

  return (
    <div className="relative">
      <div className="aspect-square">
        <img
          src={selectedImage || defaultImage}
          alt="Product"
          className="w-full h-full object-cover"
        />
      </div>
      {allImages.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
        {allImages.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentImageIndex === index ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 mt-4">
        {allImages.map((image, index) => (
          <button
            key={image.id}
            onClick={() => {
              setSelectedImage(image.image_url);
              setCurrentImageIndex(index);
            }}
            className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors
              ${selectedImage === image.image_url ? 'border-primary' : 'border-transparent'}`}
          >
            <img
              src={image.image_url}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}