
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

interface CategoryHeaderProps {
  onCreateClick: () => void;
  onBulkUploadClick: () => void;
}

export function CategoryHeader({ onCreateClick, onBulkUploadClick }: CategoryHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
        <p className="text-sm text-gray-500">Manage your product categories and bulk upload products</p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={onBulkUploadClick}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Bulk Upload Products
        </Button>
        <Button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-[#008080] hover:bg-[#006666]"
        >
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>
    </div>
  );
}
