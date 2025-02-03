import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "../CategoryForm";
import { FormValues } from "../CategoryForm";

interface CategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: { name: string; description?: string; subcategories: string[] }) => Promise<void>;
  title: string;
  defaultValues?: FormValues;
}

export function CategoryDialog({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  title, 
  defaultValues 
}: CategoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <CategoryForm onSubmit={onSubmit} defaultValues={defaultValues} />
      </DialogContent>
    </Dialog>
  );
}