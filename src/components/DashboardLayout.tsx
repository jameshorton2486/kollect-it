import { DashboardSidebar } from "./DashboardSidebar";
import { Cart } from "./cart/Cart";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                type="search" 
                placeholder="Search for art and collectibles..." 
                className="pl-10 w-full"
              />
            </div>
            <Cart />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}