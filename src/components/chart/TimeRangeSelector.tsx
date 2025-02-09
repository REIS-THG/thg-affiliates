
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TimeRangeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const TimeRangeSelector = ({ value, onValueChange }: TimeRangeSelectorProps) => {
  return (
    <div className="flex justify-end">
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(value) => value && onValueChange(value)}
      >
        <ToggleGroupItem value="30" aria-label="30 days">
          30d
        </ToggleGroupItem>
        <ToggleGroupItem value="60" aria-label="60 days">
          60d
        </ToggleGroupItem>
        <ToggleGroupItem value="90" aria-label="90 days">
          90d
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
