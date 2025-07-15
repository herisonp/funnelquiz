"use client";

import { Element } from "@prisma/client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore } from "@/hooks/useEditorStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical, Trash2, Settings } from "lucide-react";

interface ElementRendererProps {
  element: Element;
}

export default function ElementRenderer({ element }: ElementRendererProps) {
  const { selectedElementId, selectElement, removeElement } = useEditorStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedElementId === element.id;

  const handleSelect = () => {
    selectElement(element.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja excluir este elemento?")) {
      removeElement(element.id);
    }
  };

  const renderElementContent = () => {
    try {
      const content = JSON.parse(element.content as string);

      switch (element.type) {
        case "TEXT":
          return (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Texto
              </div>
              <div
                className={cn(
                  "min-h-[2rem]",
                  content.fontSize === "sm" && "text-sm",
                  content.fontSize === "lg" && "text-lg",
                  content.fontSize === "xl" && "text-xl",
                  content.fontSize === "2xl" && "text-2xl",
                  content.fontWeight === "medium" && "font-medium",
                  content.fontWeight === "semibold" && "font-semibold",
                  content.fontWeight === "bold" && "font-bold",
                  content.textAlign === "center" && "text-center",
                  content.textAlign === "right" && "text-right"
                )}
              >
                {content.text || "Texto vazio"}
              </div>
            </div>
          );

        case "MULTIPLE_CHOICE":
          return (
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground">
                Múltipla Escolha
              </div>
              <div className="font-medium">
                {content.question || "Pergunta não definida"}
              </div>
              <div className="space-y-2">
                {content.options?.map(
                  (option: { id: string; text: string }, index: number) => (
                    <div
                      key={option.id || index}
                      className="flex items-center gap-2"
                    >
                      <div className="w-4 h-4 border rounded"></div>
                      <span className="text-sm">{option.text}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          );

        case "NAVIGATION_BUTTON":
          return (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Botão de Navegação
              </div>
              <Button
                variant={content.variant || "default"}
                size={content.size || "default"}
                className="pointer-events-none"
              >
                {content.text || "Botão"}
              </Button>
            </div>
          );

        default:
          return (
            <div className="text-sm text-muted-foreground">
              Elemento desconhecido: {element.type}
            </div>
          );
      }
    } catch {
      return (
        <div className="text-sm text-destructive">
          Erro ao renderizar elemento
        </div>
      );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group relative", isDragging && "opacity-50")}
    >
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md",
          isSelected && "ring-2 ring-primary ring-offset-2"
        )}
        onClick={handleSelect}
      >
        <CardContent className="p-4">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Actions */}
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleSelect}
            >
              <Settings className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Element content */}
          <div className="mt-2">{renderElementContent()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
