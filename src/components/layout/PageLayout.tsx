import { MainNavbar } from "@/components/navigation/MainNavbar";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Breadcrumbs, BreadcrumbItem } from "@/components/navigation/Breadcrumbs";

interface PageLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  className?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageLayout({ 
  children, 
  showBackButton = false, 
  className = "",
  breadcrumbs 
}: PageLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Generate default breadcrumbs based on current path if none provided
  const defaultBreadcrumbs = location.pathname.split('/')
    .filter(Boolean)
    .map((part, index, array) => ({
      label: part.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      href: index < array.length - 1 
        ? `/${array.slice(0, index + 1).join('/')}` 
        : undefined
    }));

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      
      <main className={`flex-1 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            {showBackButton && (
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            {(breadcrumbs || defaultBreadcrumbs.length > 0) && (
              <Breadcrumbs 
                items={breadcrumbs || defaultBreadcrumbs}
                className="ml-auto"
              />
            )}
          </div>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}