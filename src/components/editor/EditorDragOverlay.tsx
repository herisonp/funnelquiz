"use client";

import { DragOverlay } from "@dnd-kit/core";
import { ElementDefinition } from "@/lib/element-definitions";
import { Card } from "@/components/ui/card";
import { Type, CheckSquare, ArrowRight } from "lucide-react";

const iconMap = {
  Type,
  CheckSquare,
  ArrowRight,
};

interface DragOverlayElementProps {
  element: ElementDefinition;
}

function DragOverlayElement({ element }: DragOverlayElementProps) {
  const Icon = iconMap[element.icon as keyof typeof iconMap];

  return (
    <Card className="p-3 shadow-xl border-2 border-primary bg-background/95 backdrop-blur-sm drag-overlay">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-primary/10">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
        </div>
        <div>
          <div className="font-medium text-sm">{element.label}</div>
          <div className="text-xs text-muted-foreground">
            {element.description}
          </div>
        </div>
      </div>
    </Card>
  );
}

interface EditorDragOverlayProps {
  activeElement: Record<string, unknown> | null;
}

export default function EditorDragOverlay({
  activeElement,
}: EditorDragOverlayProps) {
  if (!activeElement || !activeElement.element) {
    return null;
  }

  const element = activeElement.element as ElementDefinition;

  return (
    <DragOverlay dropAnimation={{ duration: 200, easing: "ease-out" }}>
      <DragOverlayElement element={element} />
    </DragOverlay>
  );
}
