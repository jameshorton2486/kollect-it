import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatio?: number;
  loadingHeight?: number | string;
  containerClassName?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc = "/placeholder.svg",
  aspectRatio = 1,
  loadingHeight = "300px",
  containerClassName,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setError(false);
  }, [src]);

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    setImageSrc(fallbackSrc);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <AspectRatio ratio={aspectRatio}>
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <Skeleton className="h-full w-full" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center p-4">
              <AlertCircle className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Failed to load image</p>
            </div>
          </div>
        )}

        <img
          src={imageSrc}
          alt={alt}
          className={cn(
            "object-cover w-full h-full transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
      </AspectRatio>
    </div>
  );
}