import { DashboardLayout } from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { CategoryDialog } from "@/components/categories/management/CategoryDialog";
import { CategoryHeader } from "@/components/categories/management/CategoryHeader";
import { CategoryGrid } from "@/components/categories/management/CategoryGrid";
import { Tables } from "@/integrations/supabase/types";

export default function CategoryManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data: categories, error } = await supabase
        .from("categories")
        .select(`
          *,
          subcategories (
            id,
            name
          )
        `)
        .order("name");
      
      if (error) throw error;
      return categories;
    },
  });

  const handleCreateCategory = async (values: { name: string; description?: string; subcategories: string[] }) => {
    try {
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .insert({
          name: values.name,
          description: values.description,
        })
        .select()
        .single();

      if (categoryError) throw categoryError;

      if (values.subcategories.length > 0) {
        const { error: subcategoriesError } = await supabase
          .from("subcategories")
          .insert(
            values.subcategories.map(name => ({
              name,
              category_id: category.id,
            }))
          );

        if (subcategoriesError) throw subcategoriesError;
      }

      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = async (values: { name: string; description?: string; subcategories: string[] }) => {
    try {
      if (!editingCategory) return;

      const { error: categoryError } = await supabase
        .from("categories")
        .update({
          name: values.name,
          description: values.description,
        })
        .eq("id", editingCategory.id);

      if (categoryError) throw categoryError;

      const { error: deleteError } = await supabase
        .from("subcategories")
        .delete()
        .eq("category_id", editingCategory.id);

      if (deleteError) throw deleteError;

      if (values.subcategories.length > 0) {
        const { error: subcategoriesError } = await supabase
          .from("subcategories")
          .insert(
            values.subcategories.map(name => ({
              name,
              category_id: editingCategory.id,
            }))
          );

        if (subcategoriesError) throw subcategoriesError;
      }

      setEditingCategory(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <CategoryHeader onAddCategory={() => setIsCreateDialogOpen(true)} />
        
        <CategoryGrid 
          categories={categories}
          onEdit={setEditingCategory}
          onDelete={handleDeleteCategory}
        />

        <CategoryDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateCategory}
          title="Add New Category"
        />

        <CategoryDialog
          isOpen={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
          onSubmit={handleEditCategory}
          title="Edit Category"
          defaultValues={editingCategory && {
            name: editingCategory.name,
            description: editingCategory.description,
            subcategories: editingCategory.subcategories?.map((sub: any) => ({ value: sub.name })) || [],
          }}
        />
      </div>
    </DashboardLayout>
  );
}