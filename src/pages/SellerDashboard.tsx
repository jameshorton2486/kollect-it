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
  Info,
  BookOpen,
  Users
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
      description: "Track your earnings and revenue growth over time",
      trend: "+12.5%",
      trendDirection: "up",
    },
    {
      title: "Active Listings",
      value: "45",
      icon: Package,
      description: "Monitor your active product listings and inventory levels",
      trend: "+5",
      trendDirection: "up",
    },
    {
      title: "Orders",
      value: "28",
      icon: ShoppingCart,
      description: "Keep track of new and pending orders this month",
      trend: "-2",
      trendDirection: "down",
    },
    {
      title: "Sales Growth",
      value: "+12.5%",
      icon: TrendingUp,
      description: "Analyze your month-over-month sales performance",
      trend: "+2.3%",
      trendDirection: "up",
    },
  ];

  const quickActions = [
    { 
      title: "Add New Product", 
      icon: Plus, 
      description: "Create new product listings with our streamlined tools",
      action: () => navigate("/products/new") 
    },
    { 
      title: "Manage Inventory", 
      icon: List, 
      description: "Update and organize your product inventory efficiently",
      action: () => navigate("/products") 
    },
    { 
      title: "View Analytics", 
      icon: BarChart3, 
      description: "Gain insights from detailed performance metrics",
      action: () => navigate("/sales-analytics") 
    },
    { 
      title: "Settings", 
      icon: Settings, 
      description: "Customize your seller profile and preferences",
      action: () => navigate("/settings") 
    },
  ];

  const resources = [
    { title: "Seller Tutorials", icon: BookOpen, action: () => navigate("/tutorials") },
    { title: "Community Forum", icon: Users, action: () => navigate("/forum") },
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
            <p className="text-shop-600 max-w-2xl">
              Take control of your sales and listings with a suite of tools designed for efficiency. 
              From tracking performance metrics to managing product inventories, you'll have everything 
              you need to grow your business.
            </p>
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
        <div>
          <h2 className="text-2xl font-semibold text-shop-800 mb-4">
            Discover deep insights into your sales data
          </h2>
          <p className="text-shop-600 mb-6">
            Understand customer buying patterns, monitor sales progress, and uncover new opportunities 
            for growth with detailed metrics. Visualize your performance and make data-driven decisions 
            to optimize your business strategy.
          </p>
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
        </div>

        {/* Sales Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sales Performance Overview</CardTitle>
              <p className="text-sm text-shop-600 mt-1">
                Visualize your sales data in real-time with charts and reports that highlight your 
                top-performing products, revenue streams, and sales channels. Track trends and identify 
                opportunities for growth.
              </p>
            </div>
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

        {/* Resources Section */}
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

        {/* Additional Resources */}
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