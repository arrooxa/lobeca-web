import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-primary text-foreground-on-primary [a&]:hover:bg-brand-primary/90",
        secondary:
          "border-transparent bg-brand-secondary text-foreground-on-secondary [a&]:hover:bg-brand-secondary/90",
        tertiary:
          "border-transparent bg-brand-tertiary text-foreground-on-tertiary [a&]:hover:bg-brand-tertiary/90",
        destructive:
          "border-transparent bg-foreground-destructive text-white [a&]:hover:bg-foreground-destructive/90 focus-visible:ring-foreground-destructive/20 dark:focus-visible:ring-foreground-destructive/40",
        success:
          "border-transparent bg-foreground-success text-white [a&]:hover:bg-foreground-success/90",
        warning:
          "border-transparent bg-foreground-warning text-white [a&]:hover:bg-foreground-warning/90",
        info: "border-transparent bg-foreground-info text-white [a&]:hover:bg-foreground-info/90",
        outline:
          "border-color-border text-foreground [a&]:hover:bg-fill-color [a&]:hover:text-foreground",
      },
      size: {
        default: "h-5",
        sm: "h-4 text-[10px] px-1.5",
        lg: "h-6 text-sm px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge };
