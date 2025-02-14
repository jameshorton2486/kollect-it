
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Tag } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Tables } from "@/integrations/supabase/types";

type Category = Tables<"categories">;
type Subcategory = Tables<"subcategories">;

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

export default function Categories() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const { data: categories, refetch, error: fetchError } = useQuery({
    queryKey: ["categories-with-subcategories"],
    queryFn: async () => {
      console.log("Fetching categories and subcategories...");
      
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
        throw categoriesError;
      }

      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from("subcategories")
        .select("*");

      if (subcategoriesError) {
        console.error("Error fetching subcategories:", subcategoriesError);
        throw subcategoriesError;
      }

      const categoriesWithSubs = categoriesData.map((category) => ({
        ...category,
        subcategories: subcategoriesData.filter(
          (sub) => sub.category_id === category.id
        ),
      })) satisfies CategoryWithSubcategories[];

      console.log("Successfully fetched categories:", categoriesWithSubs);
      return categoriesWithSubs;
    },
  });

  const handleSubmit = async (values: { name: string; description: string; subcategories: Array<{ id: string; value: string }> }) => {
    try {
      console.log("Creating new category with values:", values);
      
      // Insert the category
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .insert([{
          name: values.name,
          description: values.description
        }])
        .select()
        .single();

      if (categoryError) {
        console.error("Error creating category:", categoryError);
        throw categoryError;
      }

      console.log("Category created successfully:", categoryData);

      // Insert subcategories
      if (values.subcategories && values.subcategories.length > 0) {
        const subcategoryPromises = values.subcategories
          .filter(sub => sub.value.trim()) // Filter out empty subcategories
          .map(subcategory =>
            supabase
              .from("subcategories")
              .insert([{
                name: subcategory.value,
                category_id: categoryData.id,
              }])
          );

        const subcategoryResults = await Promise.all(subcategoryPromises);
        
        // Check for subcategory creation errors
        const subcategoryErrors = subcategoryResults
          .filter(result => result.error)
          .map(result => result.error);
        
        if (subcategoryErrors.length > 0) {
          console.error("Errors creating subcategories:", subcategoryErrors);
          throw new Error("Failed to create some subcategories");
        }

        console.log("Subcategories created successfully");
      }
      
      toast({
        title: "Success",
        description: "Category created successfully",
      });

      setIsCreateDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (fetchError) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error Loading Categories</h2>
            <p className="text-red-600">Please try again later.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm animate-fadeIn">
          <div>
            <div className="flex items-center gap-2 text-shop-800">
              <Tag className="h-6 w-6" />
              <h1 className="text-3xl font-bold">Categories</h1>
            </div>
            <p className="text-shop-600 mt-2">Organize your collectibles into categories and subcategories</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0d2e49] hover:bg-[#0a2438] text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-shop-800">
                  Add New Category
                </DialogTitle>
              </DialogHeader>
              <CategoryForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category, index) => (
            <div
              key={category.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CategoryCard {...category} />
            </div>
          ))}
        </div>

        {categories?.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm animate-fadeIn">
            <Tag className="h-12 w-12 mx-auto text-shop-400 mb-4" />
            <h3 className="text-xl font-semibold text-shop-800 mb-2">No Categories Yet</h3>
            <p className="text-shop-600">Create your first category to start organizing your collectibles</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
