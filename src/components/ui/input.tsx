import * as React from "react";

import { cn } from "@/utils/cn";

interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

function Input({ className, type, error, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      aria-invalid={error}
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-color-border bg-white px-3 py-1 text-base text-foreground shadow-sm transition-[color,box-shadow] outline-none",
        "placeholder:text-foreground-subtle",
        "selection:bg-brand-primary selection:text-foreground-on-primary",
        "focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-fill-color disabled:text-font-disabled",
        "aria-invalid:border-foreground-destructive aria-invalid:ring-2 aria-invalid:ring-foreground-destructive/20",
        "md:text-sm",
        error &&
          "border-foreground-destructive ring-2 ring-foreground-destructive/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
