import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, ShoppingCart, Package } from "lucide-react";

const mockData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 2780 },
  { month: 'May', sales: 1890 },
  { month: 'Jun', sales: 2390 },
];

const stats = [
  {
    title: "Total Revenue",
    value: "$12,345",
    icon: DollarSign,
    trend: "+12.5%",
  },
  {
    title: "Active Listings",
    value: "45",
    icon: Package,
    trend: "+5",
  },
  {
    title: "Orders",
    value: "28",
    icon: ShoppingCart,
    trend: "-2",
  },
  {
    title: "Growth",
    value: "+12.5%",
    icon: TrendingUp,
    trend: "+2.3%",
  },
];

export default function SalesAnalytics() {
  return (
    <DashboardLayout pageTitle="Sales Analytics">
      <div className="container mx-auto py-8">
        <div className="grid gap-6">
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-shop-600">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-[#008080]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-shop-800">{stat.value}</div>
                  <div className="text-xs mt-1 text-green-500">
                    {stat.trend} from last period
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockData}>
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
        </div>
      </div>
    </DashboardLayout>
  );
}