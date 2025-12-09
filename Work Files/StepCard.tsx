import { LucideIcon } from "lucide-react";

interface StepCardProps {
  /** Step number (e.g., "01", "1", or "Step 1") */
  step: string | number;
  /** Lucide icon to display */
  icon: LucideIcon;
  /** Step title */
  title: string;
  /** Step description */
  description: string;
  /** Background color variant */
  variant?: "default" | "alt";
  /** Additional CSS classes */
  className?: string;
}

/**
 * StepCard - A card component for displaying process steps
 * 
 * Used for: How it works sections, onboarding flows, process explanations
 * 
 * @example
 * <StepCard
 *   step="01"
 *   icon={Search}
 *   title="Browse"
 *   description="Explore our curated collection of fine art and collectibles."
 * />
 */
export function StepCard({
  step,
  icon: Icon,
  title,
  description,
  variant = "default",
  className = "",
}: StepCardProps) {
  // Format step number
  const formattedStep = typeof step === "number" 
    ? step.toString().padStart(2, "0") 
    : step;

  const bgClass = variant === "alt" ? "bg-lux-pearl" : "bg-lux-cream";

  return (
    <div
      className={`bg-lux-white rounded-xl border border-lux-silver-soft p-6 shadow-clean ${className}`}
    >
      {/* Header with Step and Icon */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center`}
        >
          <Icon className="h-5 w-5 text-lux-gold" aria-hidden="true" />
        </div>
        <span className="text-label text-lux-gold">Step {formattedStep}</span>
      </div>

      {/* Title */}
      <h3 className="heading-subsection text-lux-black mb-2">{title}</h3>

      {/* Description */}
      <p className="text-ink-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

/**
 * StepCardGrid - A container for displaying multiple StepCards in a grid
 */
interface StepCardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StepCardGrid({
  children,
  columns = 3,
  className = "",
}: StepCardGridProps) {
  const colsClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={`grid gap-6 ${colsClass} ${className}`}>
      {children}
    </div>
  );
}

export default StepCard;
