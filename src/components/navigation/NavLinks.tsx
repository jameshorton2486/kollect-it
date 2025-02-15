
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface NavLinksProps {
  className?: string;
}

export function NavLinks({ className }: NavLinksProps) {
  const location = useLocation();
  
  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/featured', label: 'Featured' },
  ];

  return (
    <nav className={cn("flex gap-6", className)}>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          to={href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            location.pathname === href 
              ? "text-primary" 
              : "text-muted-foreground",
            "relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100",
            location.pathname === href && "after:scale-x-100"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
