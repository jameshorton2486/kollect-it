import { Edit2, Trash2, FolderOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Subcategory {
  id: string;
  name: string;
}

interface CategoryCardProps {
  id: string;
  name: string;
  description?: string;
  subcategories: Subcategory[];
  onEdit?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export function CategoryCard({ 
  name, 
  description, 
  subcategories,
  onEdit,
  onDelete,
  isLoading
}: CategoryCardProps) {
  if (isLoading) {
    return (
      <Card className="group">
        <CardHeader className="space-y-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-md transition-all duration-300">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-shop-accent1" />
            <div>
              <CardTitle className="text-xl font-semibold text-shop-800 flex items-center gap-2">
                {name}
                <Badge variant="secondary" className="ml-2">
                  {subcategories.length} {subcategories.length === 1 ? 'subcategory' : 'subcategories'}
                </Badge>
              </CardTitle>
            </div>
          </div>
        </div>
        {description && (
          <CardDescription className="text-shop-600 mt-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="min-h-[60px]">
          {subcategories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {subcategories.map((subcategory) => (
                <Badge 
                  key={subcategory.id} 
                  variant="secondary"
                  className="bg-shop-muted1 text-shop-accent1 hover:bg-shop-muted1/80"
                >
                  {subcategory.name}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">No subcategories</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full hover:bg-shop-accent1/10 hover:text-shop-accent1" 
              onClick={onEdit}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full" 
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}