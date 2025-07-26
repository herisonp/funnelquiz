"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FontOption {
  name: string;
  value: string;
}

interface FontPickerProps {
  label: string;
  value: string;
  onChange: (font: string) => void;
  options: FontOption[];
  className?: string;
}

export default function FontPicker({
  label,
  value,
  onChange,
  options,
  className,
}: FontPickerProps) {
  const selectedFont = options.find((font) => font.value === value);

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <span style={{ fontFamily: value }} className="truncate">
              {selectedFont?.name || "Selecione uma fonte"}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              <span style={{ fontFamily: font.value }} className="flex-1">
                {font.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
