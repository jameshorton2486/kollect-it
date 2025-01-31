import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Breadcrumbs } from "@/components/ui/breadcrumb";

export function DashboardHeader() {
  const { toast } = useToast();

  return (
    <div className="space-y-8 animate-fadeIn">
      <Breadcrumbs 
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Seller Dashboard", href: "/seller-dashboard" }
        ]} 
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-shop-800 mb-2">Seller Dashboard</h1>
          <p className="text-shop-600 max-w-2xl">
            Take control of your sales and listings with a suite of tools designed for efficiency. 
            From tracking performance metrics to managing product inventories, you'll have everything 
            you need to grow your business.
          </p>
        </div>
        <Button 
          onClick={() => toast({
            title: "Need Help?",
            description: "Click through the tooltips to learn about your dashboard features.",
          })}
          variant="ghost"
          size="icon"
          className="relative group"
        >
          <HelpCircle className="h-6 w-6" />
          <span className="absolute hidden group-hover:block right-0 top-full mt-2 w-48 p-2 bg-white text-sm text-shop-600 rounded-md shadow-lg">
            Click for dashboard tour
          </span>
        </Button>
      </div>
    </div>
  );
}