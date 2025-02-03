import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MobileMenuProps {
  mainItems: Array<{ label: string; path: string }>;
  adminItems: Array<{ label: string; path: string }>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ mainItems, adminItems, isOpen, onOpenChange }: MobileMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          {mainItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => onOpenChange(false)}
              className="text-lg font-medium"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4">
            <h3 className="font-semibold mb-2">Admin</h3>
            {adminItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onOpenChange(false)}
                className="block py-2 text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}