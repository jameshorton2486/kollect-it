
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/seller-dashboard/DashboardHeader";
import { StatCards } from "@/components/seller-dashboard/StatCards";
import { SalesChart } from "@/components/seller-dashboard/SalesChart";
import { QuickActions } from "@/components/seller-dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  Bell,
  MessageSquare,
  PackageSearch,
  TrendingUp,
  Settings,
  HelpCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SellerDashboard() {
  const navigate = useNavigate();

  const tools = [
    { 
      title: "Inventory Check", 
      icon: PackageSearch,
      description: "Review and manage your product inventory levels",
      action: () => navigate("/seller/inventory") 
    },
    { 
      title: "Performance Analytics", 
      icon: TrendingUp,
      description: "View detailed sales and performance metrics",
      action: () => navigate("/seller/analytics") 
    },
    { 
      title: "Messages", 
      icon: MessageSquare,
      description: "Check buyer inquiries and communications",
      action: () => navigate("/messages") 
    },
    { 
      title: "Notifications", 
      icon: Bell,
      description: "View your recent notifications and updates",
      action: () => navigate("/notifications") 
    },
    { 
      title: "Store Settings", 
      icon: Settings,
      description: "Customize your store preferences and policies",
      action: () => navigate("/seller/settings") 
    },
    { 
      title: "Help Center", 
      icon: HelpCircle,
      description: "Access support resources and documentation",
      action: () => navigate("/help") 
    },
  ];

  const resources = [
    { 
      title: "Seller Academy", 
      icon: BookOpen, 
      description: "Access comprehensive guides and tutorials to optimize your selling strategy",
      action: () => navigate("/tutorials") 
    },
    { 
      title: "Seller Community", 
      icon: Users, 
      description: "Connect with other sellers, share experiences, and get advice",
      action: () => navigate("/forum") 
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardHeader />
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

        <div className="grid gap-6 md:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Button 
                  variant="ghost" 
                  className="w-full h-auto p-6 flex flex-col items-center gap-4"
                  onClick={tool.action}
                >
                  <tool.icon className="h-8 w-8 text-shop-600" />
                  <div className="space-y-2 text-center">
                    <h3 className="font-semibold">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-shop-50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Seller Resources</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enhance your selling experience with these valuable resources
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {resources.map((resource) => (
              <Card key={resource.title} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <Button 
                    variant="ghost" 
                    className="w-full h-auto p-6 flex flex-col items-center gap-4"
                    onClick={resource.action}
                  >
                    <resource.icon className="h-8 w-8 text-shop-600" />
                    <div className="space-y-2 text-center">
                      <h3 className="font-semibold">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
