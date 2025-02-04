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

interface MobileMenuProps {
  mainItems: Array<{ label: string; path: string }>;
  adminItems: Array<{ label: string; path: string }>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const shopCategories = [
  { label: "Antiques", path: "/categories/antiques" },
  { label: "Collectibles", path: "/categories/collectibles" },
  { label: "Art", path: "/categories/art" },
  { label: "Furniture", path: "/categories/furniture" },
  { label: "Jewelry", path: "/categories/jewelry" },
  { label: "Books", path: "/categories/books" },
];

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
            if (item.label === "Shop") {
              return (
                <Accordion key={item.label} type="single" collapsible>
                  <AccordionItem value="shop">
                    <AccordionTrigger className="text-lg font-medium">
                      Shop
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col space-y-2 pl-4">
                        {shopCategories.map((category) => (
                          <Link
                            key={category.path}
                            to={category.path}
                            onClick={() => onOpenChange(false)}
                            className="text-sm py-2 hover:text-primary flex items-center"
                          >
                            <ChevronRight className="h-4 w-4 mr-2" />
                            {category.label}
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
                className="text-lg font-medium"
              >
                {item.label}
              </Link>
            );
          })}
          
          <div className="pt-4 border-t">
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