import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

export function SalesChart() {
  const { data: salesData } = useQuery({
    queryKey: ["seller-sales"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data: orders } = await supabase
        .from("orders")
        .select("created_at, total_amount")
        .eq("seller_id", session.user.id);

      // Group orders by month
      const monthlyData = orders?.reduce((acc: Record<string, SalesData>, order) => {
        const month = new Date(order.created_at).toLocaleString('default', { month: 'short' });
        if (!acc[month]) {
          acc[month] = { month, sales: 0, orders: 0 };
        }
        acc[month].sales += order.total_amount;
        acc[month].orders += 1;
        return acc;
      }, {}) || {};

      return Object.values(monthlyData);
    },
    placeholderData: [
      { month: 'Jan', sales: 4000, orders: 40 },
      { month: 'Feb', sales: 3000, orders: 30 },
      { month: 'Mar', sales: 5000, orders: 50 },
      { month: 'Apr', sales: 2780, orders: 28 },
      { month: 'May', sales: 1890, orders: 19 },
      { month: 'Jun', sales: 2390, orders: 24 },
    ]
  });

  return (
    <div className="grid gap-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Sales Performance Overview</CardTitle>
            <p className="text-sm text-shop-600 mt-1">
              Track your revenue trends and identify growth patterns
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
                  stroke="#008080" 
                  fill="#008080" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Order Volume Analysis</CardTitle>
          <p className="text-sm text-shop-600">
            Monitor your monthly order volumes
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#008080" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}