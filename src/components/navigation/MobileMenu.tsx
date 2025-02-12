
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { mainNavItems, adminNavItems } from "@/config/navigation";

interface MobileMenuProps {
  mainItems: Array<{ name: string; path: string }>;
  adminItems: Array<{ name: string; path: string }>;
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
          {mainItems.map((item) => {
            if (item.name === "Shop") {
              return (
                <Accordion key={item.name} type="single" collapsible>
                  <AccordionItem value="shop">
                    <AccordionTrigger className="text-lg font-medium">
                      Shop
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col space-y-2 pl-4">
                        {mainNavItems
                          .find(nav => nav.name === "Shop")
                          ?.children?.map((category) => (
                            <Link
                              key={category.path}
                              to={category.path}
                              onClick={() => onOpenChange(false)}
                              className="text-sm py-2 hover:text-primary flex items-center"
                            >
                              <ChevronRight className="h-4 w-4 mr-2" />
                              {category.name}
                            </Link>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onOpenChange(false)}
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            );
          })}
          
          {adminItems.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Admin</h3>
              {adminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onOpenChange(false)}
                  className="block py-2 text-sm hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
