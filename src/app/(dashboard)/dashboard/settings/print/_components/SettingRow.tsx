import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SettingRowProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  hasInput?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  inputPlaceholder?: string;
  tooltip?: string;
  className?: string;
}

export function SettingRow({
  id,
  label,
  checked,
  onCheckedChange,
  hasInput = false,
  inputValue = "",
  onInputChange,
  inputPlaceholder = "",
  tooltip,
  className,
}: SettingRowProps) {
  return (
    <div className={cn("flex items-start gap-3 w-full min-w-0", className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      {hasInput ? (
        <div className="flex-1 min-w-0">
          <div className="relative w-full min-w-0">
            <Label
              htmlFor={`${id}-input`}
              className="absolute -top-2 left-3 bg-background px-1 text-xs text-muted-foreground"
            >
              {label}
            </Label>
            <Input
              id={`${id}-input`}
              type={id === "email" ? "email" : id === "phone" ? "tel" : "text"}
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
              placeholder={inputPlaceholder}
              className="h-10 pt-2 w-full"
              disabled={!checked}
            />
          </div>
        </div>
      ) : (
        <Label
          htmlFor={id}
          className="text-sm font-normal cursor-pointer flex flex-wrap items-center gap-1 whitespace-normal leading-snug"
        >
          {label}
          {tooltip && (
            <span className="inline-flex items-center justify-center w-4 h-4 text-xs text-muted-foreground border border-muted-foreground/30 rounded-full">
              ?
            </span>
          )}
        </Label>
      )}
    </div>
  );
}
