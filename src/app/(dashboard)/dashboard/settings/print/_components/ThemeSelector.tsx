"use client";
import { InvoiceTemplate } from "../_types/invoice.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ThemeSelectorProps {
  selectedTheme: InvoiceTemplate;
  onThemeChange: (theme: InvoiceTemplate) => void;
}

const themes: { id: InvoiceTemplate; name: string }[] = [
  { id: "template1", name: "GST Theme 1" },
  { id: "template2", name: "GST Theme 2" },
  { id: "template3", name: "GST Theme 3" },
  { id: "template4", name: "GST Theme 4" },
  { id: "template5", name: "GST Theme 5" },
  { id: "template6", name: "GST Theme 6" },
  { id: "template7", name: "Double Divine" },
  { id: "template8", name: "Professional" },
];

export function ThemeSelector({
  selectedTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  return (
    <div className="w-full">
      <Select
        value={selectedTheme}
        onValueChange={(value) => onThemeChange(value as InvoiceTemplate)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              {theme.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
