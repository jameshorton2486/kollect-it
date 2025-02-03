import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface CategoryHeaderProps {
  onAddCategory: () => void;
}

export function CategoryHeader({ onAddCategory }: CategoryHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-shop-800">Category Management</h1>
        <p className="text-shop-600 mt-2">Manage your store categories</p>
      </div>
      <Button 
        className="bg-shop-700 hover:bg-shop-800"
        onClick={onAddCategory}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Category
      </Button>
    </div>
  );
}