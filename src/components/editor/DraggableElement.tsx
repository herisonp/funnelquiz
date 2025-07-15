"use client";

import { ElementDefinition } from "@/lib/element-definitions";
import { useDraggable } from "@dnd-kit/core";
import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DraggableElementProps {
  element: ElementDefinition;
  icon: LucideIcon;
}

export default function DraggableElement({
  element,
  icon: Icon,
}: DraggableElementProps) {
  const { addElement } = useEditorStore();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `element-${element.type}`,
      data: {
        type: element.type,
        element,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleClick = (e: React.MouseEvent) => {
    // Only handle click if not dragging
    if (!isDragging) {
      e.preventDefault();
      addElement(element.type);
    }
  };

  return (
    <Button
      ref={setNodeRef}
      variant="outline"
      className={cn(
        "w-full justify-start h-auto p-3 cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
      style={style}
      onClick={handleClick}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start gap-3 w-full">
        <div className="mt-0.5">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 text-left">
          <div className="font-medium text-sm">{element.label}</div>
          <div className="text-xs text-muted-foreground">
            {element.description}
          </div>
        </div>
      </div>
    </Button>
  );
}
