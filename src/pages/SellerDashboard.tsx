
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/seller-dashboard/DashboardHeader";
import { StatCards } from "@/components/seller-dashboard/StatCards";
import { SalesChart } from "@/components/seller-dashboard/SalesChart";
import { QuickActions } from "@/components/seller-dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SellerDashboard() {
  return (
    <DashboardLayout requiredRole="seller">
      <div className="space-y-8">
        <DashboardHeader />
        
        {/* Analytics Overview */}
        <div className="grid gap-6">
          <StatCards />
          <QuickActions />
          <SalesChart />
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track and manage your recent orders. Quick access to order details, 
                  shipping status, and customer information.
                </p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <p className="text-sm text-muted-foreground">No recent orders to display.</p>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Inventory Alerts</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monitor your inventory levels and get notified about low stock items 
                  that need attention.
                </p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <p className="text-sm text-muted-foreground">No inventory alerts at this time.</p>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
