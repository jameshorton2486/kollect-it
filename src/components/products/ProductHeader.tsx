import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ProductHeaderProps {
  onOpenCreateDialog: () => void;
}

export function ProductHeader({ onOpenCreateDialog }: ProductHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <h1 className="text-3xl font-bold text-shop-800">Products</h1>
        <p className="text-shop-500 mt-1">Manage your store products</p>
      </div>
      <Button onClick={onOpenCreateDialog} className="bg-shop-700 hover:bg-shop-800 text-white">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>
  );
}