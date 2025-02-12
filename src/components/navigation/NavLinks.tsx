
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface NavItem {
  name: string;
  path: string;
  icon?: any;
  children?: NavItem[];
}

interface NavLinksProps {
  items: NavItem[];
  className?: string;
}

export function NavLinks({ items, className = "" }: NavLinksProps) {
  const location = useLocation();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => {
          if (item.children) {
            return (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuTrigger className="text-white hover:text-white/80">
                  {item.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {item.children.map((child) => (
                      <li key={child.path}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={child.path}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              location.pathname === child.path
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">
                              {child.name}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "text-white hover:text-white/80 px-3 py-2 transition-colors duration-200",
                  location.pathname === item.path ? "opacity-100" : "opacity-80",
                  className
                )}
                onClick={(e) => {
                  if (location.pathname === item.path) {
                    e.preventDefault();
                  }
                }}
              >
                {item.name}
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
