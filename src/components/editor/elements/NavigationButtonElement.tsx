"use client";

import { useState } from "react";
import { Element } from "@prisma/client";
import {
  NavigationButtonElementContent,
  isNavigationButtonElementContent,
} from "@/types/composed";
import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationButtonElementProps {
  element: Element;
  isSelected?: boolean;
  isEditing?: boolean;
}

export function NavigationButtonElement({
  element,
  isSelected,
  isEditing,
}: NavigationButtonElementProps) {
  const { updateElement, quiz } = useEditorStore();
  const [isEditingLabel, setIsEditingLabel] = useState(false);

  // Parse content
  let content: NavigationButtonElementContent;
  try {
    const contentStr =
      typeof element.content === "string"
        ? element.content
        : JSON.stringify(element.content);
    const parsed = JSON.parse(contentStr);
    content = isNavigationButtonElementContent(parsed)
      ? parsed
      : {
          label: "Continuar",
          targetStep: "next",
          variant: "primary",
        };
  } catch {
    content = {
      label: "Erro ao carregar botão",
      targetStep: "next",
      variant: "primary",
    };
  }

  const updateContent = (updates: Partial<NavigationButtonElementContent>) => {
    const newContent = { ...content, ...updates };
    updateElement(element.id, {
      content: JSON.stringify(newContent),
    });
  };

  const updateLabel = (newLabel: string) => {
    updateContent({ label: newLabel });
  };

  const updateTargetStep = (newTarget: string) => {
    updateContent({ targetStep: newTarget });
  };

  const updateVariant = (newVariant: "primary" | "secondary" | "outline") => {
    updateContent({ variant: newVariant });
  };

  const getButtonVariant = (variant: string) => {
    const variantMap = {
      primary: "default",
      secondary: "secondary",
      outline: "outline",
    };
    return variantMap[variant as keyof typeof variantMap] || "default";
  };

  const getIcon = (targetStep: string) => {
    if (targetStep === "previous") {
      return <ArrowLeft className="h-4 w-4" />;
    }
    if (targetStep === "submit") {
      return <CheckCircle className="h-4 w-4" />;
    }
    return <ArrowRight className="h-4 w-4" />;
  };

  const getTargetStepLabel = (target: string) => {
    if (target === "next") return "Próxima etapa";
    if (target === "previous") return "Etapa anterior";
    if (target === "submit") return "Finalizar quiz";

    // Look for specific step
    const step = quiz?.steps.find((s) => s.id === target);
    return step ? `Ir para: ${step.title}` : "Etapa específica";
  };

  return (
    <div
      className={cn(
        "w-full p-4 rounded-md border transition-all duration-200",
        isSelected && isEditing && "ring-2 ring-primary",
        isEditing && "hover:border-primary/50"
      )}
    >
      {/* Button Preview */}
      <div className="flex justify-center">
        <Button
          variant={
            getButtonVariant(content.variant || "primary") as
              | "default"
              | "secondary"
              | "outline"
          }
          disabled={isEditing}
          className="min-w-[120px]"
        >
          {content.targetStep === "previous" && getIcon(content.targetStep)}
          <span className="mx-2">{content.label}</span>
          {content.targetStep !== "previous" &&
            getIcon(content.targetStep || "next")}
        </Button>
      </div>

      {/* Editor Controls */}
      {isEditing && (
        <div className="mt-4 space-y-4 pt-4 border-t">
          {/* Label */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Texto do botão</label>
            {isEditingLabel ? (
              <Input
                value={content.label}
                onChange={(e) => updateLabel(e.target.value)}
                onBlur={() => setIsEditingLabel(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingLabel(false);
                  if (e.key === "Escape") setIsEditingLabel(false);
                }}
                autoFocus
                placeholder="Digite o texto do botão..."
              />
            ) : (
              <div
                onClick={() => setIsEditingLabel(true)}
                className="cursor-text p-2 border rounded-md hover:bg-muted/50"
              >
                {content.label || "Clique para editar..."}
              </div>
            )}
          </div>

          {/* Target Step */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ação do botão</label>
            <Select
              value={content.targetStep || "next"}
              onValueChange={updateTargetStep}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous">Etapa anterior</SelectItem>
                <SelectItem value="next">Próxima etapa</SelectItem>
                <SelectItem value="submit">Finalizar quiz</SelectItem>
                {quiz?.steps.map((step, index) => (
                  <SelectItem key={step.id} value={step.id}>
                    Ir para Etapa {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getTargetStepLabel(content.targetStep || "next")}
            </p>
          </div>

          {/* Variant */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Estilo do botão</label>
            <Select
              value={content.variant || "primary"}
              onValueChange={updateVariant}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estilo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primário (preenchido)</SelectItem>
                <SelectItem value="secondary">Secundário</SelectItem>
                <SelectItem value="outline">Contorno</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
