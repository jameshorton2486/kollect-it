"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader } from "lucide-react";
import { parseImageMetadata } from "@/lib/utils/image-parser";

interface ImageMetadata {
  file: File;
  preview: string;
  url?: string; // ImageKit URL after upload
  type: string;
  alt: string;
  order: number;
  uploading: boolean;
  error?: string;
}

interface MultiImageUploadProps {
  onImagesUploaded: (images: Array<{ url: string; type: string; alt: string; order: number }>) => void;
  maxImages?: number;
}

export function MultiImageUpload({ onImagesUploaded, maxImages = 30 }: MultiImageUploadProps) {
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: ImageMetadata[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        continue;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is larger than 10MB`);
        continue;
      }

      // Parse metadata from filename
      const metadata = parseImageMetadata(file.name);

      newImages.push({
        file,
        preview: URL.createObjectURL(file),
        type: metadata.type,
        alt: metadata.suggestedAlt,
        order: metadata.order,
        uploading: false,
      });
    }

    setImages((prev) => {
      const combined = [...prev, ...newImages];
      
      // Limit to maxImages
      if (combined.length > maxImages) {
        alert(`Maximum ${maxImages} images allowed`);
        return combined.slice(0, maxImages);
      }
      
      // Sort by order
      return combined.sort((a, b) => a.order - b.order);
    });
  }, [maxImages]);

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const uploadToImageKit = async (file: File): Promise<string> => {
    // Get auth from your existing ImageKit auth endpoint
    const authRes = await fetch("/api/imagekit-auth");
    if (!authRes.ok) throw new Error("Failed to get ImageKit auth");
    const auth = await authRes.json();

    // Upload to ImageKit
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("fileName", file.name);
    uploadForm.append("publicKey", auth.publicKey);
    uploadForm.append("token", auth.token);
    uploadForm.append("expire", auth.expire.toString());
    uploadForm.append("signature", auth.signature);

    const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: uploadForm,
    });

    if (!uploadRes.ok) throw new Error("ImageKit upload failed");
    const data = await uploadRes.json();
    return data.url;
  };

  const handleUploadAll = async () => {
    setUploading(true);

    const uploadPromises = images.map(async (img, index) => {
      if (img.url) return img; // Already uploaded

      try {
        // Update UI to show uploading
        setImages((prev) => {
          const updated = [...prev];
          updated[index].uploading = true;
          return updated;
        });

        const url = await uploadToImageKit(img.file);

        // Update with URL
        setImages((prev) => {
          const updated = [...prev];
          updated[index].url = url;
          updated[index].uploading = false;
          return updated;
        });

        return { ...img, url };
      } catch (error) {
        setImages((prev) => {
          const updated = [...prev];
          updated[index].uploading = false;
          updated[index].error = "Upload failed";
          return updated;
        });
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);

      // Call parent callback with uploaded images
      const uploadedImages = images
        .filter((img) => img.url)
        .map((img) => ({
          url: img.url!,
          type: img.type,
          alt: img.alt,
          order: img.order,
        }));

      onImagesUploaded(uploadedImages);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Some images failed to upload. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gold-500 transition"
        onClick={() => document.getElementById("multi-image-input")?.click()}
      >
        <input
          id="multi-image-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg mb-2">Click to upload images</p>
        <p className="text-sm text-gray-400">
          Or drag and drop multiple images here
        </p>
        <p className="text-xs text-gray-500 mt-2">
          JPG, PNG, WebP up to 10MB each • Max {maxImages} images
        </p>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {images.length} image{images.length !== 1 ? "s" : ""} selected
            </p>
            <button
              onClick={handleUploadAll}
              disabled={uploading || images.every((img) => img.url)}
              className="px-4 py-2 bg-gold-600 hover:bg-gold-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition"
            >
              {uploading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin inline mr-2" />
                  Uploading...
                </>
              ) : (
                "Upload All to ImageKit"
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative group border border-gray-700 rounded-lg overflow-hidden"
              >
                {/* Image Preview */}
                <div className="aspect-square bg-gray-800">
                  <img
                    src={img.preview}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay Info */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-2">
                  <p className="text-xs text-white text-center mb-1">
                    {img.type}
                  </p>
                  <p className="text-xs text-gray-300 text-center mb-2 line-clamp-2">
                    {img.alt}
                  </p>
                  
                  {img.uploading && (
                    <Loader className="w-5 h-5 animate-spin text-gold-500" />
                  )}
                  
                  {img.url && (
                    <ImageIcon className="w-5 h-5 text-green-500" />
                  )}
                  
                  {img.error && (
                    <p className="text-xs text-red-400">{img.error}</p>
                  )}

                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Order Badge */}
                <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  #{img.order}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
