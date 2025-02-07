
import { DashboardLayout } from "@/components/DashboardLayout";
import { WelcomeSection } from "@/components/seller-dashboard/WelcomeSection";
import { QuickAccessGrid } from "@/components/seller-dashboard/QuickAccessGrid";
import { StatCards } from "@/components/seller-dashboard/StatCards";
import { SalesChart } from "@/components/seller-dashboard/SalesChart";
import { MonitoringSection } from "@/components/seller-dashboard/MonitoringSection";

export default function SellerDashboard() {
  return (
    <DashboardLayout requiredRole="seller">
      <div className="space-y-8">
        <WelcomeSection />
        <QuickAccessGrid />
        <div className="grid gap-6">
          <StatCards />
          <SalesChart />
          <MonitoringSection />
        </div>
      </div>
    </DashboardLayout>
  );
}
