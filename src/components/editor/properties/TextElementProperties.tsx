"use client";

import { Element } from "@prisma/client";
import { TextElementContent, isTextElementContent } from "@/types/composed";
import { useEditorStore } from "@/hooks/useEditorStore";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Type, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface TextElementPropertiesProps {
  element: Element;
}

export function TextElementProperties({ element }: TextElementPropertiesProps) {
  const { updateElement } = useEditorStore();

  // Parse content
  let content: TextElementContent;
  try {
    const contentStr =
      typeof element.content === "string"
        ? element.content
        : JSON.stringify(element.content);
    const parsed = JSON.parse(contentStr);
    content = isTextElementContent(parsed)
      ? parsed
      : {
          text: "",
          fontSize: "base",
          textAlign: "left",
        };
  } catch {
    content = {
      text: "",
      fontSize: "base",
      textAlign: "left",
    };
  }

  const updateContent = (updates: Partial<TextElementContent>) => {
    const newContent = { ...content, ...updates };
    updateElement(element.id, {
      content: JSON.stringify(newContent),
    });
  };

  const textAlignOptions = [
    { value: "left", label: "Esquerda", icon: AlignLeft },
    { value: "center", label: "Centro", icon: AlignCenter },
    { value: "right", label: "Direita", icon: AlignRight },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-2 pb-2 border-b">
        <Type className="h-4 w-4" />
        <h3 className="font-medium">Propriedades do Texto</h3>
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <Label htmlFor="text-content">Conteúdo</Label>
        <Textarea
          id="text-content"
          value={content.text}
          onChange={(e) => updateContent({ text: e.target.value })}
          placeholder="Digite o texto..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <Label htmlFor="font-size">Tamanho da fonte</Label>
        <Select
          value={content.fontSize || "base"}
          onValueChange={(value) =>
            updateContent({
              fontSize: value as "sm" | "base" | "lg" | "xl" | "2xl",
            })
          }
        >
          <SelectTrigger id="font-size">
            <SelectValue placeholder="Selecione o tamanho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Pequeno</SelectItem>
            <SelectItem value="base">Normal</SelectItem>
            <SelectItem value="lg">Grande</SelectItem>
            <SelectItem value="xl">Extra Grande</SelectItem>
            <SelectItem value="2xl">Extra Extra Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Font Weight */}
      <div className="space-y-2">
        <Label htmlFor="font-weight">Peso da fonte</Label>
        <Select
          value={content.fontWeight || "normal"}
          onValueChange={(value) =>
            updateContent({
              fontWeight: value as "normal" | "medium" | "semibold" | "bold",
            })
          }
        >
          <SelectTrigger id="font-weight">
            <SelectValue placeholder="Selecione o peso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="medium">Médio</SelectItem>
            <SelectItem value="semibold">Semi-negrito</SelectItem>
            <SelectItem value="bold">Negrito</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Text Alignment */}
      <div className="space-y-2">
        <Label>Alinhamento</Label>
        <div className="flex gap-1">
          {textAlignOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant={
                  content.textAlign === option.value ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  updateContent({
                    textAlign: option.value as "left" | "center" | "right",
                  })
                }
                className="flex-1"
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-2">
        <Label htmlFor="text-color">Cor personalizada</Label>
        <div className="flex gap-2">
          <input
            id="text-color"
            type="color"
            value={content.color || "#000000"}
            onChange={(e) => updateContent({ color: e.target.value })}
            className="w-10 h-10 rounded border cursor-pointer"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateContent({ color: undefined })}
            className="flex-1"
          >
            Usar cor padrão
          </Button>
        </div>
      </div>
    </div>
  );
}
