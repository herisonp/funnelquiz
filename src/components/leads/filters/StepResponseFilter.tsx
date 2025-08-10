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
import { Search } from "lucide-react";

export interface StepResponseFilter {
  step: string;
  responseText: string;
}

interface StepResponseFilterProps {
  value?: StepResponseFilter;
  onChange: (value: StepResponseFilter | undefined, label: string) => void;
}

// Lista de steps disponíveis para filtro
const AVAILABLE_STEPS = [
  { value: "0", label: "Etapa 1: Página Inicial" },
  { value: "1", label: "Etapa 2: Desafio" },
  { value: "2", label: "Etapa 3: Empresa" },
  { value: "3", label: "Etapa 4: Orçamento" },
  { value: "4", label: "Etapa 5: Timeline" },
  { value: "5", label: "Etapa 6: Contato" },
];

export function StepResponseFilter({
  value,
  onChange,
}: StepResponseFilterProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [tempStep, setTempStep] = useState(value?.step || "");
  const [tempResponse, setTempResponse] = useState(value?.responseText || "");

  const getFilterLabel = (step?: string, responseText?: string) => {
    const filterStep = step || value?.step;
    const filterResponseText = responseText || value?.responseText;

    if (!filterStep || !filterResponseText) return "";
    const stepLabel =
      AVAILABLE_STEPS.find((s) => s.value === filterStep)?.label ||
      `Etapa ${parseInt(filterStep) + 1}`;
    return `${stepLabel}: "${filterResponseText}"`;
  };

  const handleApplyFilter = () => {
    if (tempStep && tempResponse.trim()) {
      const newFilter = { step: tempStep, responseText: tempResponse.trim() };
      const label = getFilterLabel(tempStep, tempResponse.trim());
      onChange(newFilter, label);
      setIsPopoverOpen(false);
    }
  };

  const handleClearFilter = () => {
    setTempStep("");
    setTempResponse("");
    onChange(undefined, "");
    setIsPopoverOpen(false);
  };

  const handleCancel = () => {
    setTempStep(value?.step || "");
    setTempResponse(value?.responseText || "");
    setIsPopoverOpen(false);
  };

  const hasFilter = value?.step && value?.responseText;
  const hasChanges =
    tempStep !== (value?.step || "") ||
    tempResponse !== (value?.responseText || "");

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Respostas por Etapa</Label>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <Search className="mr-2 h-4 w-4" />
            {hasFilter ? (
              <span className="truncate">
                Etapa {parseInt(value.step) + 1}: &ldquo;{value.responseText}
                &rdquo;
              </span>
            ) : (
              "Buscar por resposta"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="step-select">Etapa</Label>
              <Select value={tempStep} onValueChange={setTempStep}>
                <SelectTrigger id="step-select">
                  <SelectValue placeholder="Selecione uma etapa" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_STEPS.map((step) => (
                    <SelectItem key={step.value} value={step.value}>
                      {step.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="response-input">Texto da Resposta</Label>
              <Input
                id="response-input"
                placeholder="Digite o texto a buscar..."
                value={tempResponse}
                onChange={(e) => setTempResponse(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tempStep && tempResponse.trim()) {
                    handleApplyFilter();
                  }
                }}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleApplyFilter}
                disabled={!tempStep || !tempResponse.trim()}
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
