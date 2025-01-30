import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DollarSign, Package, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function SellerDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const stats = [
    {
      title: "Total Sales",
      value: "$1,234",
      icon: DollarSign,
      description: "Total earnings this month",
    },
    {
      title: "Active Listings",
      value: "23",
      icon: Package,
      description: "Products currently listed",
    },
    {
      title: "Views",
      value: "845",
      icon: TrendingUp,
      description: "Product views this week",
    },
    {
      title: "Customers",
      value: "15",
      icon: Users,
      description: "Unique buyers",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-shop-800">Seller Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-shop-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-shop-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-shop-800">{stat.value}</div>
                <p className="text-xs text-shop-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-shop-600">No recent orders to display.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-shop-600">No performance data available yet.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}