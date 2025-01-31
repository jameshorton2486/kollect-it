import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Receipt, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function PurchaseHistory() {
  const [filter, setFilter] = useState("all");

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
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order #12345</CardTitle>
                <p className="text-sm text-muted-foreground">Placed on March 15, 2024</p>
              </div>
              <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                Delivered
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src="/placeholder.svg"
                  alt="Product"
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">Vintage Art Print</h3>
                  <p className="text-sm text-muted-foreground">Limited Edition</p>
                  <p className="font-medium">{formatPrice(299.99)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Receipt className="w-4 h-4 mr-2" />
                    View Receipt
                  </Button>
                  <Button variant="outline" size="sm">
                    <Truck className="w-4 h-4 mr-2" />
                    Track Order
                  </Button>
                </div>
              </div>
              <Button variant="secondary" className="w-full">
                Buy Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}