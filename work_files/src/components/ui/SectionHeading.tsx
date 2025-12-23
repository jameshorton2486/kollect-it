import { ReactNode } from "react";

interface SectionHeadingProps {
  /** Small label text above the title (e.g., "ABOUT") */
  label?: string;
  /** Main section title */
  title: string;
  /** Optional description below the title */
  description?: string | ReactNode;
  /** Alignment */
  align?: "left" | "center";
  /** Maximum width of the content */
  maxWidth?: "xl" | "2xl" | "3xl" | "4xl";
  /** Additional CSS classes */
  className?: string;
}

/**
 * SectionHeading - A standardized heading component for page sections
 *
 * Provides consistent styling for section labels, titles, and descriptions.
 *
 * @example
 * <SectionHeading
 *   label="What Makes Us Different"
 *   title="Documentation and presentation"
 *   description="Treated as seriously as the objects themselves."
 * />
 */
export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  maxWidth = "2xl",
  className = "",
}: SectionHeadingProps) {
  const maxWidthClass = {
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
  }[maxWidth];

  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`${maxWidthClass} ${alignClass} ${className}`}>
      {label && (
        <p className="text-label text-lux-gold mb-2">{label}</p>
      )}
      <h2 className="heading-section text-lux-black">{title}</h2>
      {description && (
        <div className="mt-4 text-ink-700 leading-relaxed">
          {typeof description === "string" ? <p>{description}</p> : description}
        </div>
      )}
    </div>
  );
}

export default SectionHeading;
