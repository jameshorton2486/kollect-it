
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  label: string;
  path: string;
}

interface NavLinksProps {
  items: NavItem[];
  className?: string;
}

export function NavLinks({ items, className = "" }: NavLinksProps) {
  const location = useLocation();

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`text-white hover:text-white/80 px-3 py-2 transition-colors duration-200 
                     ${location.pathname === item.path ? "opacity-100" : "opacity-80"} 
                     ${className}`}
          onClick={(e) => {
            // Prevent default only if we're already on the same route
            if (location.pathname === item.path) {
              e.preventDefault();
            }
          }}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
