import { DashboardSidebar } from "./DashboardSidebar";
import { Cart } from "./cart/Cart";
import { Input } from "./ui/input";
import { Search, Menu, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  pageTitle?: string;
}

export function DashboardLayout({ 
  children, 
  showBackButton = false,
  pageTitle
}: DashboardLayoutProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: isAdmin } = useQuery({
    queryKey: ["user-role-admin"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      return roles?.some(r => r.role === "admin") || false;
    }
  });

  const handleSearch = (searchTerm: string) => {
    toast({
      title: "Search",
      description: `Searching for: ${searchTerm}`,
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar - Only show for admin users */}
      {isAdmin && (
        <div className="hidden md:block w-64 flex-shrink-0">
          <DashboardSidebar />
        </div>
      )}

      {/* Mobile Sidebar - Only show for admin users */}
      {isAdmin && (
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="fixed top-4 left-4 z-50 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <DashboardSidebar />
          </SheetContent>
        </Sheet>
      )}

      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen",
        !isAdmin && "container mx-auto" // Center content for non-admin users
      )}>
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="container mx-auto">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {showBackButton && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}

                {pageTitle && (
                  <h1 className="text-xl font-semibold text-shop-800">{pageTitle}</h1>
                )}
              </div>
              
              <div className={`relative flex-1 max-w-2xl transition-all duration-200 ${
                isSearchFocused ? 'scale-105' : ''
              }`}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    type="search" 
                    placeholder="Search for art and collectibles..." 
                    className="w-full pl-10 pr-4 py-2 border-2 focus:border-shop-accent1 transition-colors"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                {isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 bg-white mt-1 p-4 rounded-lg shadow-lg border border-gray-200 animate-fadeIn">
                    <div className="text-sm text-gray-500">
                      Popular searches: Vintage Art, Rare Coins, Comics...
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Cart />
              </div>
            </div>
          </div>
        </div>

        {/* Normal user navigation - Only show for non-admin users */}
        {!isAdmin && (
          <nav className="border-b border-gray-200 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16 gap-4 overflow-x-auto">
                <Button
                  variant="ghost"
                  className="min-w-[120px]"
                  onClick={() => navigate('/buyer-dashboard')}
                >
                  Buyer Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="min-w-[120px]"
                  onClick={() => navigate('/seller-dashboard')}
                >
                  Seller Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="min-w-[100px]"
                  onClick={() => navigate('/orders')}
                >
                  Orders
                </Button>
                <Button
                  variant="ghost"
                  className="min-w-[100px]"
                  onClick={() => navigate('/analytics')}
                >
                  Analytics
                </Button>
                <Button
                  variant="ghost"
                  className="min-w-[100px]"
                  onClick={() => navigate('/settings')}
                >
                  Settings
                </Button>
              </div>
            </div>
          </nav>
        )}

        <div className="flex-1 container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}