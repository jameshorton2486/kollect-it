import { ImageIcon, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface ImagePreviewGridProps {
  images: { url: string; id: string }[];
}

export function ImagePreviewGrid({ images }: ImagePreviewGridProps) {
  if (images.length === 0) return null;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="images" className="border rounded-lg overflow-hidden">
        <AccordionTrigger className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50">
          <ImageIcon className="h-4 w-4" />
          <span>View Uploaded Images ({images.length})</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white">
            {images.map((image, index) => (
              <div key={image.id} className="relative group aspect-square bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-contain rounded-md"
                />
                {index === 0 && (
                  <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-xs font-medium">
                    Main Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="destructive" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}