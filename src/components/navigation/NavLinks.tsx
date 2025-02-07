
import { Link } from "react-router-dom";

interface NavItem {
  label: string;
  path: string;
}

interface NavLinksProps {
  items: NavItem[];
  className?: string;
}

export function NavLinks({ items, className = "" }: NavLinksProps) {
  return (
    <>
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`text-white hover:text-white/80 px-3 py-2 ${className}`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
