"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "lucide-react";

export interface UserDataFilter {
  field: string;
  searchText: string;
}

interface UserDataFilterProps {
  value?: UserDataFilter;
  onChange: (value: UserDataFilter | undefined, label: string) => void;
}

// Lista de campos disponíveis para filtro
const AVAILABLE_FIELDS = [
  { value: "name", label: "Nome" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Telefone" },
  { value: "all", label: "Todos os campos" },
];

export function UserDataFilter({ value, onChange }: UserDataFilterProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [tempField, setTempField] = useState(value?.field || "all");
  const [tempSearchText, setTempSearchText] = useState(value?.searchText || "");

  const getFilterLabel = (field?: string, searchText?: string) => {
    const filterField = field || value?.field;
    const filterSearchText = searchText || value?.searchText;

    if (!filterField || !filterSearchText) return "";
    const fieldLabel =
      AVAILABLE_FIELDS.find((f) => f.value === filterField)?.label ||
      filterField;
    return `${fieldLabel}: ${filterSearchText}`;
  };

  const handleApplyFilter = () => {
    if (tempField && tempSearchText.trim()) {
      const newFilter = { field: tempField, searchText: tempSearchText.trim() };
      const label = getFilterLabel(tempField, tempSearchText.trim());
      onChange(newFilter, label);
      setIsPopoverOpen(false);
    }
  };

  const handleClearFilter = () => {
    setTempField("all");
    setTempSearchText("");
    onChange(undefined, "");
    setIsPopoverOpen(false);
  };

  const handleCancel = () => {
    setTempField(value?.field || "all");
    setTempSearchText(value?.searchText || "");
    setIsPopoverOpen(false);
  };

  const hasFilter = value?.field && value?.searchText;
  const hasChanges =
    tempField !== (value?.field || "all") ||
    tempSearchText !== (value?.searchText || "");

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Dados do Usuário</Label>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <User className="mr-2 h-4 w-4" />
            {hasFilter ? (
              <span className="truncate">
                {AVAILABLE_FIELDS.find((f) => f.value === value.field)?.label}:{" "}
                {value.searchText}
              </span>
            ) : (
              "Buscar dados do usuário"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="field-select">Campo</Label>
              <Select value={tempField} onValueChange={setTempField}>
                <SelectTrigger id="field-select">
                  <SelectValue placeholder="Selecione um campo" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_FIELDS.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search-input">Termo de Busca</Label>
              <Input
                id="search-input"
                placeholder="Digite o texto a buscar..."
                value={tempSearchText}
                onChange={(e) => setTempSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tempField && tempSearchText.trim()) {
                    handleApplyFilter();
                  }
                }}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleApplyFilter}
                disabled={!tempField || !tempSearchText.trim()}
                className="flex-1"
              >
                Aplicar
              </Button>
              {hasFilter && (
                <Button
                  variant="outline"
                  onClick={handleClearFilter}
                  className="flex-1"
                >
                  Limpar
                </Button>
              )}
              {hasChanges && (
                <Button variant="ghost" onClick={handleCancel} size="sm">
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
