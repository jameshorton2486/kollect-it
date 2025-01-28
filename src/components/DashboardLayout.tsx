import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-shop-50">
      <DashboardSidebar />
      <main className="pl-64 min-h-screen">
        <div className="p-8 animate-fadeIn">{children}</div>
      </main>
    </div>
  );
}