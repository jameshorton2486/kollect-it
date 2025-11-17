import Link from "next/link";

interface CTAProps {
  /**
   * Main heading text (required)
   */
  title: string;

  /**
   * Description text below the heading (optional)
   */
  description?: string;

  /**
   * Button text (default: "Get Started")
   */
  buttonText?: string;

  /**
   * Button href (default: "/contact")
   */
  buttonHref?: string;

  /**
   * Background color class (default: "bg-cta")
   */
  bgClass?: string;

  /**
   * Text color class (default: "text-white")
   */
  textClass?: string;

  /**
   * Optional className for additional styling
   */
  className?: string;
}

/**
 * Reusable Call-to-Action (CTA) component
 * Provides consistent styling across static pages (About, FAQ, etc.)
 * Includes centered heading, description, and action button
 */
export default function CTA({
  title,
  description,
  buttonText = "Get Started",
  buttonHref = "/contact",
  bgClass = "bg-cta",
  textClass = "text-white",
  className,
}: CTAProps) {
  return (
    <section
      className={`${bgClass} ${textClass} text-center py-12 px-4 md:px-6 lg:px-8 ${className || ""}`}
    >
      <div className="max-w-[700px] mx-auto">
        <h2 className="text-[clamp(28px,4vw,36px)] font-serif font-normal mb-4 leading-[1.3]">
          {title}
        </h2>

        {description && (
          <p className="text-[16px] leading-[1.8] mb-8 opacity-90">
            {description}
          </p>
        )}

        <Link
          href={buttonHref}
          className={`ki-btn-primary inline-block px-8 py-3 border-2 border-current rounded-sm font-medium tracking-[0.1em] uppercase text-[14px] transition-all hover:opacity-90 ${
            bgClass.includes("navy")
              ? "border-[hsl(var(--gold-500))] text-[hsl(var(--gold-500))]"
              : ""
          }`}
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}

