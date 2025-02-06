
import { Link } from "react-router-dom";
import { MainNavbar } from "@/components/navigation/MainNavbar";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  className?: string;
}

const navigationItems = [
  { label: "All Products", path: "/products" },
  { label: "Categories", path: "/categories" },
  { label: "Blog", path: "/blog" },
  { label: "Featured", path: "/featured" },
  { label: "Popular", path: "/popular" },
];

export function PublicLayout({ children, className = "" }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      
      <div className="flex-1 flex">
        {/* Desktop Navigation Sidebar */}
        <div className="hidden md:block w-64 bg-black border-r border-black/20">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white nav-brand mb-4">Browse</h2>
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "block px-4 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors",
                    "hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation Sidebar */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="fixed top-20 left-4 z-40"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 pt-20 bg-black">
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "block px-4 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors",
                      "hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <main className={cn(
          "flex-1 max-w-[1600px] mx-auto px-2 md:px-4 py-6",
          className
        )}>
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
