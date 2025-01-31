import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/seller-dashboard/DashboardHeader";
import { StatCards } from "@/components/seller-dashboard/StatCards";
import { SalesChart } from "@/components/seller-dashboard/SalesChart";
import { QuickActions } from "@/components/seller-dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SellerDashboard() {
  const navigate = useNavigate();

  const resources = [
    { title: "Seller Tutorials", icon: BookOpen, action: () => navigate("/tutorials") },
    { title: "Community Forum", icon: Users, action: () => navigate("/forum") },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardHeader />
        <StatCards />
        <QuickActions />
        <SalesChart />
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <p className="text-sm text-shop-600">
                Keep your order process running smoothly with real-time updates on order status, 
                customer details, and return management. Provide a seamless buying experience to 
                your customers.
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-shop-600">No recent orders to display.</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
              <p className="text-sm text-shop-600">
                Simplify your product management with tools for creating detailed listings, managing 
                inventory levels, and updating product information seamlessly. Stay on top of your 
                inventory to never miss a sale.
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-shop-600">No low stock items to display.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-shop-50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-shop-800 mb-2">
              Explore Additional Resources
            </h3>
            <p className="text-shop-600 mb-4">
              Access tutorials, FAQs, and community forums for tips on maximizing your success as a 
              seller. Connect with other sellers and learn best practices to enhance your selling 
              strategy.
            </p>
            <div className="flex gap-4">
              {resources.map((resource) => (
                <Button 
                  key={resource.title}
                  onClick={resource.action}
                  className="group"
                  variant="outline"
                >
                  <resource.icon className="mr-2 h-4 w-4" />
                  <span>{resource.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}