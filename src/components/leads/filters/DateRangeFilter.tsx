"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangeFilterProps {
  value?: DateRange;
  onChange: (value: DateRange | undefined, label: string) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formatDateRange = () => {
    if (!value?.from) return "Selecionar período";
    if (!value.to) return format(value.from, "dd/MM/yyyy", { locale: ptBR });
    return `${format(value.from, "dd/MM/yyyy", {
      locale: ptBR,
    })} - ${format(value.to, "dd/MM/yyyy", { locale: ptBR })}`;
  };

  const getFilterLabel = (dateRange?: DateRange) => {
    const filterValue = dateRange || value;
    if (!filterValue?.from) return "";
    if (!filterValue.to)
      return `Data: ${format(filterValue.from, "dd/MM/yyyy", {
        locale: ptBR,
      })}`;
    return `Período: ${format(filterValue.from, "dd/MM", {
      locale: ptBR,
    })} - ${format(filterValue.to, "dd/MM", { locale: ptBR })}`;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const currentRange = value || { from: undefined, to: undefined };

    if (!currentRange.from || (currentRange.from && currentRange.to)) {
      // Primeira seleção ou reset
      const newRange = { from: date, to: undefined };
      onChange(newRange, getFilterLabel(newRange));
    } else {
      // Segunda seleção
      let newRange: DateRange;
      if (date < currentRange.from) {
        newRange = { from: date, to: currentRange.from };
      } else {
        newRange = { from: currentRange.from, to: date };
      }
      onChange(newRange, getFilterLabel(newRange));
      setIsCalendarOpen(false);
    }
  };

  const clearDateRange = () => {
    onChange(undefined, "");
    setIsCalendarOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Período</Label>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <Calendar
              mode="single"
              selected={value?.from}
              onSelect={handleDateSelect}
              locale={ptBR}
              className="rounded-md border"
            />
            {value?.from && (
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearDateRange}
                  className="w-full"
                >
                  Limpar
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
