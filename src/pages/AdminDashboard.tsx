import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, DollarSign, Activity, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      return {
        usersCount: usersCount || 0,
        productsCount: productsCount || 0,
        revenue: 0,
        activeUsers: 0,
      };
    },
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const statsCards = [
    { 
      title: "Total Users", 
      value: stats?.usersCount || 0, 
      icon: Users,
      color: "bg-shop-accent3/10 text-shop-accent3",
      trend: "+12%"
    },
    { 
      title: "Total Products", 
      value: stats?.productsCount || 0, 
      icon: ShoppingBag,
      color: "bg-shop-accent2/10 text-shop-accent2",
      trend: "+8%"
    },
    { 
      title: "Total Revenue", 
      value: `$${stats?.revenue || 0}`, 
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
      trend: "+15%"
    },
    { 
      title: "Active Users", 
      value: stats?.activeUsers || 0, 
      icon: Activity,
      color: "bg-purple-100 text-purple-600",
      trend: "+5%"
    },
  ];

  // Sample data for the chart
  const chartData = [
    { name: "Jan", users: 400 },
    { name: "Feb", users: 300 },
    { name: "Mar", users: 600 },
    { name: "Apr", users: 800 },
    { name: "May", users: 700 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col gap-4 bg-gradient-to-r from-shop-accent1 to-shop-accent1/90 text-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Admin Dashboard</h1>
          <p className="text-white/90 max-w-3xl text-lg">
            Monitor key metrics, user activity, and manage your collectibles marketplace effectively.
          </p>
          <div className="flex gap-4 mt-4">
            <Button 
              size="lg"
              className="bg-white text-shop-accent1 hover:bg-white/90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              View Reports
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 transition-all duration-300"
            >
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card) => (
            <Card 
              key={card.title}
              className="hover:shadow-lg transition-all duration-300 animate-scale-in transform hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1 text-green-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{card.trend}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-shop-600">{card.title}</p>
                  <h3 className="text-2xl font-bold text-shop-800 mt-1">{card.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Chart */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="border-b border-gray-100 p-6">
              <CardTitle className="text-xl font-semibold text-shop-800">User Growth</CardTitle>
              <p className="text-sm text-shop-600">Monthly user acquisition trends</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        background: '#fff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar 
                      dataKey="users" 
                      fill="#0FA0CE"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="border-b border-gray-100 p-6">
              <CardTitle className="text-xl font-semibold text-shop-800">Recent Activity</CardTitle>
              <p className="text-sm text-shop-600">Latest platform interactions</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity?.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 transform hover:-translate-x-1"
                  >
                    <div className="bg-shop-accent3/10 p-2 rounded-full">
                      <Activity className="w-4 h-4 text-shop-accent3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-shop-800 truncate">
                        {activity.activity_type}
                      </p>
                      <p className="text-xs text-shop-600">
                        {new Date(activity.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-shop-accent3/10 hover:text-shop-accent3"
                    >
                      View
                    </Button>
                  </div>
                ))}
                {(!recentActivity || recentActivity.length === 0) && (
                  <div className="text-center py-8 text-shop-600">
                    No recent activity to display
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}