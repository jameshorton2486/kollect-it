import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Receipt, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function PurchaseHistory() {
  const [filter, setFilter] = useState("all");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", filter],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      let query = supabase
        .from("orders")
        .select(`
          *,
          products (
            name,
            price,
            image_url
          )
        `)
        .eq("buyer_id", session.user.id);

      if (filter === "recent") {
        query = query.gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      } else if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleTrackOrder = (trackingNumber: string | null) => {
    if (!trackingNumber) {
      toast.error("No tracking number available");
      return;
    }
    // Implement tracking logic here
    toast.info("Tracking feature coming soon!");
  };

  const handleViewReceipt = (orderId: string) => {
    // Implement receipt view logic here
    toast.info("Receipt view feature coming soon!");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-shop-800">Purchase History</h1>
          <div className="flex gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="recent">Recent Orders</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6">
          {orders?.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 inline-block mr-1" />
                    Placed on {format(new Date(order.created_at), "MMMM d, yyyy")}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  order.status === "delivered" ? "bg-green-100 text-green-800" :
                  order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={order.products.image_url || "/placeholder.svg"}
                    alt={order.products.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{order.products.name}</h3>
                    <p className="font-medium">{formatPrice(order.total_amount)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewReceipt(order.id)}
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      View Receipt
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTrackOrder(order.tracking_number)}
                      disabled={!order.tracking_number}
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Track Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {orders?.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No orders found.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}