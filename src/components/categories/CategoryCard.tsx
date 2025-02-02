import { Edit2, Trash2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
}

export function CategoryCard({ 
  name, 
  description, 
  subcategories,
  onEdit,
  onDelete 
}: CategoryCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-300">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-shop-accent1" />
            <CardTitle className="text-xl font-semibold text-shop-800">
              {name}
            </CardTitle>
          </div>
        </div>
        {description && (
          <CardDescription className="text-shop-600">
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
            <p className="text-sm text-muted-foreground">
              No subcategories
            </p>
          )}
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <Button variant="outline" size="sm" className="w-full" onClick={onEdit}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" className="w-full" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}