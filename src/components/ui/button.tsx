import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-brand-primary)] text-white shadow hover:bg-[var(--color-brand-primary)]/90",
        destructive:
          "bg-[var(--color-brand-secondary)] text-white shadow-sm hover:bg-[var(--color-brand-secondary)]/90",
        outline:
          "border border-[var(--color-color-border)] bg-white shadow-sm hover:bg-[var(--color-fill-color)] hover:text-[var(--color-font-primary)]",
        secondary:
          "bg-[var(--color-brand-tertiary)] text-[var(--color-brand-primary)] shadow-sm hover:bg-[var(--color-brand-tertiary)]/80",
        ghost:
          "hover:bg-[var(--color-fill-color)] hover:text-[var(--color-font-primary)]",
        link: "text-[var(--color-brand-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-9 w-9",
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

export { Button };
