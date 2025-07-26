"use client";

import { Element } from "@prisma/client";
import {
  NavigationButtonElementContent,
  isNavigationButtonElementContent,
} from "@/types/composed";
import { useEditorStore } from "@/hooks/useEditorStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

interface NavigationButtonElementPropertiesProps {
  element: Element;
}

export function NavigationButtonElementProperties({
  element,
}: NavigationButtonElementPropertiesProps) {
  const { updateElement, quiz } = useEditorStore();

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
      label: "Continuar",
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

  const getTargetStepDescription = (target: string) => {
    if (target === "next") return "Avança para a próxima etapa do quiz";
    if (target === "previous") return "Volta para a etapa anterior";
    if (target === "submit") return "Finaliza o quiz e coleta as respostas";

    const step = quiz?.steps.find((s) => s.id === target);
    if (step) {
      const stepIndex = quiz?.steps.findIndex((s) => s.id === target) || 0;
      return `Vai direto para a Etapa ${stepIndex + 1}: ${step.title}`;
    }
    return "Etapa específica";
  };

  const getVariantPreview = (variant: string) => {
    const variantMap = {
      primary: { label: "Primário", description: "Destaque principal (azul)" },
      secondary: {
        label: "Secundário",
        description: "Estilo alternativo (cinza)",
      },
      outline: {
        label: "Contorno",
        description: "Apenas borda, fundo transparente",
      },
    };
    return variantMap[variant as keyof typeof variantMap] || variantMap.primary;
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-2 pb-2 border-b">
        <ArrowRight className="h-4 w-4" />
        <h3 className="font-medium">Propriedades do Botão</h3>
      </div>

      {/* Button Label */}
      <div className="space-y-2">
        <Label htmlFor="button-label">Texto do botão</Label>
        <Input
          id="button-label"
          value={content.label}
          onChange={(e) => updateContent({ label: e.target.value })}
          placeholder="Ex: Continuar, Próximo, Finalizar..."
        />
        <p className="text-sm text-muted-foreground">
          Texto que aparecerá no botão
        </p>
      </div>

      {/* Target Step */}
      <div className="space-y-2">
        <Label htmlFor="target-step">Ação do botão</Label>
        <Select
          value={content.targetStep || "next"}
          onValueChange={(value) => updateContent({ targetStep: value })}
        >
          <SelectTrigger id="target-step">
            <SelectValue placeholder="Selecione a ação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="previous">
              <div className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Etapa anterior
              </div>
            </SelectItem>
            <SelectItem value="next">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Próxima etapa
              </div>
            </SelectItem>
            <SelectItem value="submit">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Finalizar quiz
              </div>
            </SelectItem>
            {quiz?.steps.map((step, index) => (
              <SelectItem key={step.id} value={step.id}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <span>
                    Etapa {index + 1}: {step.title}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {getTargetStepDescription(content.targetStep || "next")}
        </p>
      </div>

      {/* Button Variant */}
      <div className="space-y-2">
        <Label htmlFor="button-variant">Estilo do botão</Label>
        <Select
          value={content.variant || "primary"}
          onValueChange={(value) =>
            updateContent({
              variant: value as "primary" | "secondary" | "outline",
            })
          }
        >
          <SelectTrigger id="button-variant">
            <SelectValue placeholder="Selecione o estilo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primário</SelectItem>
            <SelectItem value="secondary">Secundário</SelectItem>
            <SelectItem value="outline">Contorno</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {getVariantPreview(content.variant || "primary").description}
        </p>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label>Visualização</Label>
        <div className="p-4 border rounded-md bg-muted/30">
          <div className="flex justify-center">
            <Button
              variant={
                content.variant === "primary"
                  ? "default"
                  : content.variant === "secondary"
                  ? "secondary"
                  : "outline"
              }
              className="min-w-[120px]"
              disabled
            >
              {content.targetStep === "previous" && (
                <ArrowLeft className="h-4 w-4 mr-2" />
              )}
              {content.label}
              {content.targetStep !== "previous" && (
                <ArrowRight className="h-4 w-4 ml-2" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-1">
          💡 Dicas de conversão
        </h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>
            • Use verbos de ação: &quot;Descobrir&quot;, &quot;Começar&quot;,
            &quot;Continuar&quot;
          </li>
          <li>
            • Seja específico: &quot;Ver meu resultado&quot; vs
            &quot;Continuar&quot;
          </li>
          <li>• Botões primários convertem mais que secundários</li>
        </ul>
      </div>
    </div>
  );
}
