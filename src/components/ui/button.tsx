import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Kollect-It Luxury Button Variants
 * Updated: Black/gold luxury aesthetic matching high-end auction houses
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-normal font-sans tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /**
         * Default: Primary CTA - Luxury Black
         * Black background, white text, gold border on hover
         */
        default: "bg-lux-black text-lux-white border border-lux-black hover:bg-lux-charcoal hover:border-lux-gold shadow-sm hover:shadow-lg active:bg-lux-charcoal/90",

        /**
         * Destructive: For dangerous actions
         */
        destructive: "bg-semantic-error-500 text-white hover:bg-semantic-error-500/90 shadow-sm",

        /**
         * Outline: Gold-framed luxury button
         * Gold border, transparent bg, fills gold on hover
         */
        outline: "border-2 border-lux-gold bg-transparent text-lux-black hover:bg-lux-gold hover:text-lux-black shadow-sm hover:shadow-lg",

        /**
         * Secondary: Elegant neutral for secondary actions
         */
        secondary: "bg-lux-pearl text-lux-black border border-lux-silver hover:bg-lux-silver hover:border-lux-gray-light",

        /**
         * Ghost: Minimal button for tertiary actions
         */
        ghost: "text-lux-gray-dark hover:bg-lux-pearl hover:text-lux-black",

        /**
         * Link: Text-only with gold hover
         */
        link: "text-lux-black underline-offset-4 hover:underline hover:text-lux-gold",
        
        /**
         * Gold: Inverted luxury - Gold background
         * For high-emphasis CTAs on dark backgrounds
         */
        gold: "bg-lux-gold text-lux-black border border-lux-gold hover:bg-lux-gold-light hover:border-lux-gold-light shadow-sm hover:shadow-lg font-medium",
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
