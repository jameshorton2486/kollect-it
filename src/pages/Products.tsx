import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { ProductHeader } from "@/components/products/ProductHeader";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CreateProductForm } from "@/components/products/CreateProductForm";
import { Separator } from "@/components/ui/separator";

export default function Products() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCondition, setSelectedCondition] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Tables<"categories">[];
    },
  });

  const { data: products } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: async () => {
      let query = supabase.from("products").select("*");

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Tables<"products">[];
    },
  });

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition = selectedCondition === "all" || product.condition === selectedCondition;
    const matchesPriceRange =
      (!priceRange.min || product.price >= Number(priceRange.min)) &&
      (!priceRange.max || product.price <= Number(priceRange.max));

    return matchesSearch && matchesCondition && matchesPriceRange;
  }) || [];

  const handleCreateProduct = async (values: any): Promise<{ id: string } | undefined> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: values.name,
            description: values.description,
            price: parseFloat(values.price),
            category_id: values.category_id,
            condition: values.condition,
            image_url: values.image_url,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Product created",
        description: "The product has been created successfully.",
      });

      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });

      return { id: data.id };
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the product.",
        variant: "destructive",
      });
      return undefined;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <ProductHeader onOpenCreateDialog={() => setIsCreateDialogOpen(true)} />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="space-y-6 md:col-span-1">
            <ProductFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedCondition={selectedCondition}
              onConditionChange={setSelectedCondition}
            />
          </aside>

          <main className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-lg font-semibold text-shop-800 mb-2">
                {filteredProducts.length} Products Found
              </h2>
              <p className="text-shop-500">
                Browse our curated collection of fine art and collectibles
              </p>
            </div>
            <ProductGrid products={filteredProducts} categories={categories} />
          </main>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-shop-800">
                Add New Product
              </DialogTitle>
            </DialogHeader>
            <CreateProductForm
              onSubmit={handleCreateProduct}
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}