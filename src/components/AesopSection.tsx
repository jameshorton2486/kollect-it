"use client";

import Image from "next/image";
import Link from "next/link";

type AesopSectionProps = {
  variant?: "cream" | "sand" | "olive" | "charcoal";
  layout?: "split-right" | "split-left" | "full";
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  imageSrc?: string;
  ctaLabel?: React.ReactNode;
  ctaLink?: string;
  children?: React.ReactNode;
};

export function AesopSection({
  variant = "cream",
  layout = "split-right",
  title,
  subtitle,
  description,
  imageSrc,
  ctaLabel,
  ctaLink = "#",
  children,
}: AesopSectionProps) {
  const bg = `bg-aesop-${variant}`;
  const textClass =
    variant === "olive"
      ? "text-aesop-olive-foreground"
      : variant === "charcoal"
      ? "text-aesop-charcoal-foreground"
      : "text-gray-800";

  // Use standardized spacing system
  const container = "container mx-auto section-normal page-padding";

  const TextBlock = (
    <div className="space-y-4">
      {subtitle && (
        <p className="uppercase tracking-[0.2em] text-xs md:text-sm opacity-80">
          {subtitle}
        </p>
      )}
      {title && <h2 className="text-2xl md:text-4xl font-serif">{title}</h2>}
      {description && (
        <p className="max-w-xl text-sm md:text-base opacity-90">
          {description}
        </p>
      )}
      {children}
      {ctaLabel && ctaLink && (
        <Link
          href={ctaLink}
          className="inline-block mt-4 px-6 py-3 rounded-lg bg-cta text-white hover:bg-cta-hover transition-colors text-sm font-medium"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );

  const ImageBlock =
    imageSrc != null ? (
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
        <Image src={imageSrc} fill alt="" className="object-cover" />
      </div>
    ) : null;

  return (
    <section className={`${bg} ${textClass}`}>
      <div
        className={
          layout === "full"
            ? `${container} text-center max-w-4xl`
            : `${container} grid gap-luxury md:grid-cols-2 items-center`
        }
      >
        {layout === "split-left" && ImageBlock}
        {layout === "full" ? (
          <div className="mx-auto space-y-4">{TextBlock}</div>
        ) : (
          <>
            {TextBlock}
            {layout === "split-right" && ImageBlock}
          </>
        )}
      </div>
    </section>
  );
}