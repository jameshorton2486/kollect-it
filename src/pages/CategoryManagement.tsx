import { DashboardLayout } from "@/components/DashboardLayout";
import { CategoryGrid } from "@/components/categories/management/CategoryGrid";
import { CategoryDialog } from "@/components/categories/management/CategoryDialog";
import { CategoryHeader } from "@/components/categories/management/CategoryHeader";
import { BulkProductUpload } from "@/components/categories/management/BulkProductUpload";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type Category = Tables<"categories"> & {
  subcategories: Tables<"subcategories">[];
};

export default function CategoryManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { data: categories, refetch } = useQuery({
    queryKey: ["categories-with-subcategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(`
          *,
          subcategories (*)
        `)
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    }
  });

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;

      toast.success("Category deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <CategoryHeader 
          onCreateClick={() => setIsDialogOpen(true)}
          onBulkUploadClick={() => setIsBulkUploadOpen(true)}
        />
        <CategoryGrid 
          categories={categories || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <CategoryDialog 
          isOpen={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          category={selectedCategory}
          onSubmit={async (values) => {
            try {
              if (selectedCategory) {
                const { error } = await supabase
                  .from("categories")
                  .update(values)
                  .eq("id", selectedCategory.id);
                
                if (error) throw error;
                toast.success("Category updated successfully");
              } else {
                const { error } = await supabase
                  .from("categories")
                  .insert([values]);
                
                if (error) throw error;
                toast.success("Category created successfully");
              }
              setIsDialogOpen(false);
              refetch();
            } catch (error) {
              console.error("Error saving category:", error);
              toast.error("Failed to save category");
            }
          }}
        />
        <BulkProductUpload
          open={isBulkUploadOpen}
          onOpenChange={setIsBulkUploadOpen}
        />
      </div>
    </DashboardLayout>
  );
}