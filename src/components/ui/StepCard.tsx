import { LucideIcon } from "lucide-react";

interface StepCardProps {
  /** Step number (1, 2, 3, etc.) */
  step: number | string;
  /** Lucide icon to display */
  icon?: LucideIcon;
  /** Step title */
  title: string;
  /** Step description */
  description: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * StepCard - A numbered step card with optional icon
 *
 * Used for: Process steps, how-it-works sections, numbered lists
 *
 * @example
 * <StepCard
 *   step={1}
 *   icon={Search}
 *   title="Browse the Collection"
 *   description="Explore our curated selection of authenticated pieces."
 * />
 */
export function StepCard({
  step,
  icon: Icon,
  title,
  description,
  className = "",
}: StepCardProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Step Number & Icon */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-lux-gold text-lux-black font-serif font-bold text-lg flex items-center justify-center">
          {step}
        </div>
        {Icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-lux-cream flex items-center justify-center">
            <Icon className="h-5 w-5 text-lux-gold" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="heading-subsection text-lux-black mb-2">{title}</h3>
        <p className="text-ink-700 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default StepCard;
