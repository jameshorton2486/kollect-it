import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, DollarSign, Activity } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // Fetch users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      return {
        usersCount: usersCount || 0,
        productsCount: productsCount || 0,
        revenue: 0, // Placeholder for future implementation
        activeUsers: 0, // Placeholder for future implementation
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
    { title: "Total Users", value: stats?.usersCount || 0, icon: Users },
    { title: "Total Products", value: stats?.productsCount || 0, icon: ShoppingBag },
    { title: "Total Revenue", value: `$${stats?.revenue || 0}`, icon: DollarSign },
    { title: "Active Users", value: stats?.activeUsers || 0, icon: Activity },
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
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-shop-800">Admin Dashboard</h1>
          <p className="text-shop-600 mt-2">Overview of your platform's performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card) => (
            <Card key={card.title}>
              <CardContent className="flex items-center p-6">
                <div className="bg-shop-100 p-3 rounded-lg">
                  <card.icon className="w-6 h-6 text-shop-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-shop-600">{card.title}</p>
                  <h3 className="text-2xl font-bold text-shop-800">{card.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity?.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="bg-shop-100 p-2 rounded-full">
                      <Activity className="w-4 h-4 text-shop-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-shop-800">
                        {activity.activity_type}
                      </p>
                      <p className="text-xs text-shop-500">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}