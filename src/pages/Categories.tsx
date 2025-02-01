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
type Subcategory = {
  id: string;
  name: string;
  category_id: string;
};

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

export default function Categories() {
  const { toast } = useToast();

  const { data: categories, refetch, error: fetchError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // First fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (categoriesError) throw categoriesError;

      // Then fetch all subcategories
      const { data: allSubcategories, error: subsError } = await supabase
        .from("subcategories")
        .select("*");

      if (subsError) throw subsError;

      // Map subcategories to their respective categories
      const categoriesWithSubs = categoriesData.map((category) => ({
        ...category,
        subcategories: allSubcategories?.filter(
          (sub) => sub.category_id === category.id
        ) || [],
      }));

      return categoriesWithSubs as CategoryWithSubcategories[];
    },
  });

  const handleSubmit = async (values: { name: string; subcategories: string[] }) => {
    try {
      // Insert the category
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .insert([{
          name: values.name,
        }])
        .select()
        .single();

      if (categoryError) throw categoryError;

      // Insert subcategories
      const subcategoryPromises = values.subcategories.map(subcategoryName =>
        supabase
          .from("subcategories")
          .insert([{
            name: subcategoryName,
            category_id: categoryData.id,
          }])
      );

      await Promise.all(subcategoryPromises);

      toast({
        title: "Success",
        description: "Category created successfully",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-shop-accent1 hover:bg-shop-accent1/90 text-white">
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