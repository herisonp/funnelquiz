"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { isValidHexColor, normalizeHexColor } from "@/lib/color-utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function ColorPicker({
  value,
  onChange,
  label,
  disabled = false,
  className,
}: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setInputValue(value);
    setIsValid(isValidHexColor(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const normalizedColor = normalizeHexColor(newValue);
    const valid = isValidHexColor(normalizedColor);
    setIsValid(valid);

    if (valid) {
      onChange(normalizedColor);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    const normalizedColor = normalizeHexColor(newColor);
    setInputValue(normalizedColor);
    setIsValid(true);
    onChange(normalizedColor);
  };

  const handleInputBlur = () => {
    if (!isValid && inputValue) {
      // Restaurar valor válido anterior em caso de erro
      setInputValue(value);
      setIsValid(true);
    }
  };

  const displayColor = isValid ? inputValue : value;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={`color-input-${label}`} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <div className="flex items-center space-x-3">
        {/* Preview da cor com color picker nativo */}
        <div className="relative">
          <input
            type="color"
            value={displayColor}
            onChange={handleColorPickerChange}
            disabled={disabled}
            className="w-8 h-8 rounded border-2 border-gray-200 shadow-sm cursor-pointer opacity-0 absolute inset-0"
            title="Selecionar cor"
          />
          <div
            className="w-8 h-8 rounded border-2 border-gray-200 shadow-sm cursor-pointer flex-shrink-0 pointer-events-none"
            style={{ backgroundColor: displayColor }}
            title={`Cor atual: ${displayColor}`}
          />
        </div>

        {/* Input para código hex */}
        <div className="flex-1">
          <Input
            id={`color-input-${label}`}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="#000000"
            disabled={disabled}
            className={cn(
              "font-mono text-sm",
              !isValid && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {!isValid && (
            <p className="text-xs text-red-600 mt-1">
              Formato inválido. Use #RGB ou #RRGGBB
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
