import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

interface ProductPerformance {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
    }
  });

  const { data: topProducts } = useQuery({
    queryKey: ["seller-top-products"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data: products } = await supabase
        .from("orders")
        .select(`
          product_id,
          products (name),
          total_amount
        `)
        .eq("seller_id", session.user.id);

      // Group and sum by product
      const productPerformance = products?.reduce((acc: Record<string, number>, order) => {
        const productName = order.products?.name || 'Unknown Product';
        acc[productName] = (acc[productName] || 0) + Number(order.total_amount);
        return acc;
      }, {});

      return Object.entries(productPerformance || {})
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    }
  });

  return (
    <div className="grid gap-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <p className="text-sm text-shop-600 mt-1">
              Monthly revenue and order trends
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

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Order Volume</CardTitle>
            <p className="text-sm text-shop-600">
              Monthly order distribution
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

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <p className="text-sm text-shop-600">
              Best performing products by revenue
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topProducts}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {topProducts?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}