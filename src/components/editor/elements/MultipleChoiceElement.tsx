"use client";

import { useState } from "react";
import { Element } from "@prisma/client";
import {
  MultipleChoiceElementContent,
  isMultipleChoiceElementContent,
} from "@/types/composed";
import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

interface MultipleChoiceElementProps {
  element: Element;
  isSelected?: boolean;
  isEditing?: boolean;
}

export function MultipleChoiceElement({
  element,
  isSelected,
  isEditing,
}: MultipleChoiceElementProps) {
  const { updateElement } = useEditorStore();
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);

  // Parse content
  let content: MultipleChoiceElementContent;
  try {
    const parsed =
      typeof element.content === "string"
        ? JSON.parse(element.content)
        : element.content;
    content = isMultipleChoiceElementContent(parsed)
      ? parsed
      : {
          question: "Qual é a sua pergunta?",
          options: [
            { id: "option-1", text: "Opção 1", value: "option-1" },
            { id: "option-2", text: "Opção 2", value: "option-2" },
          ],
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

  const updateContent = (updates: Partial<MultipleChoiceElementContent>) => {
    const newContent = { ...content, ...updates };
    updateElement(element.id, {
      content: newContent,
    });
  };

  const updateQuestion = (newQuestion: string) => {
    updateContent({ question: newQuestion });
  };

  const addOption = () => {
    if (content.options.length >= 6) return; // MVP limit: 6 options

    const newOption = {
      id: uuidv4(),
      text: `Opção ${content.options.length + 1}`,
      value: `option-${content.options.length + 1}`,
    };

    updateContent({
      options: [...content.options, newOption],
    });
  };

  const removeOption = (optionId: string) => {
    if (content.options.length <= 1) return; // Minimum 1 option

    updateContent({
      options: content.options.filter((opt) => opt.id !== optionId),
    });
  };

  const updateOption = (optionId: string, text: string) => {
    updateContent({
      options: content.options.map((opt) =>
        opt.id === optionId
          ? { ...opt, text, value: text.toLowerCase().replace(/\s+/g, "-") }
          : opt
      ),
    });
  };

  const toggleAllowMultiple = () => {
    updateContent({ allowMultiple: !content.allowMultiple });
  };

  const toggleRequired = () => {
    updateContent({ required: !content.required });
  };

  return (
    <div
      className={cn(
        "w-full space-y-4 p-4 rounded-md border transition-all duration-200",
        isSelected && isEditing && "ring-2 ring-primary",
        isEditing && "hover:border-primary/50"
      )}
    >
      {/* Question */}
      <div className="space-y-2">
        {editingQuestionId === element.id && isEditing ? (
          <Input
            value={content.question}
            onChange={(e) => updateQuestion(e.target.value)}
            onBlur={() => setEditingQuestionId(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditingQuestionId(null);
              if (e.key === "Escape") setEditingQuestionId(null);
            }}
            autoFocus
            className="text-lg font-medium"
            placeholder="Digite sua pergunta..."
          />
        ) : (
          <h3
            onClick={() => isEditing && setEditingQuestionId(element.id)}
            className={cn(
              "text-lg font-medium cursor-text",
              isEditing && "hover:bg-muted/50 rounded px-2 py-1",
              !content.question.trim() &&
                isEditing &&
                "text-muted-foreground italic"
            )}
          >
            {content.question.trim() ||
              (isEditing ? "Clique para editar a pergunta..." : "")}
          </h3>
        )}

        {content.required && (
          <span className="text-sm text-red-500">* Obrigatório</span>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        {content.allowMultiple ? (
          // Checkbox mode
          <div className="space-y-2">
            {content.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 group"
              >
                {isEditing && (
                  <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                <Checkbox
                  id={`option-${option.id}`}
                  disabled={isEditing}
                  className="flex-shrink-0"
                />

                {editingOptionId === option.id && isEditing ? (
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    onBlur={() => setEditingOptionId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingOptionId(null);
                      if (e.key === "Escape") setEditingOptionId(null);
                    }}
                    autoFocus
                    className="flex-1"
                    placeholder="Texto da opção..."
                  />
                ) : (
                  <Label
                    htmlFor={`option-${option.id}`}
                    onClick={() => isEditing && setEditingOptionId(option.id)}
                    className={cn(
                      "flex-1 cursor-pointer",
                      isEditing && "hover:bg-muted/50 rounded px-2 py-1"
                    )}
                  >
                    {option.text}
                  </Label>
                )}

                {isEditing && content.options.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(option.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Radio mode
          <RadioGroup disabled={isEditing}>
            {content.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 group"
              >
                {isEditing && (
                  <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                <RadioGroupItem
                  value={option.value}
                  id={`option-${option.id}`}
                  className="flex-shrink-0"
                />

                {editingOptionId === option.id && isEditing ? (
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    onBlur={() => setEditingOptionId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingOptionId(null);
                      if (e.key === "Escape") setEditingOptionId(null);
                    }}
                    autoFocus
                    className="flex-1"
                    placeholder="Texto da opção..."
                  />
                ) : (
                  <Label
                    htmlFor={`option-${option.id}`}
                    onClick={() => isEditing && setEditingOptionId(option.id)}
                    className={cn(
                      "flex-1 cursor-pointer",
                      isEditing && "hover:bg-muted/50 rounded px-2 py-1"
                    )}
                  >
                    {option.text}
                  </Label>
                )}

                {isEditing && content.options.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(option.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      {/* Editor Controls */}
      {isEditing && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={addOption}
            disabled={content.options.length >= 6}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Opção
          </Button>

          <Button variant="outline" size="sm" onClick={toggleAllowMultiple}>
            {content.allowMultiple ? "Seleção Única" : "Múltipla Escolha"}
          </Button>

          <Button variant="outline" size="sm" onClick={toggleRequired}>
            {content.required ? "Opcional" : "Obrigatório"}
          </Button>
        </div>
      )}
    </div>
  );
}
