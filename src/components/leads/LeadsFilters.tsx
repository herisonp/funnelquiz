"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Download,
  RotateCcw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface LeadsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onExportCSV: () => void;
  onResetData: () => void;
  totalLeads: number;
  filteredLeads: number;
}

export function LeadsFilters({
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onExportCSV,
  onResetData,
  totalLeads,
  filteredLeads,
}: LeadsFiltersProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formatDateRange = () => {
    if (!dateRange.from) return "Selecionar período";
    if (!dateRange.to)
      return format(dateRange.from, "dd/MM/yyyy", { locale: ptBR });
    return `${format(dateRange.from, "dd/MM/yyyy", {
      locale: ptBR,
    })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}`;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      // Primeira seleção ou reset
      onDateRangeChange({ from: date, to: undefined });
    } else {
      // Segunda seleção
      if (date < dateRange.from) {
        onDateRangeChange({ from: date, to: dateRange.from });
      } else {
        onDateRangeChange({ from: dateRange.from, to: date });
      }
      setIsCalendarOpen(false);
    }
  };

  const clearDateRange = () => {
    onDateRangeChange({ from: undefined, to: undefined });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Campo de busca */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, email, telefone..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro de data */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal min-w-[200px]"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={handleDateSelect}
                  locale={ptBR}
                  className="rounded-md border"
                />
                {dateRange.from && (
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

        {/* Botões de ação */}
        <div className="flex gap-2">
          <Button onClick={onExportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={onResetData} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetar Dados
          </Button>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="text-sm text-muted-foreground">
        {filteredLeads === totalLeads ? (
          <span>Exibindo {totalLeads} leads</span>
        ) : (
          <span>
            Exibindo {filteredLeads} de {totalLeads} leads
            {(searchTerm || dateRange.from) && (
              <span className="ml-2 text-primary">• Filtros aplicados</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
