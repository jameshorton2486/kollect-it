import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ProductHeader } from "@/components/products/ProductHeader";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CreateProductForm } from "@/components/products/CreateProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, ShoppingBag, Tag, Filter } from "lucide-react";

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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Welcome to Kollect-It – Explore & Manage Your Collectibles
            </CardTitle>
            <p className="mt-2 text-muted-foreground">
              Find, browse, and manage your unique collectibles with ease. Whether you're looking to add a rare find
              to your collection or manage your store inventory, Kollect-It provides a seamless shopping and selling experience.
            </p>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-shop-700 hover:bg-shop-800"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              List a Product
            </Button>
            <Button variant="outline">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Collectibles
            </Button>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="space-y-6 md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Browse
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Use our intuitive filters to discover collectibles that match your interests
                </p>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </aside>

          <main className="md:col-span-3">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  {isLoading ? "Loading..." : `${filteredProducts.length} Products Found`}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length === 0 
                    ? "Try adjusting your filters or exploring new categories. Our curated collection is always growing with unique and rare finds."
                    : "Browse our curated collection of fine art and collectibles, with prices ranging from $100 to $1,000+"}
                </p>
              </CardHeader>
            </Card>
            <ProductGrid products={filteredProducts} categories={categories} />
          </main>
        </div>

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