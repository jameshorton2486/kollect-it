
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format, startOfWeek, startOfMonth, addDays, addWeeks, addMonths, isSameDay, isSameWeek, isSameMonth } from 'date-fns';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  products: {
    id: string;
    name: string;
    category_id: string;
    price: number;
  };
}

interface SalesChartProps {
  data: Order[];
  chartType: "area" | "bar" | "pie";
  timeFrame: "daily" | "weekly" | "monthly";
  dateRange: {
    from: Date;
    to: Date;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function SalesChart({ data, chartType, timeFrame, dateRange }: SalesChartProps) {
  const aggregateData = () => {
    const aggregated = new Map();
    
    data.forEach(order => {
      const date = new Date(order.created_at);
      let key;
      
      switch (timeFrame) {
        case 'weekly':
          key = format(startOfWeek(date), 'yyyy-MM-dd');
          break;
        case 'monthly':
          key = format(startOfMonth(date), 'yyyy-MM');
          break;
        default:
          key = format(date, 'yyyy-MM-dd');
      }

      if (!aggregated.has(key)) {
        aggregated.set(key, {
          date: key,
          sales: 0,
          orders: 0
        });
      }
      
      const current = aggregated.get(key);
      current.sales += order.total_amount;
      current.orders += 1;
    });

    return Array.from(aggregated.values());
  };

  const aggregateByProduct = () => {
    const productSales = new Map();
    
    data.forEach(order => {
      const productName = order.products?.name || 'Unknown Product';
      const currentAmount = productSales.get(productName) || 0;
      productSales.set(productName, currentAmount + order.total_amount);
    });

    return Array.from(productSales.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const chartData = chartType === 'pie' ? aggregateByProduct() : aggregateData();

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tickFormatter={(value) => {
                  switch (timeFrame) {
                    case 'weekly':
                      return `Week ${format(new Date(value), 'w')}`;
                    case 'monthly':
                      return format(new Date(value), 'MMM yyyy');
                    default:
                      return format(new Date(value), 'MMM d');
                  }
                }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Sales']}
                labelFormatter={(label) => {
                  switch (timeFrame) {
                    case 'weekly':
                      return `Week of ${format(new Date(label), 'MMM d, yyyy')}`;
                    case 'monthly':
                      return format(new Date(label), 'MMMM yyyy');
                    default:
                      return format(new Date(label), 'MMM d, yyyy');
                  }
                }}
              />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tickFormatter={(value) => {
                  switch (timeFrame) {
                    case 'weekly':
                      return `Week ${format(new Date(value), 'w')}`;
                    case 'monthly':
                      return format(new Date(value), 'MMM yyyy');
                    default:
                      return format(new Date(value), 'MMM d');
                  }
                }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Sales']}
                labelFormatter={(label) => {
                  switch (timeFrame) {
                    case 'weekly':
                      return `Week of ${format(new Date(label), 'MMM d, yyyy')}`;
                    case 'monthly':
                      return format(new Date(label), 'MMMM yyyy');
                    default:
                      return format(new Date(label), 'MMM d, yyyy');
                  }
                }}
              />
              <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="w-full">
      {renderChart()}
    </div>
  );
}
