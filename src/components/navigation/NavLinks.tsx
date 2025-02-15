
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { mainNavItems } from "@/config/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface NavLinksProps {
  className?: string;
}

export function NavLinks({ className }: NavLinksProps) {
  const location = useLocation();
  
  return (
    <NavigationMenu className={cn("flex gap-6", className)}>
      <NavigationMenuList>
        {mainNavItems.map((item) => (
          <NavigationMenuItem key={item.path}>
            {item.children ? (
              <>
                <NavigationMenuTrigger className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}>
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
                              location.pathname === child.path && "bg-accent"
                            )}
                          >
                            {child.icon && <child.icon className="h-4 w-4 mb-2" />}
                            <div className="text-sm font-medium leading-none">{child.name}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path 
                    ? "text-primary" 
                    : "text-muted-foreground",
                  "relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100",
                  location.pathname === item.path && "after:scale-x-100"
                )}
              >
                {item.name}
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
