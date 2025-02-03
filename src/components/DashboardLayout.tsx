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

      return roles?.some(r => r.role === 'admin') || false;
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
        <div className="hidden md:block w-64 flex-shrink-0 transition-all duration-300">
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
              className="fixed top-4 left-4 z-50 md:hidden hover:bg-white/10 transition-colors duration-200 rounded-full shadow-md"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <DashboardSidebar />
          </SheetContent>
        </Sheet>
      )}

      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        !isAdmin && "container mx-auto"
      )}>
        <div className="sticky top-0 z-10 bg-[#1A1F2C] text-white shadow-lg transition-shadow duration-300">
          <div className="container mx-auto">
            <div className="flex items-center justify-between gap-4 h-20 px-6">
              <div className="flex items-center gap-4">
                {showBackButton && (
                  <Button 
                    variant="ghost" 
                    size="lg"
                    onClick={() => navigate(-1)}
                    className="group mr-2 hover:bg-white/10 transition-all duration-200 rounded-full"
                  >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
                  </Button>
                )}

                {pageTitle && (
                  <h1 className="text-2xl font-semibold text-white animate-fade-in">{pageTitle}</h1>
                )}
              </div>
              
              <div className={cn(
                "relative flex-1 max-w-2xl transition-all duration-200",
                isSearchFocused ? 'scale-105' : ''
              )}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    type="search" 
                    placeholder="Search for art and collectibles..." 
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-gray-400
                             focus:bg-white/20 focus:border-white/30 transition-all duration-200 rounded-full
                             hover:bg-white/15"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                {isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-[#1A1F2C] rounded-lg shadow-lg
                                border border-white/20 animate-fade-in">
                    <div className="text-sm text-gray-400">
                      Popular searches: Vintage Art, Rare Coins, Comics...
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <Cart />
              </div>
            </div>
          </div>
        </div>

        {/* Normal user navigation - Only show for non-admin users */}
        {!isAdmin && (
          <nav className="border-b border-gray-200 bg-white shadow-sm sticky top-20 z-10">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between h-16 gap-6 overflow-x-auto">
                <Button
                  variant="ghost"
                  size="lg"
                  className="min-w-[120px] hover:bg-gray-100 transition-all duration-200 rounded-full
                           relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                           after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-shop-accent1 
                           hover:after:w-1/2 after:transition-all after:duration-200"
                  onClick={() => navigate('/buyer-dashboard')}
                >
                  Buyers
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="min-w-[120px] hover:bg-gray-100 transition-all duration-200 rounded-full
                           relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                           after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-shop-accent1 
                           hover:after:w-1/2 after:transition-all after:duration-200"
                  onClick={() => navigate('/seller-dashboard')}
                >
                  Sellers
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="min-w-[120px] hover:bg-gray-100 transition-all duration-200 rounded-full
                           relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                           after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-shop-accent1 
                           hover:after:w-1/2 after:transition-all after:duration-200"
                  onClick={() => navigate('/orders')}
                >
                  Orders
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="min-w-[120px] hover:bg-gray-100 transition-all duration-200 rounded-full
                           relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                           after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-shop-accent1 
                           hover:after:w-1/2 after:transition-all after:duration-200"
                  onClick={() => navigate('/settings')}
                >
                  Settings
                </Button>
              </div>
            </div>
          </nav>
        )}

        <div className="flex-1 container mx-auto px-6 py-8 animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}