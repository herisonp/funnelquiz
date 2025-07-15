"use client";

import { Element } from "@prisma/client";
import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface ElementPropertiesProps {
  element: Element;
}

interface ContentOption {
  id: string;
  text: string;
}

type ElementContentType = Record<string, unknown> & {
  text?: string;
  question?: string;
  options?: ContentOption[];
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  variant?: string;
  size?: string;
  action?: string;
};

export default function ElementProperties({ element }: ElementPropertiesProps) {
  const { updateElement } = useEditorStore();
  const [content, setContent] = useState<ElementContentType | null>(null);

  useEffect(() => {
    try {
      setContent(JSON.parse(element.content as string));
    } catch {
      setContent({});
    }
  }, [element.content]);

  const updateContent = (updates: Partial<ElementContentType>) => {
    const newContent = { ...content, ...updates };
    setContent(newContent);
    updateElement(element.id, {
      content: JSON.stringify(newContent),
    });
  };

  if (!content) return null;

  const renderTextProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Texto</Label>
        <Textarea
          id="text"
          value={content.text || ""}
          onChange={(e) => updateContent({ text: e.target.value })}
          placeholder="Digite o texto..."
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="fontSize">Tamanho da Fonte</Label>
        <Select
          value={content.fontSize || "base"}
          onValueChange={(value) => updateContent({ fontSize: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Pequeno</SelectItem>
            <SelectItem value="base">Normal</SelectItem>
            <SelectItem value="lg">Grande</SelectItem>
            <SelectItem value="xl">Extra Grande</SelectItem>
            <SelectItem value="2xl">Muito Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="fontWeight">Peso da Fonte</Label>
        <Select
          value={content.fontWeight || "normal"}
          onValueChange={(value) => updateContent({ fontWeight: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="medium">Médio</SelectItem>
            <SelectItem value="semibold">Semi-negrito</SelectItem>
            <SelectItem value="bold">Negrito</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="textAlign">Alinhamento</Label>
        <Select
          value={content.textAlign || "left"}
          onValueChange={(value) => updateContent({ textAlign: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Esquerda</SelectItem>
            <SelectItem value="center">Centro</SelectItem>
            <SelectItem value="right">Direita</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderMultipleChoiceProperties = () => {
    const addOption = () => {
      const newOption = {
        id: `option-${Date.now()}`,
        text: "Nova opção",
      };
      updateContent({
        options: [...(content.options || []), newOption],
      });
    };

    const updateOption = (index: number, updates: Partial<ContentOption>) => {
      const newOptions = [...(content?.options || [])];
      newOptions[index] = { ...newOptions[index], ...updates };
      updateContent({ options: newOptions });
    };

    const removeOption = (index: number) => {
      const newOptions =
        content?.options?.filter((_, i: number) => i !== index) || [];
      updateContent({ options: newOptions });
    };

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="question">Pergunta</Label>
          <Input
            id="question"
            value={content.question || ""}
            onChange={(e) => updateContent({ question: e.target.value })}
            placeholder="Digite a pergunta..."
            className="mt-1"
          />
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Opções</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-2">
            {content?.options?.map((option: ContentOption, index: number) => (
              <div key={option.id || index} className="flex gap-2">
                <Input
                  value={option.text || ""}
                  onChange={(e) =>
                    updateOption(index, { text: e.target.value })
                  }
                  placeholder={`Opção ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeOption(index)}
                  disabled={(content?.options?.length || 0) <= 2}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderNavigationButtonProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="buttonText">Texto do Botão</Label>
        <Input
          id="buttonText"
          value={content.text || ""}
          onChange={(e) => updateContent({ text: e.target.value })}
          placeholder="Digite o texto do botão..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="variant">Variante</Label>
        <Select
          value={content.variant || "default"}
          onValueChange={(value) => updateContent({ variant: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Padrão</SelectItem>
            <SelectItem value="outline">Contorno</SelectItem>
            <SelectItem value="ghost">Fantasma</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="size">Tamanho</Label>
        <Select
          value={content.size || "default"}
          onValueChange={(value) => updateContent({ size: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Pequeno</SelectItem>
            <SelectItem value="default">Normal</SelectItem>
            <SelectItem value="lg">Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="action">Ação</Label>
        <Select
          value={content.action || "next"}
          onValueChange={(value) => updateContent({ action: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="next">Próxima Etapa</SelectItem>
            <SelectItem value="previous">Etapa Anterior</SelectItem>
            <SelectItem value="submit">Enviar</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-foreground mb-1">
          {element.type === "TEXT" && "Elemento de Texto"}
          {element.type === "MULTIPLE_CHOICE" && "Múltipla Escolha"}
          {element.type === "NAVIGATION_BUTTON" && "Botão de Navegação"}
        </h3>
        <p className="text-xs text-muted-foreground">
          Configure as propriedades do elemento selecionado
        </p>
      </div>

      <Separator />

      {element.type === "TEXT" && renderTextProperties()}
      {element.type === "MULTIPLE_CHOICE" && renderMultipleChoiceProperties()}
      {element.type === "NAVIGATION_BUTTON" &&
        renderNavigationButtonProperties()}
    </div>
  );
}
