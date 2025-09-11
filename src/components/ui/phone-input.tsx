import * as React from "react";
import { IMaskInput } from "react-imask";
import { Phone } from "lucide-react";
import { cn } from "@/utils/cn";

interface MaskedInputProps {
  mask: string;
  className?: string;
  placeholder?: string;
  value?: string;
  onAccept?: (value: string) => void;
  unmask?: boolean;
  id?: string;
  name?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: boolean;
  "aria-invalid"?: boolean;
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Phone className="h-4 w-4 text-foreground-subtle" />
        </div>
        <IMaskInput
          inputRef={ref}
          data-slot="input"
          aria-invalid={error}
          className={cn(
            "flex h-9 w-full min-w-0 rounded-md border border-color-border bg-white pl-10 pr-3 py-1 text-base text-foreground shadow-sm transition-[color,box-shadow] outline-none",
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
      </div>
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
