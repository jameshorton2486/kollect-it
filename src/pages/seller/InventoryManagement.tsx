
import { DashboardLayout } from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventorySearch } from "@/components/inventory/InventorySearch";
import { InventoryActions } from "@/components/inventory/InventoryActions";
import { ProductCard } from "@/components/inventory/ProductCard";

export default function InventoryManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ["seller-products"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data;
    }
  });

  const itemLimit = 30;
  const itemCount = products?.length || 0;

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = stockFilter === "all" 
      || (stockFilter === "low_stock" && product.stock_status === "low_stock")
      || (stockFilter === "out_of_stock" && product.stock_status === "out_of_stock");
    return matchesSearch && matchesStock;
  });

  const handleBulkUpdate = async (action: 'increment' | 'decrement') => {
    if (!selectedProducts.length) {
      toast.error("Please select products to update");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("You must be logged in");
      return;
    }

    const updates = selectedProducts.map(productId => {
      const product = products?.find(p => p.id === productId);
      if (!product) return null;
      
      return {
        id: productId,
        stock_quantity: action === 'increment' ? product.stock_quantity + 1 : Math.max(0, product.stock_quantity - 1),
        user_id: session.user.id,
        name: product.name,
        price: product.price
      };
    }).filter(Boolean);

    if (!updates.length) return;

    const { error } = await supabase
      .from('products')
      .upsert(updates);

    if (error) {
      toast.error("Failed to update inventory");
    } else {
      toast.success("Inventory updated successfully");
      refetch();
      setSelectedProducts([]);
    }
  };

  const handleThresholdUpdate = async (productId: string, newThreshold: number) => {
    const { error } = await supabase
      .from('products')
      .update({ low_stock_threshold: newThreshold })
      .eq('id', productId);

    if (error) {
      toast.error("Failed to update threshold");
    } else {
      toast.success("Threshold updated successfully");
      refetch();
    }
  };

  return (
    <DashboardLayout pageTitle="Inventory Management">
      <div className="container mx-auto py-8">
        <div className="grid gap-6">
          <InventoryHeader itemCount={itemCount} itemLimit={itemLimit} />
          
          <InventorySearch
            searchQuery={searchQuery}
            stockFilter={stockFilter}
            onSearchChange={setSearchQuery}
            onStockFilterChange={setStockFilter}
          />

          <InventoryActions
            selectedProducts={selectedProducts}
            onBulkUpdate={handleBulkUpdate}
          />

          {isLoading ? (
            <div>Loading inventory...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredProducts?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={selectedProducts.includes(product.id)}
                  onSelect={() => {
                    const newSelected = selectedProducts.includes(product.id)
                      ? selectedProducts.filter(id => id !== product.id)
                      : [...selectedProducts, product.id];
                    setSelectedProducts(newSelected);
                  }}
                  onThresholdUpdate={handleThresholdUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
