import { DashboardSidebar } from "./DashboardSidebar";
import { Cart } from "./cart/Cart";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-end mb-6">
            <Cart />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}