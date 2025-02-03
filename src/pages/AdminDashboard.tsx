import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, DollarSign, Activity, TrendingUp } from "lucide-react";

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
      color: "bg-shop-accent3/10 text-shop-accent3"
    },
    { 
      title: "Total Products", 
      value: stats?.productsCount || 0, 
      icon: ShoppingBag,
      color: "bg-shop-accent2/10 text-shop-accent2"
    },
    { 
      title: "Total Revenue", 
      value: `$${stats?.revenue || 0}`, 
      icon: DollarSign,
      color: "bg-green-100 text-green-600"
    },
    { 
      title: "Active Users", 
      value: stats?.activeUsers || 0, 
      icon: Activity,
      color: "bg-purple-100 text-purple-600"
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
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-shop-800">Admin Dashboard</h1>
          <p className="text-shop-600 max-w-3xl">
            Overview of your platform's performance. Monitor key metrics, user activity, and manage your collectibles marketplace effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card) => (
            <Card 
              key={card.title}
              className="hover:shadow-lg transition-all duration-300 animate-scale-in"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-shop-600">{card.title}</p>
                  <h3 className="text-2xl font-bold text-shop-800 mt-1">{card.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="border-b border-gray-100">
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

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-shop-800">Recent Activity</CardTitle>
              <p className="text-sm text-shop-600">Latest platform interactions</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {recentActivity?.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
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