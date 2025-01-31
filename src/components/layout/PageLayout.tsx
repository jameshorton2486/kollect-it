import { MainNavbar } from "@/components/navigation/MainNavbar";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  className?: string;
}

export function PageLayout({ children, showBackButton = false, className = "" }: PageLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      
      <main className={`flex-1 ${className}`}>
        {showBackButton && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        )}
        {children}
      </main>

      <Footer />
    </div>
  );
}