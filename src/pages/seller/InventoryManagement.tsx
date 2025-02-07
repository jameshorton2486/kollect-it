
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, AlertCircle, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

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

  const itemLimit = 30; // This would come from the user's subscription
  const itemCount = products?.length || 0;
  const usagePercentage = (itemCount / itemLimit) * 100;

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

    const updates = selectedProducts.map(productId => ({
      id: productId,
      stock_quantity: action === 'increment' ? products?.find(p => p.id === productId)?.stock_quantity + 1 : Math.max(0, products?.find(p => p.id === productId)?.stock_quantity - 1)
    }));

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
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-[#008080]" />
                Inventory Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={usagePercentage} className="h-2" />
                <div className="flex justify-between text-sm text-shop-600">
                  <span>{itemCount} items listed</span>
                  <span>{itemLimit} items limit</span>
                </div>
                {usagePercentage >= 90 && (
                  <div className="flex items-center gap-2 text-amber-600 mt-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>You're approaching your inventory limit</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleBulkUpdate('increment')}>
                Increase Stock (+1)
              </Button>
              <Button variant="outline" onClick={() => handleBulkUpdate('decrement')}>
                Decrease Stock (-1)
              </Button>
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div>Loading inventory...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredProducts?.map((product) => (
                <Card 
                  key={product.id} 
                  className={`hover:shadow-lg transition-shadow ${
                    selectedProducts.includes(product.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    const newSelected = selectedProducts.includes(product.id)
                      ? selectedProducts.filter(id => id !== product.id)
                      : [...selectedProducts, product.id];
                    setSelectedProducts(newSelected);
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{product.name}</span>
                      <Badge variant={
                        product.stock_status === 'in_stock' ? 'default' :
                        product.stock_status === 'low_stock' ? 'warning' :
                        'destructive'
                      }>
                        {product.stock_status === 'in_stock' ? 'In Stock' :
                         product.stock_status === 'low_stock' ? 'Low Stock' :
                         'Out of Stock'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-shop-600">{product.description}</p>
                      <p className="font-semibold">${product.price}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Stock: {product.stock_quantity}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Alert at:</span>
                          <Input
                            type="number"
                            value={product.low_stock_threshold}
                            onChange={(e) => handleThresholdUpdate(product.id, parseInt(e.target.value))}
                            className="w-20 h-8"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
