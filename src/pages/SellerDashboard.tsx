import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/seller-dashboard/DashboardHeader";
import { StatCards } from "@/components/seller-dashboard/StatCards";
import { SalesChart } from "@/components/seller-dashboard/SalesChart";
import { QuickActions } from "@/components/seller-dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, ShoppingBag, Settings, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function SellerDashboard() {
  const navigate = useNavigate();

  // Fetch seller profile
  const { data: profile } = useQuery({
    queryKey: ["seller-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      return profile;
    }
  });

  const quickAccessLinks = [
    {
      title: "Add New Product",
      icon: Plus,
      description: "List a new item for sale",
      path: "/seller/products/new"
    },
    {
      title: "Sales Analytics",
      icon: TrendingUp,
      description: "View detailed sales reports and trends",
      path: "/seller/analytics"
    },
    {
      title: "Orders",
      icon: ShoppingBag,
      description: "Track and manage customer orders",
      path: "/seller/orders"
    },
    {
      title: "Settings",
      icon: Settings,
      description: "Configure your shop preferences",
      path: "/seller/settings"
    }
  ];

  return (
    <DashboardLayout requiredRole="seller">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-shop-800 mb-4">
            Welcome back, {profile?.first_name || "Seller"}!
          </h1>
          <p className="text-shop-600 max-w-3xl">
            Manage your antique collection, track sales, and grow your business with Kollect-It's 
            comprehensive seller tools. Our platform helps you reach collectors worldwide while 
            providing the tools you need to succeed.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="bg-shop-50 p-4 rounded-lg">
              <h3 className="font-semibold text-shop-800">Wide Reach</h3>
              <p className="text-sm text-shop-600">Connect with collectors globally</p>
            </div>
            <div className="bg-shop-50 p-4 rounded-lg">
              <h3 className="font-semibold text-shop-800">Easy Management</h3>
              <p className="text-sm text-shop-600">Powerful tools for your inventory</p>
            </div>
            <div className="bg-shop-50 p-4 rounded-lg">
              <h3 className="font-semibold text-shop-800">Secure Payments</h3>
              <p className="text-sm text-shop-600">Safe and reliable transactions</p>
            </div>
          </div>
        </div>
        
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccessLinks.map((link) => (
            <Card 
              key={link.title}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => navigate(link.path)}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <link.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{link.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {link.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Overview */}
        <div className="grid gap-6">
          <StatCards />
          <SalesChart />
          
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
                    {/* We'll implement the orders list in a future update */}
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
                    {/* We'll implement the inventory alerts in a future update */}
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
        </div>
      </div>
    </DashboardLayout>
  );
}