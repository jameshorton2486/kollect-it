
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "../CategoryForm";
import { Tables } from "@/integrations/supabase/types";

type Category = Tables<"categories"> & {
  subcategories: Tables<"subcategories">[];
};

interface CategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSubmit: (values: { name: string; description?: string; subcategories: string[] }) => Promise<void>;
}

export function CategoryDialog({ 
  isOpen, 
  onOpenChange, 
  category,
  onSubmit 
}: CategoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>
        <CategoryForm 
          onSubmit={onSubmit}
          defaultValues={category ? {
            name: category.name,
            description: category.description || "",
            subcategories: category.subcategories.map(sub => ({
              id: sub.id,
              value: sub.name
            }))
          } : undefined}
        />
      </DialogContent>
    </Dialog>
  );
}
