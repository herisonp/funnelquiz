"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Filter, X, RotateCcw } from "lucide-react";
import { DateRangeFilter } from "./filters/DateRangeFilter";
import { StepResponseFilter } from "./filters/StepResponseFilter";
import { UserDataFilter } from "./filters/UserDataFilter";

// Types for filter values
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface StepResponseFilterValue {
  step: string;
  responseText: string;
}

interface UserDataFilterValue {
  field: string;
  searchText: string;
}

export interface FilterValue {
  type: string;
  label: string;
  value: unknown;
}

export interface AdvancedFiltersProps {
  filters: FilterValue[];
  onFiltersChange: (filters: FilterValue[]) => void;
  onExportCSV: () => void;
  onResetData: () => void;
  totalResults: number;
  filteredResults: number;
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onExportCSV,
  onResetData,
  totalResults,
  filteredResults,
}: AdvancedFiltersProps) {
  const updateFilter = (type: string, value: unknown, label: string) => {
    const newFilters = filters.filter((f) => f.type !== type);
    if (value !== undefined && value !== null && value !== "") {
      newFilters.push({ type, label, value });
    }
    onFiltersChange(newFilters);
  };

  const removeFilter = (type: string) => {
    const newFilters = filters.filter((f) => f.type !== type);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  const getFilterValue = (type: string) => {
    return filters.find((f) => f.type === type)?.value;
  };

  const hasActiveFilters = filters.length > 0;

  return (
    <Card className="gap-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filtros Avançados</CardTitle>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {filters.length}
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {filters.map((filter) => (
              <Badge
                key={filter.type}
                variant="outline"
                className="flex items-center gap-1"
              >
                <span className="text-xs">{filter.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeFilter(filter.type)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Filtro de Data */}
          <DateRangeFilter
            value={getFilterValue("dateRange") as DateRange | undefined}
            onChange={(value: DateRange | undefined, label: string) =>
              updateFilter("dateRange", value, label)
            }
          />

          {/* Filtro de Respostas por Step */}
          <StepResponseFilter
            value={
              getFilterValue("stepResponse") as
                | StepResponseFilterValue
                | undefined
            }
            onChange={(
              value: StepResponseFilterValue | undefined,
              label: string
            ) => updateFilter("stepResponse", value, label)}
          />

          {/* Filtro de Dados do Usuário */}
          <UserDataFilter
            value={
              getFilterValue("userData") as UserDataFilterValue | undefined
            }
            onChange={(value: UserDataFilterValue | undefined, label: string) =>
              updateFilter("userData", value, label)
            }
          />
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredResults === totalResults ? (
              <span>Exibindo {totalResults} resultados</span>
            ) : (
              <span>
                Exibindo {filteredResults} de {totalResults} resultados
                {hasActiveFilters && (
                  <span className="ml-2 text-primary font-medium">
                    • Filtros aplicados
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={onExportCSV} variant="outline" size="sm">
              Exportar CSV
            </Button>
            <Button
              onClick={onResetData}
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              Resetar Dados
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
