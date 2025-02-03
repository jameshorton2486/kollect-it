import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { useState } from "react";
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
        !isAdmin && "max-w-[1600px] mx-auto"
      )}>
        <DashboardHeader
          showBackButton={showBackButton}
          pageTitle={pageTitle}
          isSearchFocused={isSearchFocused}
          setIsSearchFocused={setIsSearchFocused}
          handleSearch={handleSearch}
        />

        {/* Normal user navigation - Only show for non-admin users */}
        {!isAdmin && <DashboardNavigation />}

        <div className="flex-1 px-2 md:px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}