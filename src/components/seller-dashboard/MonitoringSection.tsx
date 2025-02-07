
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MonitoringSection() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Recent Orders
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Track and manage your recent orders. Quick access to order details, 
            shipping status, and customer information.
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent orders to display.
              </p>
            </div>
          </ScrollArea>
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline"
              onClick={() => navigate("/seller/orders")}
            >
              View All Orders
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory Alerts
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Monitor your inventory levels and get notified about low stock items 
            that need attention.
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center py-8">
                No inventory alerts at this time.
              </p>
            </div>
          </ScrollArea>
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline"
              onClick={() => navigate("/seller/inventory")}
            >
              Manage Inventory
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
