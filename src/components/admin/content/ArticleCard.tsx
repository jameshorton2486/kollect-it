
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ArticleCardProps {
  id: string;
  title: string;
  content: string;
  onEdit: () => void;
  onDelete: () => void;
  isSubmitting: boolean;
}

export function ArticleCard({ id, title, content, onEdit, onDelete, isSubmitting }: ArticleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          {content.substring(0, 200)}...
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            disabled={isSubmitting}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={isSubmitting}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
