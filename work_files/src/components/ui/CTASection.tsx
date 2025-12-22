import Link from "next/link";
import { ReactNode } from "react";

interface CTASectionProps {
  /** Small label text above the title */
  label?: string;
  /** Main CTA title */
  title: string;
  /** Description text */
  description?: string | ReactNode;
  /** Primary CTA button */
  primaryAction?: {
    label: string;
    href: string;
  };
  /** Secondary CTA link */
  secondaryAction?: {
    label: string;
    href: string;
  };
  /** Background variant */
  variant?: "dark" | "light";
  /** Additional CSS classes */
  className?: string;
}

/**
 * CTASection - A standardized call-to-action section
 *
 * Used for: Bottom-of-page CTAs, conversion sections, newsletter signups
 *
 * @example
 * <CTASection
 *   label="Next Step"
 *   title="Have a collection to consign?"
 *   description="We work with collectors and estates."
 *   primaryAction={{ label: "Start Consigning", href: "/consign" }}
 *   secondaryAction={{ label: "Contact Us", href: "/contact" }}
 * />
 */
export function CTASection({
  label,
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = "dark",
  className = "",
}: CTASectionProps) {
  const isDark = variant === "dark";
  const bgClass = isDark ? "bg-lux-charcoal" : "bg-lux-cream";
  const textClass = isDark ? "text-lux-cream" : "text-lux-black";
  const labelClass = isDark ? "text-lux-gold" : "text-lux-gold";

  return (
    <section className={`${bgClass} section-normal ${className}`}>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex-1">
            {label && (
              <p className={`text-label ${labelClass} mb-2`}>{label}</p>
            )}
            <h2 className={`heading-section ${textClass} mb-4`}>{title}</h2>
            {description && (
              <div className={`${isDark ? "text-lux-cream/80" : "text-lux-gray-dark"}`}>
                {typeof description === "string" ? <p>{description}</p> : description}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {primaryAction && (
              <Link
                href={primaryAction.href}
                className="bg-lux-gold text-lux-charcoal font-medium px-6 py-3 rounded-full hover:bg-lux-gold-light transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 whitespace-nowrap"
              >
                {primaryAction.label}
              </Link>
            )}
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className={`border ${isDark ? "border-lux-gold/50 text-lux-gold hover:bg-lux-gold hover:text-lux-black" : "border-lux-charcoal text-lux-charcoal hover:bg-lux-charcoal hover:text-lux-cream"} px-6 py-3 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 whitespace-nowrap`}
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
