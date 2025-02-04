import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ImageUploadAreaProps {
  onDrop: (acceptedFiles: File[]) => void;
  isUploading: boolean;
  isProcessing: boolean;
  maxImages: number;
  onCameraCapture: () => void;
  uploadedCount: number;
}

export function ImageUploadArea({
  onDrop,
  isUploading,
  isProcessing,
  maxImages,
  onCameraCapture,
  uploadedCount,
}: ImageUploadAreaProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: maxImages - uploadedCount,
    disabled: isUploading || isProcessing,
  });

  const progressValue = (uploadedCount / maxImages) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          {uploadedCount} of {maxImages} images uploaded
        </span>
        <Progress value={progressValue} className="w-1/2" />
      </div>
      
      <div className="flex gap-4">
        <div
          {...getRootProps()}
          className={`flex-1 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}
            ${(isUploading || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}
            bg-white shadow-sm hover:shadow-md`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              {isDragActive ? (
                <p className="font-medium">Drop the files here...</p>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="font-medium">Drag & drop images here</p>
                  <p className="text-xs text-gray-500">
                    or click to select files (up to {maxImages - uploadedCount} more images)
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
          disabled={isUploading || isProcessing || uploadedCount >= maxImages}
          className="flex items-center gap-2 bg-white hover:bg-gray-50"
        >
          <Camera className="h-4 w-4" />
          Take Photo
        </Button>
      </div>
    </div>
  );
}