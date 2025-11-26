import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Kollect-It Luxury Button Variants
 * Phase 1 Update: Black/gold aesthetic with elegant hover states
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-normal font-sans tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /**
         * Default: Primary CTA button
         * Black background, white text, gold border appears on hover
         */
        default: "bg-cta-600 text-white border border-cta-600 hover:bg-cta-700 hover:border-gold-500 shadow-sm hover:shadow-md active:bg-cta-800",

        /**
         * Destructive: For dangerous actions
         */
        destructive: "bg-semantic-error-500 text-white hover:bg-semantic-error-500/90 shadow-sm",

        /**
         * Outline: Gold-framed luxury button
         * Gold border, transparent bg, fills gold on hover
         */
        outline: "border-2 border-gold-500 bg-transparent text-ink-900 hover:bg-gold-500 hover:text-ink-900 shadow-sm hover:shadow-md",

        /**
         * Secondary: Soft grey for secondary actions
         */
        secondary: "bg-surface-200 text-ink-900 border border-border-300 hover:bg-surface-300 hover:border-ink-400",

        /**
         * Ghost: Minimal button for tertiary actions
         */
        ghost: "text-ink-700 hover:bg-surface-200 hover:text-ink-900",

        /**
         * Link: Text-only with gold hover
         */
        link: "text-ink-900 underline-offset-4 hover:underline hover:text-gold-600",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-13 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
