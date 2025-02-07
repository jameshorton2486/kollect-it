
import { DashboardLayout } from "@/components/DashboardLayout";
import { SalesChart } from "@/components/seller-dashboard/SalesChart";
import { StatCards } from "@/components/seller-dashboard/StatCards";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SalesAnalytics() {
  const { data: salesData } = useQuery({
    queryKey: ["seller-sales-export"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data: orders } = await supabase
        .from("orders")
        .select(`
          id,
          created_at,
          total_amount,
          status,
          products (
            name
          )
        `)
        .eq("seller_id", session.user.id);

      return orders || [];
    }
  });

  const handleExport = () => {
    if (!salesData?.length) {
      toast.error("No data available to export");
      return;
    }

    const csvData = salesData.map(order => ({
      Date: new Date(order.created_at).toLocaleDateString(),
      Order_ID: order.id,
      Product: order.products?.name || 'Unknown Product',
      Amount: order.total_amount,
      Status: order.status
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    
    toast.success("Sales report downloaded successfully");
  };

  return (
    <DashboardLayout pageTitle="Sales Analytics">
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sales Analytics</h1>
          <Button
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
        <StatCards />
        <SalesChart />
      </div>
    </DashboardLayout>
  );
}
