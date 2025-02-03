import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { CategoryCard } from "@/components/categories/CategoryCard";

export default function CategoryManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories, refetch } = useQuery({
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
      // Create the category
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .insert({
          name: values.name,
          description: values.description,
        })
        .select()
        .single();

      if (categoryError) throw categoryError;

      // Create subcategories if any
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

      toast({
        title: "Success",
        description: "Category created successfully",
      });

      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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

      // Update the category
      const { error: categoryError } = await supabase
        .from("categories")
        .update({
          name: values.name,
          description: values.description,
        })
        .eq("id", editingCategory.id);

      if (categoryError) throw categoryError;

      // Delete existing subcategories
      const { error: deleteError } = await supabase
        .from("subcategories")
        .delete()
        .eq("category_id", editingCategory.id);

      if (deleteError) throw deleteError;

      // Create new subcategories
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

      toast({
        title: "Success",
        description: "Category updated successfully",
      });

      setEditingCategory(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-shop-800">Category Management</h1>
            <p className="text-shop-600 mt-2">Manage your store categories</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-shop-700 hover:bg-shop-800">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <CategoryForm onSubmit={handleCreateCategory} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              description={category.description || ""}
              subcategories={category.subcategories || []}
              onEdit={() => setEditingCategory(category)}
              onDelete={() => handleDeleteCategory(category.id)}
            />
          ))}
        </div>

        {/* Edit Category Dialog */}
        <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            {editingCategory && (
              <CategoryForm
                onSubmit={handleEditCategory}
                defaultValues={{
                  name: editingCategory.name,
                  description: editingCategory.description,
                  subcategories: editingCategory.subcategories?.map((sub: any) => ({ value: sub.name })) || [],
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}