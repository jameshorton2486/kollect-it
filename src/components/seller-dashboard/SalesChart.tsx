import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 2780 },
  { month: 'May', sales: 1890 },
  { month: 'Jun', sales: 2390 },
];

export function SalesChart() {
  return (
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
  );
}