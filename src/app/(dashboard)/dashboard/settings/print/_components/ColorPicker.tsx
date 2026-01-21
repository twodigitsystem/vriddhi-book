import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  presets?: { name: string; value: string }[];
}

const defaultPresets = [
  { name: "Cyan", value: "#0891b2" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Red", value: "#ef4444" },
  { name: "Pink", value: "#ec4899" },
  { name: "Teal", value: "#14b8a6" },
];

export function ColorPicker({
  label,
  value,
  onChange,
  presets = defaultPresets,
}: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-8 gap-2">
        {presets.map((color) => (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            className={cn(
              "h-8 w-8 rounded-full border-2 transition-all hover:scale-110",
              value === color.value
                ? "border-foreground ring-2 ring-offset-2 ring-primary"
                : "border-transparent"
            )}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-12 p-0 border-0 cursor-pointer"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          pattern="#[0-9A-Fa-f]{6}"
          title="Enter a valid hex color code like #RRGGBB"
          className="flex-1 h-8 text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
