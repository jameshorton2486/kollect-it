/**
 * Kollect-It Global Components
 * 
 * Reusable UI components that follow the Kollect-It design system.
 * These components are used across all pages to ensure consistency.
 */

// State Components
export { EmptyState } from "./EmptyState";
export { LoadingState } from "./LoadingState";
export { ErrorState } from "./ErrorState";

// Layout Components
export { PageHeader } from "./PageHeader";
export { Section } from "./section";

// Card Components
export { InfoCard } from "./InfoCard";
export { StepCard } from "./StepCard";
export { FeatureCard } from "./FeatureCard";

// Heading Components
export { SectionHeading } from "./SectionHeading";

// Interactive Components
export { FAQAccordion } from "./FAQAccordion";
export { FilterCheckbox } from "./FilterCheckbox";
export { FilterPanel } from "./FilterPanel";
export { Breadcrumbs } from "./Breadcrumbs";
export { CTASection } from "./CTASection";

// Button Component
export { Button, buttonVariants } from "./button";
export type { ButtonProps } from "./button";

// Re-export types for convenience
export type { LucideIcon } from "lucide-react";
