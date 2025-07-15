"use client";

import { useState } from "react";
import { Element } from "@prisma/client";
import {
  MultipleChoiceElementContent,
  isMultipleChoiceElementContent,
} from "@/types/composed";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MultipleChoiceElementProps {
  element: Element;
  value?: string | string[];
  onAnswer?: (value: string | string[]) => void;
  className?: string;
}

export function MultipleChoiceElement({
  element,
  value,
  onAnswer,
  className,
}: MultipleChoiceElementProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );

  // Parse content
  let content: MultipleChoiceElementContent;
  try {
    const contentStr =
      typeof element.content === "string"
        ? element.content
        : JSON.stringify(element.content);
    const parsed = JSON.parse(contentStr);
    content = isMultipleChoiceElementContent(parsed)
      ? parsed
      : {
          question: "Pergunta não disponível",
          options: [],
          required: false,
          allowMultiple: false,
        };
  } catch {
    content = {
      question: "Erro ao carregar pergunta",
      options: [],
      required: false,
      allowMultiple: false,
    };
  }

  const handleSelectionChange = (optionValue: string, checked: boolean) => {
    let newSelection: string[];

    if (content.allowMultiple) {
      if (checked) {
        newSelection = [...selectedValues, optionValue];
      } else {
        newSelection = selectedValues.filter((v) => v !== optionValue);
      }
    } else {
      newSelection = checked ? [optionValue] : [];
    }

    setSelectedValues(newSelection);

    if (onAnswer) {
      if (content.allowMultiple) {
        onAnswer(newSelection);
      } else {
        onAnswer(newSelection[0] || "");
      }
    }
  };

  if (!content.options.length) {
    return null;
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Question */}
      <div className="space-y-1">
        <h3 className="text-lg font-medium leading-relaxed">
          {content.question}
        </h3>
        {content.required && (
          <span className="text-sm text-red-500">* Obrigatório</span>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {content.allowMultiple ? (
          // Checkbox mode
          <div className="space-y-3">
            {content.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`option-${option.id}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleSelectionChange(option.value, checked as boolean)
                  }
                  className="flex-shrink-0"
                />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="text-base leading-relaxed cursor-pointer flex-1"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          // Radio mode
          <RadioGroup
            value={selectedValues[0] || ""}
            onValueChange={(value) => handleSelectionChange(value, true)}
            className="space-y-3"
          >
            {content.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-3">
                <RadioGroupItem
                  value={option.value}
                  id={`option-${option.id}`}
                  className="flex-shrink-0"
                />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="text-base leading-relaxed cursor-pointer flex-1"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    </div>
  );
}
