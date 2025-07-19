"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Element } from "@/types/composed";
import { QuickTooltip } from "@/components/ui/tooltip-help";

interface ElementWrapperProps {
  element: Element;
  children: ReactNode;
  isSelected: boolean;
  isDragging?: boolean;
  onSelect: () => void;
  onDelete: () => void;
  className?: string;
}

export default function ElementWrapper({
  children,
  isSelected,
  isDragging = false,
  onSelect,
  onDelete,
  className,
}: ElementWrapperProps) {
  return (
    <div
      className={cn(
        "group relative transition-all duration-200",
        isSelected && "ring-2 ring-primary ring-offset-2",
        isDragging && "opacity-50",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Content */}
      <div className="relative transition-all duration-200">{children}</div>

      {/* Drag handle */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center justify-center w-6 h-6 bg-muted border border-border rounded cursor-grab">
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/90 backdrop-blur-sm border border-border rounded-md shadow-sm p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <QuickTooltip content="Excluir elemento">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </QuickTooltip>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none border-2 border-primary rounded-sm" />
      )}
    </div>
  );
}
