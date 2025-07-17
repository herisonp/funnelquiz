"use client";

import { ElementDefinition } from "@/lib/element-definitions";
import { useDraggable } from "@dnd-kit/core";
import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, GripVertical } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    // Só adiciona elemento se não estiver em processo de drag
    if (!isDragging) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Adding element via click:", element.type);
      addElement(element.type);
    }
  };

  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={setNodeRef}
            variant="outline"
            className={cn(
              "w-full justify-start h-auto p-3 cursor-grab active:cursor-grabbing draggable-element group",
              isDragging && "dragging opacity-50 scale-95",
              "hover:bg-muted/50 hover:border-primary/50 transition-all duration-200",
              "touch-action-none" // Importante para touch devices
            )}
            style={style}
            onClick={handleClick}
            {...listeners}
            {...attributes}
            data-draggable="true"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-md bg-muted/50">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="font-medium text-sm truncate">
                  {element.label}
                </div>
              </div>
              <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="space-y-1">
            <div className="font-medium">{element.label}</div>
            <div className="text-xs text-muted-foreground">
              {element.description}
            </div>
            <div className="text-xs text-muted-foreground pt-1 border-t">
              Clique para adicionar ou arraste para posicionar
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
