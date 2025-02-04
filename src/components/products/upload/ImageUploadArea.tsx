import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Loader2, Camera } from "lucide-react";

interface ImageUploadAreaProps {
  onDrop: (acceptedFiles: File[]) => void;
  isUploading: boolean;
  isProcessing: boolean;
  maxImages: number;
  onCameraCapture: () => void;
}

export function ImageUploadArea({
  onDrop,
  isUploading,
  isProcessing,
  maxImages,
  onCameraCapture,
}: ImageUploadAreaProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: maxImages,
  });

  return (
    <div className="flex gap-4 mb-4">
      <div
        {...getRootProps()}
        className={`flex-1 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}
          bg-white shadow-sm hover:shadow-md`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            {isDragActive ? (
              <p className="font-medium">Drop the files here...</p>
            ) : (
              <div className="space-y-2">
                <p className="font-medium">Drag & drop images here</p>
                <p className="text-xs text-gray-500">
                  or click to select files (up to {maxImages} images)
                </p>
              </div>
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
        onClick={onCameraCapture}
        className="flex items-center gap-2 bg-white hover:bg-gray-50"
      >
        <Camera className="h-4 w-4" />
        Take Photo
      </Button>
    </div>
  );
}