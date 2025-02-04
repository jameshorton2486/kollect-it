import { DashboardLayout } from "@/components/DashboardLayout";
import { CreateProductForm } from "@/components/products/CreateProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ListingManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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

  const handleCreateProduct = async (values: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: values.name,
            description: values.description,
            price: parseFloat(values.price),
            category_id: values.category_id,
            condition: values.condition,
            era: values.era,
            provenance: values.provenance,
            estimated_age: values.estimated_age,
            user_id: session.user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });

      return { id: data.id };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
      return undefined;
    }
  };

  return (
    <DashboardLayout pageTitle="Listing Management">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-shop-800">Manage Listings</h1>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[#008080] hover:bg-[#006666] text-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Listing
          </Button>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[800px] w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-shop-800">
                Create New Listing
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