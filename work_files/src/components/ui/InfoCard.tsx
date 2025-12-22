import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  /** Lucide icon to display */
  icon: LucideIcon;
  /** Card title */
  title: string;
  /** Card description */
  description?: string;
  /** List of detail items */
  details?: string[];
  /** Optional note/footer text */
  note?: string;
  /** Card variant */
  variant?: "default" | "compact";
  /** Additional CSS classes */
  className?: string;
}

/**
 * InfoCard - A reusable card component with icon for displaying information
 * 
 * Used for: Policy cards, feature highlights, process explanations, etc.
 * 
 * @example
 * <InfoCard
 *   icon={Truck}
 *   title="Free Shipping"
 *   description="On all orders over $100"
 *   details={[
 *     "Ships within 1-2 business days",
 *     "Tracking included",
 *     "Insured delivery"
 *   ]}
 * />
 */
export function InfoCard({
  icon: Icon,
  title,
  description,
  details,
  note,
  variant = "default",
  className = "",
}: InfoCardProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={`bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean ${
        isCompact ? "p-4" : "p-6 md:p-8"
      } ${className}`}
    >
      <div className={`flex ${isCompact ? "items-center gap-3" : "items-start gap-4"}`}>
        {/* Icon */}
        <div
          className={`rounded-full bg-lux-cream flex items-center justify-center flex-shrink-0 ${
            isCompact ? "w-10 h-10" : "w-12 h-12"
          }`}
        >
          <Icon
            className={`text-lux-gold ${isCompact ? "h-5 w-5" : "h-6 w-6"}`}
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="heading-subsection text-lux-black">{title}</h3>

          {description && (
            <p className={`text-ink-600 leading-relaxed ${isCompact ? "mt-1 text-sm" : "mt-2"}`}>
              {description}
            </p>
          )}

          {/* Details List */}
          {details && details.length > 0 && (
            <ul className="mt-4 space-y-2">
              {details.map((detail, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-ink-600"
                >
                  <span className="text-lux-gold mt-1.5 flex-shrink-0">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Note */}
          {note && (
            <p className="mt-4 text-sm text-lux-gray italic">{note}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
