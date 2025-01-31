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
  Settings,
  HelpCircle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();

    // Show onboarding tooltip for first-time users
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      toast({
        title: "Welcome to your Seller Dashboard! 🎉",
        description: "Click the help icon to take a tour of your dashboard features.",
        duration: 5000,
      });
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
  }, [navigate, toast]);

  const stats = [
    {
      title: "Total Revenue",
      value: "$12,345",
      icon: DollarSign,
      description: "Total earnings this month",
      trend: "+12.5%",
      trendDirection: "up",
    },
    {
      title: "Active Listings",
      value: "45",
      icon: Package,
      description: "Products currently listed",
      trend: "+5",
      trendDirection: "up",
    },
    {
      title: "Orders",
      value: "28",
      icon: ShoppingCart,
      description: "Orders this month",
      trend: "-2",
      trendDirection: "down",
    },
    {
      title: "Sales Growth",
      value: "+12.5%",
      icon: TrendingUp,
      description: "Compared to last month",
      trend: "+2.3%",
      trendDirection: "up",
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
      <div className="space-y-8 animate-fadeIn">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Seller Dashboard", href: "/seller-dashboard" }
          ]} 
        />

        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-shop-800 mb-2">Seller Dashboard</h1>
            <p className="text-shop-600">Overview of your sales and performance metrics</p>
          </div>
          <Button 
            onClick={() => toast({
              title: "Need Help?",
              description: "Click through the tooltips to learn about your dashboard features.",
            })}
            variant="ghost"
            size="icon"
            className="relative group"
          >
            <HelpCircle className="h-6 w-6" />
            <span className="absolute hidden group-hover:block right-0 top-full mt-2 w-48 p-2 bg-white text-sm text-shop-600 rounded-md shadow-lg">
              Click for dashboard tour
            </span>
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card 
              key={stat.title} 
              className="hover:shadow-lg transition-shadow group"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-shop-600">
                  {stat.title}
                </CardTitle>
                <div className="relative group">
                  <stat.icon className="h-4 w-4 text-shop-600" />
                  <div className="absolute hidden group-hover:block right-0 top-full mt-2 w-48 p-2 bg-white text-xs text-shop-600 rounded-md shadow-lg z-10">
                    {stat.description}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-shop-800">{stat.value}</div>
                <div className={`text-xs mt-1 ${
                  stat.trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.trend} from last period
                </div>
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
              className="h-24 flex-col gap-2 hover:bg-shop-50 transition-all duration-200 group"
            >
              <action.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span>{action.title}</span>
            </Button>
          ))}
        </div>

        {/* Sales Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Monthly Sales Performance</CardTitle>
            <Info className="h-4 w-4 text-shop-600 cursor-help" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" className="text-shop-200" />
                  <XAxis dataKey="month" className="text-shop-600" />
                  <YAxis className="text-shop-600" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity and Inventory */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-shop-600">No recent orders to display.</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-shop-600">No low stock items to display.</p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-shop-50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-shop-800 mb-2">
              Optimize Your Listings
            </h3>
            <p className="text-shop-600 mb-4">
              Complete your product descriptions and add high-quality images to increase your sales.
            </p>
            <Button 
              onClick={() => navigate("/products")}
              className="group"
            >
              <span>Manage Products</span>
              <Package className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}