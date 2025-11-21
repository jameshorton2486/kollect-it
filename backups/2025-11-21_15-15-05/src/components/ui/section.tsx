import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  spacing?: "sm" | "md" | "lg" | "xl";
  background?: "surface-0" | "surface-50" | "surface-100" | "gradient";
  className?: string;
}

export function Section({
  children,
  spacing = "lg",
  background = "surface-50",
  className,
}: SectionProps) {
  const spacingClasses = {
    sm: "py-12",
    md: "py-16",
    lg: "py-20",
    xl: "py-24",
  };

  const backgroundClasses = {
    "surface-0": "bg-surface-0",
    "surface-50": "bg-surface-50",
    "surface-100": "bg-surface-100",
    gradient: "bg-gradient-to-b from-surface-50 to-surface-100",
  };

  return (
    <section
      className={cn(
        spacingClasses[spacing],
        backgroundClasses[background],
        className
      )}
    >
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}
