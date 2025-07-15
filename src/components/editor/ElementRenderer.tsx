"use client";

import React from "react";
import { Element } from "@prisma/client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore } from "@/hooks/useEditorStore";
import { ElementRenderer as UniversalElementRenderer } from "@/components/common/ElementRenderer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical, Trash2, Settings } from "lucide-react";

interface ElementRendererProps {
  element: Element;
}

function ElementRenderer({ element }: ElementRendererProps) {
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
    if (window.confirm("Tem certeza que deseja excluir este elemento?")) {
      removeElement(element.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group relative", isDragging && "opacity-50 z-50")}
      {...attributes}
      {...listeners}
    >
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md",
          isSelected && "ring-2 ring-primary shadow-md"
        )}
        onClick={handleSelect}
      >
        <CardContent className="p-0 relative">
          <div className="p-4">
            <UniversalElementRenderer
              element={element}
              mode="editor"
              isSelected={isSelected}
              isEditing={true}
            />
          </div>
          <div
            className={cn(
              "absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity",
              isSelected && "opacity-100"
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              aria-label="Excluir elemento"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSelect}
              aria-label="Editar elemento"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              {...listeners}
              {...attributes}
              aria-label="Arrastar elemento"
            >
              <GripVertical className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ElementRenderer;
