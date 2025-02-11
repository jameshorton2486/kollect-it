
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Cart } from "@/components/cart/Cart";

interface DashboardHeaderProps {
  showBackButton?: boolean;
  pageTitle?: string;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  handleSearch: (searchTerm: string) => void;
}

export function DashboardHeader({
  showBackButton = false,
  pageTitle,
  isSearchFocused,
  setIsSearchFocused,
  handleSearch,
}: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 bg-[#1A1F2C] text-white shadow-lg transition-shadow duration-300">
      <div className="w-full px-2 md:px-4">
        <div className="flex items-center justify-between gap-4 h-20">
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
  );
}
