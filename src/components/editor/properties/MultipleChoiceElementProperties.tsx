"use client";

import { Element } from "@prisma/client";
import {
  MultipleChoiceElementContent,
  isMultipleChoiceElementContent,
} from "@/types/composed";
import { useEditorStore } from "@/hooks/useEditorStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckSquare, Plus, X, GripVertical } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface MultipleChoiceElementPropertiesProps {
  element: Element;
}

export function MultipleChoiceElementProperties({
  element,
}: MultipleChoiceElementPropertiesProps) {
  const { updateElement } = useEditorStore();

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
          question: "",
          options: [],
          required: false,
          allowMultiple: false,
        };
  } catch {
    content = {
      question: "",
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

  const addOption = () => {
    if (content.options.length >= 6) return; // MVP limit: 6 options

    const newOption = {
      id: uuidv4(),
      text: `Nova opção ${content.options.length + 1}`,
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
          ? {
              ...opt,
              text,
              value:
                text
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "") || opt.value,
            }
          : opt
      ),
    });
  };

  const moveOption = (optionId: string, direction: "up" | "down") => {
    const currentIndex = content.options.findIndex(
      (opt) => opt.id === optionId
    );
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= content.options.length) return;

    const newOptions = [...content.options];
    [newOptions[currentIndex], newOptions[newIndex]] = [
      newOptions[newIndex],
      newOptions[currentIndex],
    ];

    updateContent({ options: newOptions });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-2 pb-2 border-b">
        <CheckSquare className="h-4 w-4" />
        <h3 className="font-medium">Propriedades da Pergunta</h3>
      </div>

      {/* Question */}
      <div className="space-y-2">
        <Label htmlFor="question-text">Pergunta</Label>
        <Textarea
          id="question-text"
          value={content.question}
          onChange={(e) => updateContent({ question: e.target.value })}
          placeholder="Digite sua pergunta..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Campo obrigatório</Label>
            <p className="text-sm text-muted-foreground">
              Usuário deve responder para continuar
            </p>
          </div>
          <Switch
            checked={content.required}
            onCheckedChange={(checked: boolean) =>
              updateContent({ required: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Múltipla seleção</Label>
            <p className="text-sm text-muted-foreground">
              Permitir selecionar várias opções
            </p>
          </div>
          <Switch
            checked={content.allowMultiple}
            onCheckedChange={(checked: boolean) =>
              updateContent({ allowMultiple: checked })
            }
          />
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Opções de resposta</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addOption}
            disabled={content.options.length >= 6}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {content.options.map((option, index) => (
            <div
              key={option.id}
              className="flex items-center gap-2 p-2 border rounded-md"
            >
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveOption(option.id, "up")}
                  disabled={index === 0}
                  className="h-6 w-6 p-0"
                >
                  <GripVertical className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveOption(option.id, "down")}
                  disabled={index === content.options.length - 1}
                  className="h-6 w-6 p-0"
                >
                  <GripVertical className="h-3 w-3" />
                </Button>
              </div>

              <Input
                value={option.text}
                onChange={(e) => updateOption(option.id, e.target.value)}
                placeholder={`Opção ${index + 1}`}
                className="flex-1"
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeOption(option.id)}
                disabled={content.options.length <= 1}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {content.options.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-md">
            <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Adicione pelo menos uma opção</p>
          </div>
        )}

        {content.options.length >= 6 && (
          <p className="text-sm text-muted-foreground text-center">
            Máximo de 6 opções atingido
          </p>
        )}
      </div>
    </div>
  );
}
