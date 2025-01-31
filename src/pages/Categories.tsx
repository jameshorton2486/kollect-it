import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { CategoryCard } from "@/components/categories/CategoryCard";

interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export default function Categories() {
  const { toast } = useToast();

  const { data: categories, refetch, error: fetchError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      console.log("Fetching categories...");
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      
      console.log("Categories fetched successfully:", data);
      return data as Category[];
    },
  });

  const handleSubmit = async (values: { name: string; description?: string }) => {
    console.log("Attempting to create category with values:", values);
    
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([{
          name: values.name,
          description: values.description || null,
        }])
        .select();

      if (error) {
        console.error("Supabase error creating category:", error);
        const errorMessage = error.code === "23505" 
          ? "A category with this name already exists."
          : error.code === "42501"
          ? "You don't have permission to create categories."
          : "There was an error creating the category.";
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      console.log("Category created successfully:", data);
      toast({
        title: "Category created",
        description: "The category has been created successfully.",
      });

      refetch();
    } catch (error) {
      console.error("Unexpected error creating category:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the category.",
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
            <p className="text-red-600">
              There was an error loading the categories. Please try again later.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-shop-800">Categories</h1>
            <p className="text-shop-500 mt-1">Manage your store categories</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-shop-700 hover:bg-shop-800 text-white">
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
          {categories?.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}