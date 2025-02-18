
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ArticleLoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-6 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
