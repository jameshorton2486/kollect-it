import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  /** Lucide icon to display */
  icon: LucideIcon;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FeatureCard - A card component for displaying features in a grid
 *
 * Used for: Feature lists, "What Makes Us Different" sections, service highlights
 *
 * @example
 * <FeatureCard
 *   icon={Shield}
 *   title="Authentication First"
 *   description="We focus on objects with clear attribution and strong provenance."
 * />
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  className = "",
}: FeatureCardProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="w-10 h-10 rounded-full bg-lux-cream flex items-center justify-center">
        <Icon className="h-5 w-5 text-lux-gold" aria-hidden="true" />
      </div>
      <h3 className="heading-subsection text-lux-black">{title}</h3>
      <p className="text-lux-gray-dark leading-relaxed">{description}</p>
    </div>
  );
}

export default FeatureCard;
