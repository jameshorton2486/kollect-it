import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  variant?: "card" | "list" | "table";
}

export function LoadingSkeleton({ 
  className, 
  count = 1, 
  variant = "card" 
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const getSkeletonContent = () => {
    switch (variant) {
      case "card":
        return (
          <div className="space-y-3">
            <div className="h-40 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        );
      case "list":
        return (
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        );
      case "table":
        return (
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {skeletons.map((index) => (
        <div key={index} className="animate-fade-in">
          {getSkeletonContent()}
        </div>
      ))}
    </div>
  );
}