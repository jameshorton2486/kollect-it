"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, GripVertical, Loader } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface UploadedImage {
  url: string;
  type: string;
  alt: string;
  order: number;
}

interface MultiImageUploadProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
  maxImages?: number;
  sku?: string; // For auto-renaming uploaded files
  productTitle?: string; // For auto-generating alt text
}

export function MultiImageUpload({
  onImagesUploaded,
  maxImages = 10,
  sku,
  productTitle,
}: MultiImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.url === active.id);
      const newIndex = images.findIndex((img) => img.url === over.id);
      const newImages = arrayMove(images, oldIndex, newIndex).map(
        (img, index) => ({
          ...img,
          order: index,
          type: index === 0 ? "main" : "gallery",
        })
      );
      setImages(newImages);
      onImagesUploaded(newImages);
    }
  };

  const uploadToImageKit = async (
    file: File,
    sku?: string,
    productTitle?: string,
    index?: number,
  ): Promise<UploadedImage | null> => {
    try {
      // Validate and optimize image (resize + convert to WebP if needed)
      const { validateAndOptimizeImage, generateAltText } = await import("@/lib/image-validation");
      
      let optimizedFile: File;
      try {
        optimizedFile = await validateAndOptimizeImage(file, sku);
      } catch (error) {
        console.error("Image validation/optimization failed:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to process image");
      }

      const authRes = await fetch("/api/imagekit-auth");
      if (!authRes.ok) throw new Error("Auth failed");
      const { token, expire, signature } = await authRes.json();

      // Generate alt text from product title or filename
      const altText = productTitle 
        ? generateAltText(productTitle, index || 0, index === 0)
        : optimizedFile.name.replace(/\.[^/.]+$/, "");

      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("fileName", optimizedFile.name);
      formData.append("token", token);
      formData.append("expire", String(expire));
      formData.append("signature", signature);
      formData.append(
        "publicKey",
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""
      );
      formData.append("folder", "/products");
      formData.append("useUniqueFileName", "true");
      
      // Add custom metadata for alt text
      formData.append("customMetadata", JSON.stringify({
        alt_text: altText,
      }));

      const response = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
      const data = await response.json();

      return {
        url: data.url,
        type: "gallery",
        alt: altText,
        order: 0,
      };
    } catch (error) {
      console.error("Error uploading to ImageKit:", error);
      return null;
    }
  };

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map((file, index) => 
        uploadToImageKit(file, sku, productTitle, images.length + index)
      );
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(
        (result) => result !== null
      ) as UploadedImage[];

      const newImages = [...images, ...successfulUploads].map((img, index) => ({
        ...img,
        order: index,
        type: index === 0 ? "main" : "gallery",
      }));

      setImages(newImages);
      onImagesUploaded(newImages);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error uploading images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = (index: number) => {
    const newImages = images
      .filter((_, i) => i !== index)
      .map((img, idx) => ({
        ...img,
        order: idx,
        type: idx === 0 ? "main" : "gallery",
      }));
    setImages(newImages);
    onImagesUploaded(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragOver
            ? "border-lux-gold bg-lux-gold/5"
            : "border-lux-charcoal/30 hover:border-lux-gold/50"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          aria-label="Upload images"
          title="Upload images (JPEG, PNG, WebP, AVIF - auto-converted to WebP)"
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-12 h-12 text-lux-gold animate-spin" />
            <p className="text-lux-gray">Uploading images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-lux-gray-dark" />
            <h3 className="text-lg font-medium text-lux-black">
              Drag & Drop Images Here
            </h3>
            <p className="text-lux-gray">or</p>
            <button
              type="button"
              onClick={handleBrowseClick}
              className="px-6 py-2 bg-lux-gold hover:bg-lux-gold-light text-lux-black font-medium rounded-full transition"
            >
              Browse Files
            </button>
            <p className="text-sm text-lux-gray-dark mt-2">
              Max {maxImages} images • Auto-converts to WebP • Max 2000px width
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid with Drag-to-Reorder */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-lux-black">
              Uploaded Images ({images.length}/{maxImages})
            </h4>
            <p className="text-sm text-lux-gray">
              Drag to reorder • First image is main
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((img) => img.url)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <SortableImage
                    key={image.url}
                    image={image}
                    index={index}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}

interface SortableImageProps {
  image: UploadedImage;
  index: number;
  onDelete: (index: number) => void;
}

function SortableImage({ image, index, onDelete }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.url,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-lg overflow-hidden border border-lux-charcoal/20 ${
        isDragging ? "opacity-50 z-50" : "opacity-100"
      }`}
    >
      <div
        className="aspect-square relative cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <Image
          src={image.url}
          alt={image.alt || `Product image ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
        />
        {index === 0 && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-lux-gold text-lux-black text-xs font-medium rounded">
            Main
          </span>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <GripVertical className="w-6 h-6 text-white" />
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
        className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete image"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default MultiImageUpload;
