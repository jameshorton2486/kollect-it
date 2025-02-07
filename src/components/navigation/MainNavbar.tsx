
import { Link } from "react-router-dom";
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

const mainNavItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Shop", path: "/categories" },
];

const userNavItems = [
  { label: "My Dashboard", path: "/buyer-dashboard" },
  { label: "Purchase History", path: "/purchase-history" },
  { label: "Settings", path: "/settings" },
];

export function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

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

  return (
    <nav className="bg-primary shadow-lg relative">
      <div className="max-w-7xl mx-auto">
        <div className="px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group hover:opacity-90 transition-opacity"
            >
              <h1 className="text-4xl font-extrabold text-white tracking-tight 
                            shadow-sm transition-all duration-200 group-hover:scale-105
                            sm:text-3xl md:text-4xl">
                Kollect-It
              </h1>
            </Link>

            {/* Primary Navigation */}
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-10 ml-12">
                <NavLinks 
                  items={mainNavItems} 
                  className="text-base font-semibold tracking-wide 
                            hover:text-white hover:scale-105 transition-all duration-200"
                />
                {session ? (
                  <Link 
                    to="/seller-dashboard" 
                    className="text-white hover:text-white/90 px-4 py-2 text-base font-semibold
                             tracking-wide transition-all duration-200 hover:scale-105"
                  >
                    Sell
                  </Link>
                ) : null}
              </div>
            )}

            {/* Secondary Navigation */}
            <div className="flex items-center space-x-6">
              {/* Desktop Search Bar */}
              {!isMobile && (
                <form onSubmit={handleSearch} className="relative w-64">
                  <Input
                    type="search"
                    placeholder="Search antiques..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 bg-white/10 text-white placeholder:text-white/70 
                             border-transparent focus:border-white rounded-full text-sm"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                </form>
              )}

              {/* Mobile Search Button */}
              {isMobile && !showMobileSearch && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileSearch(true)}
                  className="text-white/90 hover:text-white hover:bg-white/10"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}

              {/* Auth/User Actions */}
              {session ? (
                <div className="flex items-center space-x-6">
                  <Link to="/cart">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white/90 hover:text-white hover:bg-white/10 
                               transition-all duration-200"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </Link>
                  <UserDropdown items={userNavItems} />
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

              {/* Mobile Menu */}
              {isMobile && (
                <MobileMenu
                  mainItems={[...mainNavItems, { label: "Sell", path: "/seller-dashboard" }]}
                  adminItems={[]}
                  isOpen={isOpen}
                  onOpenChange={setIsOpen}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Overlay */}
      {isMobile && showMobileSearch && (
        <div className="absolute top-0 left-0 w-full h-24 bg-primary z-50 px-4 
                       flex items-center animate-fade-in">
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search antiques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white/10 text-white placeholder:text-white/70 
                        border-transparent focus:border-white rounded-full"
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileSearch(false)}
              className="text-white/90 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </form>
        </div>
      )}
    </nav>
  );
}
