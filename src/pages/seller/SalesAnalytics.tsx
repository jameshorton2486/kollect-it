import { DashboardLayout } from "@/components/DashboardLayout";
import { SalesChart } from "@/components/seller-dashboard/SalesChart";
import { StatCards } from "@/components/seller-dashboard/StatCards";

export default function SalesAnalytics() {
  return (
    <DashboardLayout pageTitle="Sales Analytics">
      <div className="container mx-auto py-8 space-y-8">
        <StatCards />
        <SalesChart />
      </div>
    </DashboardLayout>
  );
}