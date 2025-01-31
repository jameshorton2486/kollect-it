import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CreateProductForm } from "@/components/products/CreateProductForm";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { ProductsContent } from "@/components/products/ProductsContent";

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
      return data;
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: async () => {
      let query = supabase.from("products").select("*");

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
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

  const handleCreateProduct = async (values: any) => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductsHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
        <ProductsContent
          isLoading={isLoading}
          filteredProducts={filteredProducts}
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          selectedCondition={selectedCondition}
          onConditionChange={setSelectedCondition}
        />

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-shop-800">
                Add New Product
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                List your collectible with accurate details. Remember our commitment to quality:
                first violation receives a warning, repeated offenses result in a permanent ban.
              </p>
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