
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavLinks } from "./NavLinks";
import { UserDropdown } from "./UserDropdown";
import { MobileMenu } from "./MobileMenu";
import { SignUpModal } from "@/components/auth/SignUpModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mainNavItems, userNavItems } from "@/config/navigation";

interface UserNavItem {
  label: string;
  path: string;
  icon?: any;
}

const convertToUserNavItems = (items: typeof userNavItems): UserNavItem[] => {
  return items.map(item => ({
    label: item.name,
    path: item.path,
    icon: item.icon
  }));
};

export function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
    if (isMobile) {
      setShowMobileSearch(false);
    }
  };

  const handleNavigation = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const userDropdownItems = convertToUserNavItems(userNavItems);
  const mainMenuItems = mainNavItems.map(item => ({
    label: item.name,  // Change back to label to match the NavLinks interface
    path: item.path
  }));

  return (
    <nav className="bg-primary shadow-lg relative" role="navigation" aria-label="Main navigation">
      {/* Skip link for keyboard navigation */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-primary px-4 py-2 rounded-md">
        Skip to main content
      </a>
      
      <div className="max-w-7xl mx-auto">
        <div className="px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group hover:opacity-90 transition-opacity"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                }
              }}
              aria-label="Home"
            >
              <h1 className="text-4xl font-extrabold text-white tracking-tight 
                            shadow-sm transition-all duration-200 group-hover:scale-105
                            sm:text-3xl md:text-4xl">
                Kollect-It
              </h1>
            </Link>

            {!isMobile && (
              <div className="hidden md:flex items-center space-x-10 ml-12">
                <NavLinks 
                  items={mainMenuItems}
                  className="text-base font-semibold tracking-wide 
                            hover:text-white hover:scale-105 transition-all duration-200"
                />
                {session && (
                  <Button 
                    variant="ghost"
                    className="text-white hover:text-white/90 px-4 py-2 text-base font-semibold
                             tracking-wide transition-all duration-200 hover:scale-105"
                    onClick={() => handleNavigation('/seller-dashboard')}
                  >
                    Sell
                  </Button>
                )}
              </div>
            )}

            <div className="flex items-center space-x-6">
              {!isMobile && (
                <form onSubmit={handleSearch} className="relative w-64" role="search">
                  <Input
                    type="search"
                    placeholder="Search antiques..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 bg-white/10 text-white placeholder:text-white/70 
                             border-transparent focus:border-white rounded-full text-sm"
                    aria-label="Search antiques"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" aria-hidden="true" />
                </form>
              )}

              {isMobile && !showMobileSearch && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileSearch(true)}
                  className="text-white/90 hover:text-white hover:bg-white/10"
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}

              {session ? (
                <div className="flex items-center space-x-6">
                  <Link to="/cart" aria-label="Shopping cart">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white/90 hover:text-white hover:bg-white/10 
                               transition-all duration-200"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </Link>
                  <UserDropdown items={userDropdownItems} />
                </div>
              ) : (
                <div className="flex items-center space-x-6">
                  <Link 
                    to="/auth" 
                    className="text-white/90 hover:text-white text-sm font-medium 
                             transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <SignUpModal />
                </div>
              )}

              {isMobile && (
                <MobileMenu
                  mainItems={mainMenuItems}
                  adminItems={[]}
                  isOpen={isOpen}
                  onOpenChange={setIsOpen}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {isMobile && showMobileSearch && (
        <div className="absolute top-0 left-0 w-full h-24 bg-primary z-50 px-4 
                       flex items-center animate-fade-in" role="search">
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search antiques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white/10 text-white placeholder:text-white/70 
                        border-transparent focus:border-white rounded-full"
              autoFocus
              aria-label="Search antiques"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileSearch(false)}
              className="text-white/90 hover:text-white hover:bg-white/10"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </Button>
          </form>
        </div>
      )}
    </nav>
  );
}
