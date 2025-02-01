import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string | null;
}

export function CategoryCard({ name, description }: CategoryCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-shop-800">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-shop-600 mb-4">{description}</p>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button variant="outline" size="sm" className="w-full">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" className="w-full">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}