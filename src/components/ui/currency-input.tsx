import * as React from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { cn } from "@/utils/cn";

export interface CurrencyInputProps
  extends Omit<NumericFormatProps, "onValueChange"> {
  onValueChange?: (value: number) => void;
  error?: boolean;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, onValueChange, error, ...props }, ref) => {
    return (
      <NumericFormat
        getInputRef={ref}
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        className={cn(
          "flex h-9 w-full rounded-md border border-color-border bg-white px-3 py-1 text-base shadow-sm transition-colors placeholder:text-foreground-subtle",
          "focus-visible:outline-none focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "md:text-sm",
          error && "border-red-500 focus-visible:ring-red-500/20",
          className
        )}
        onValueChange={(values) => {
          if (onValueChange) {
            // Converte para centavos (como o backend espera)
            const valueInCents = Math.round((values.floatValue || 0) * 100);
            onValueChange(valueInCents);
          }
        }}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
