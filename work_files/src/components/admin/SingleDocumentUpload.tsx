"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, Loader } from "lucide-react";
import Image from "next/image";

interface SingleDocumentUploadProps {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  maxSizeMB?: number;
}

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];

export default function SingleDocumentUpload({
  label,
  value,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png,.webp",
  maxSizeMB = 10,
}: SingleDocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFile = (file: File): boolean => {
    // Check file type
    const isValidType = ALLOWED_TYPES.includes(file.type) ||
      ALLOWED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      setError(`Invalid file type. Allowed: PDF, JPG, PNG, WEBP`);
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    return true;
  };

  const uploadToImageKit = async (file: File): Promise<string | null> => {
    try {
      const authRes = await fetch("/api/imagekit-auth");
      if (!authRes.ok) throw new Error("Auth failed");
      const { token, expire, signature } = await authRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("token", token);
      formData.append("expire", String(expire));
      formData.append("signature", signature);
      formData.append(
        "publicKey",
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""
      );
      formData.append("folder", "/product-documents");
      formData.append("useUniqueFileName", "true");

      const response = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Upload failed: ${errorData}`);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading to ImageKit:", error);
      setError(error instanceof Error ? error.message : "Upload failed");
      return null;
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!isValidFile(file)) return;

    setError("");
    setUploading(true);

    try {
      const url = await uploadToImageKit(file);
      if (url) {
        onChange(url);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const getFileName = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const fileName = pathname.split("/").pop() || "document";
      return decodeURIComponent(fileName);
    } catch {
      return "document";
    }
  };

  const isImage = (url: string): boolean => {
    return /\.(jpg|jpeg|png|webp)$/i.test(url);
  };

  const isPDF = (url: string): boolean => {
    return /\.pdf$/i.test(url);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-lux-cream mb-2">
        {label}
      </label>

      {!value ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? "border-lux-gold bg-lux-gold/10"
              : "border-lux-charcoal/50 hover:border-lux-gold/50"
          } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            aria-label={label}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-8 h-8 text-lux-gold animate-spin" />
              <p className="text-sm text-lux-gray">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-8 h-8 text-lux-gray-dark" />
              <div>
                <p className="text-sm font-medium text-lux-cream">
                  Drag & drop file here
                </p>
                <p className="text-xs text-lux-gray mt-1">or</p>
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  className="mt-2 px-4 py-2 bg-lux-gold hover:bg-lux-gold-light text-lux-black text-sm font-medium rounded-full transition"
                >
                  Browse Files
                </button>
              </div>
              <p className="text-xs text-lux-gray-dark mt-2">
                PDF, JPG, PNG, WEBP • Max {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-lux-charcoal/50 rounded-lg p-4 bg-lux-charcoal/30">
          <div className="flex items-center gap-4">
            {/* Preview/Icon */}
            <div className="flex-shrink-0">
              {isImage(value) ? (
                <div className="relative w-16 h-16 rounded overflow-hidden border border-lux-charcoal/50">
                  <Image
                    src={value}
                    alt="Document preview"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : isPDF(value) ? (
                <div className="w-16 h-16 rounded bg-red-600/20 flex items-center justify-center border border-red-600/30">
                  <FileText className="w-8 h-8 text-red-400" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded bg-lux-charcoal/50 flex items-center justify-center border border-lux-charcoal/50">
                  <ImageIcon className="w-8 h-8 text-lux-gray-dark" />
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-lux-cream truncate">
                {getFileName(value)}
              </p>
              <p className="text-xs text-lux-gray-dark mt-1">
                {isImage(value) ? "Image" : isPDF(value) ? "PDF Document" : "Document"}
              </p>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-lux-gold hover:text-lux-gold-light mt-1 inline-block"
              >
                View document →
              </a>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={handleRemove}
              className="flex-shrink-0 p-2 text-lux-gray-dark hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
              title="Remove document"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
