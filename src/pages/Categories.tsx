
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Tag, AlertCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Tables } from "@/integrations/supabase/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Category = Tables<"categories">;
type Subcategory = Tables<"subcategories">;

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

const RETRY_AFTER_DEFAULT = 60; // Default retry after 60 seconds if server doesn't specify

export default function Categories() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [retryAfter, setRetryAfter] = React.useState<number | null>(null);

  const { data: categories, refetch, error: fetchError, isError } = useQuery({
    queryKey: ["categories-with-subcategories"],
    queryFn: async () => {
      try {
        console.log("Fetching categories and subcategories...");
        
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        if (categoriesError) {
          if (categoriesError.code === "429") {
            const retryAfterHeader = categoriesError.message.match(/retry after (\d+)/i)?.[1];
            const retrySeconds = parseInt(retryAfterHeader || RETRY_AFTER_DEFAULT.toString());
            setRetryAfter(retrySeconds);
            throw new Error(`Rate limit exceeded. Please try again in ${retrySeconds} seconds.`);
          }
          console.error("Error fetching categories:", categoriesError);
          throw categoriesError;
        }

        const { data: subcategoriesData, error: subcategoriesError } = await supabase
          .from("subcategories")
          .select("*");

        if (subcategoriesError) {
          if (subcategoriesError.code === "429") {
            const retryAfterHeader = subcategoriesError.message.match(/retry after (\d+)/i)?.[1];
            const retrySeconds = parseInt(retryAfterHeader || RETRY_AFTER_DEFAULT.toString());
            setRetryAfter(retrySeconds);
            throw new Error(`Rate limit exceeded. Please try again in ${retrySeconds} seconds.`);
          }
          console.error("Error fetching subcategories:", subcategoriesError);
          throw subcategoriesError;
        }

        setRetryAfter(null); // Clear any existing retry timer on successful fetch

        const categoriesWithSubs = categoriesData.map((category) => ({
          ...category,
          subcategories: subcategoriesData.filter(
            (sub) => sub.category_id === category.id
          ),
        })) satisfies CategoryWithSubcategories[];

        console.log("Successfully fetched categories:", categoriesWithSubs);
        return categoriesWithSubs;
      } catch (error: any) {
        console.error("Query error:", error);
        throw error;
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry on rate limit errors until the retry time has passed
      if (error?.message?.includes('Rate limit exceeded')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleSubmit = async (values: { name: string; description: string; subcategories: Array<{ id: string; value: string }> }) => {
    try {
      console.log("Creating new category with values:", values);
      
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .insert([{
          name: values.name,
          description: values.description
        }])
        .select()
        .single();

      if (categoryError) {
        if (categoryError.code === "429") {
          const retryAfterHeader = categoryError.message.match(/retry after (\d+)/i)?.[1];
          const retrySeconds = parseInt(retryAfterHeader || RETRY_AFTER_DEFAULT.toString());
          setRetryAfter(retrySeconds);
          throw new Error(`Rate limit exceeded. Please try again in ${retrySeconds} seconds.`);
        }
        console.error("Error creating category:", categoryError);
        throw categoryError;
      }

      console.log("Category created successfully:", categoryData);

      if (values.subcategories && values.subcategories.length > 0) {
        const subcategoryPromises = values.subcategories
          .filter(sub => sub.value.trim())
          .map(subcategory =>
            supabase
              .from("subcategories")
              .insert([{
                name: subcategory.value,
                category_id: categoryData.id,
              }])
          );

        try {
          const subcategoryResults = await Promise.all(subcategoryPromises);
          
          const subcategoryErrors = subcategoryResults
            .filter(result => result.error)
            .map(result => result.error);
          
          if (subcategoryErrors.length > 0) {
            const hasRateLimit = subcategoryErrors.some(error => error.code === "429");
            if (hasRateLimit) {
              const retryAfterHeader = subcategoryErrors[0].message.match(/retry after (\d+)/i)?.[1];
              const retrySeconds = parseInt(retryAfterHeader || RETRY_AFTER_DEFAULT.toString());
              setRetryAfter(retrySeconds);
              throw new Error(`Rate limit exceeded. Please try again in ${retrySeconds} seconds.`);
            }
            console.error("Errors creating subcategories:", subcategoryErrors);
            throw new Error("Failed to create some subcategories");
          }

          console.log("Subcategories created successfully");
        } catch (error: any) {
          if (error.message.includes('Rate limit exceeded')) {
            throw error;
          }
          throw new Error("Failed to create subcategories");
        }
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

  // Auto-retry after rate limit expires
  React.useEffect(() => {
    if (retryAfter) {
      const timer = setTimeout(() => {
        setRetryAfter(null);
        refetch();
      }, retryAfter * 1000);

      return () => clearTimeout(timer);
    }
  }, [retryAfter, refetch]);

  if (isError) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {retryAfter 
                ? `Rate limit exceeded. Retrying in ${retryAfter} seconds...`
                : fetchError?.message || "Failed to load categories. Please try again later."}
            </AlertDescription>
          </Alert>
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
              <Button 
                className="bg-[#0d2e49] hover:bg-[#0a2438] text-white"
                disabled={!!retryAfter}
              >
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
