import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium font-sans tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-cta-600 text-white hover:bg-cta-700 active:bg-cta-800",
        destructive:
          "bg-semantic-error-500 text-white hover:bg-red-600/90",
        outline:
          "border border-border-300 bg-transparent hover:bg-surface-100 hover:text-ink-900",
        secondary:
          "bg-surface-200 text-ink-900 hover:bg-surface-300",
        ghost: "hover:bg-surface-200 hover:text-ink-900",
        link: "text-gold-600 underline-offset-4 hover:underline hover:text-gold-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
