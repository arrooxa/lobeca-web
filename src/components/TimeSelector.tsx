import { forwardRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { hoursOfDay } from "@/utils";

interface TimeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const TimeSelector = forwardRef<HTMLButtonElement, TimeSelectorProps>(
  (
    {
      value,
      onValueChange,
      placeholder = "Selecione o horário",
      disabled = false,
      className = "",
    },
    ref
  ) => {
    return (
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger ref={ref} className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {hoursOfDay.map((hour) => (
            <SelectItem key={hour} value={hour}>
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

TimeSelector.displayName = "TimeSelector";

export default TimeSelector;
