import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, AlertCircle } from "lucide-react";

export default function InventoryManagement() {
  const { data: products, isLoading } = useQuery({
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

          {isLoading ? (
            <div>Loading inventory...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {products?.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-shop-600">{product.description}</p>
                    <p className="mt-2 font-semibold">${product.price}</p>
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