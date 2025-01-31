import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Plus,
  List,
  BarChart3,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Sample data for the chart
const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 2780 },
  { month: 'May', sales: 1890 },
  { month: 'Jun', sales: 2390 },
];

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
      title: "Total Revenue",
      value: "$12,345",
      icon: DollarSign,
      description: "Total earnings this month",
    },
    {
      title: "Active Listings",
      value: "45",
      icon: Package,
      description: "Products currently listed",
    },
    {
      title: "Orders",
      value: "28",
      icon: ShoppingCart,
      description: "Orders this month",
    },
    {
      title: "Sales Growth",
      value: "+12.5%",
      icon: TrendingUp,
      description: "Compared to last month",
    },
  ];

  const quickActions = [
    { title: "Add New Product", icon: Plus, action: () => navigate("/products/new") },
    { title: "Manage Inventory", icon: List, action: () => navigate("/products") },
    { title: "View Analytics", icon: BarChart3, action: () => navigate("/sales-analytics") },
    { title: "Settings", icon: Settings, action: () => navigate("/settings") },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-shop-800">Seller Dashboard</h1>
          <p className="text-shop-600 mt-2">Overview of your sales and performance metrics</p>
        </div>
        
        {/* Stats Cards */}
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

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              onClick={action.action}
              variant="outline"
              className="h-24 flex-col gap-2 hover:bg-shop-50"
            >
              <action.icon className="h-6 w-6" />
              <span>{action.title}</span>
            </Button>
          ))}
        </div>

        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#6366f1" 
                    fill="#818cf8" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity and Inventory */}
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
              <CardTitle>Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-shop-600">No low stock items to display.</p>
            </CardContent>
          </Card>
        </div>

        {/* Customer Testimonials */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-shop-600">No testimonials to display yet.</p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-shop-50">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-shop-800 mb-2">
              Optimize Your Listings
            </h3>
            <p className="text-shop-600 mb-4">
              Complete your product descriptions and add high-quality images to increase your sales.
            </p>
            <Button onClick={() => navigate("/products")}>
              Manage Products
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}