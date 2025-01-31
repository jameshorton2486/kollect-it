import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface BreadcrumbsProps {
  items: {
    label: string;
    href: string;
  }[];
}

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  children: React.ReactNode;
  className?: string;
}

export interface BreadcrumbListProps extends React.ComponentPropsWithoutRef<"ol"> {
  children: React.ReactNode;
  className?: string;
}

export interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<"li"> {
  children: React.ReactNode;
  className?: string;
}

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  children: React.ReactNode;
  className?: string;
  href: string;
  asChild?: boolean;
}

export interface BreadcrumbPageProps extends React.ComponentPropsWithoutRef<"span"> {
  children: React.ReactNode;
  className?: string;
}

export interface BreadcrumbSeparatorProps extends React.ComponentPropsWithoutRef<"span"> {
  children?: React.ReactNode;
  className?: string;
}

export function Breadcrumb({ className, children, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex", className)}
      {...props}
    >
      {children}
    </nav>
  );
}

export function BreadcrumbList({ className, children, ...props }: BreadcrumbListProps) {
  return (
    <ol
      className={cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-shop-500", className)}
      {...props}
    >
      {children}
    </ol>
  );
}

export function BreadcrumbItem({ className, children, ...props }: BreadcrumbItemProps) {
  return (
    <li
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    >
      {children}
    </li>
  );
}

export function BreadcrumbLink({ className, href, children, ...props }: BreadcrumbLinkProps) {
  return (
    <Link
      to={href}
      className={cn("transition-colors hover:text-shop-900", className)}
      {...props}
    >
      {children}
    </Link>
  );
}

export function BreadcrumbPage({ className, children, ...props }: BreadcrumbPageProps) {
  return (
    <span
      className={cn("text-shop-600", className)}
      aria-current="page"
      {...props}
    >
      {children}
    </span>
  );
}

export function BreadcrumbSeparator({ className, children, ...props }: BreadcrumbSeparatorProps) {
  return (
    <span
      className={cn("text-shop-400", className)}
      {...props}
    >
      {children || <ChevronRight className="h-4 w-4" />}
    </span>
  );
}

// Legacy support for existing code
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-2 h-4 w-4 text-shop-400" />
            )}
            <Link
              to={item.href}
              className={`inline-flex items-center text-sm font-medium transition-colors hover:text-shop-900 ${
                index === items.length - 1
                  ? "text-shop-600 cursor-default"
                  : "text-shop-500 hover:text-shop-700"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}