import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SocialShareAnalytics } from "./SocialShareAnalytics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader } from "@/components/ui/loader";

export function AnalyticsDashboard() {
  const { data: salesData, isLoading: loadingSales } = useQuery({
    queryKey: ["sales-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("created_at, total_amount")
        .order("created_at");

      if (error) throw error;

      // Process data for visualization
      return data.map(order => ({
        date: new Date(order.created_at).toLocaleDateString(),
        amount: order.total_amount
      }));
    },
  });

  const { data: userStats, isLoading: loadingUsers } = useQuery({
    queryKey: ["user-analytics"],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from("profiles")
        .select("created_at");

      if (error) throw error;

      return {
        totalUsers: users.length,
        newUsersThisMonth: users.filter(user => {
          const userDate = new Date(user.created_at);
          const thisMonth = new Date();
          return userDate.getMonth() === thisMonth.getMonth() &&
                 userDate.getFullYear() === thisMonth.getFullYear();
        }).length
      };
    },
  });

  if (loadingSales || loadingUsers) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-shop-800">Platform Analytics</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{userStats?.totalUsers}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-lg font-semibold text-green-600">
                +{userStats?.newUsersThisMonth} this month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <SocialShareAnalytics />

      <Card>
        <CardHeader>
          <CardTitle>Platform Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Server Status</p>
                <p className="text-2xl font-bold text-green-600">Operational</p>
              </div>
              <div>
                <p className="text-sm font-medium">Response Time</p>
                <p className="text-2xl font-bold">124ms</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold">99.9%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Active Sessions</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}