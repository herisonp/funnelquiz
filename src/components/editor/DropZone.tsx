"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface DropZoneProps {
  id?: string;
  className?: string;
  showVisual?: boolean; // Nova prop para controlar se mostra os elementos visuais
}

export default function DropZone({
  id = "canvas-dropzone",
  className,
  showVisual = true,
}: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  // Se não deve mostrar visual, retorna apenas a área de drop invisível
  if (!showVisual) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "absolute inset-0 transition-all duration-300",
          isOver && "bg-primary/5",
          className
        )}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        // Base styling with improved visual hierarchy
        "border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-all duration-300",
        "bg-gradient-to-br from-muted/20 to-muted/10",
        // Hover states
        "hover:border-muted-foreground/40 hover:bg-muted/20",
        // Active drop state with enhanced feedback
        isOver && [
          "border-primary bg-primary/10 shadow-lg",
          "scale-[1.02] transform-gpu",
          "ring-2 ring-primary/20",
          "dropzone-active",
        ],
        // Performance optimizations
        "will-change-transform",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div
          className={cn(
            "rounded-full p-3 mb-3 transition-all duration-300 transform-gpu",
            "will-change-transform",
            isOver
              ? "bg-primary text-primary-foreground scale-110 shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
          )}
        >
          <Plus
            className={cn(
              "h-6 w-6 transition-transform duration-300",
              isOver && "rotate-90"
            )}
          />
        </div>

        <p
          className={cn(
            "text-sm font-medium transition-all duration-300",
            isOver ? "text-primary scale-105" : "text-muted-foreground"
          )}
        >
          {isOver
            ? "Solte o elemento aqui"
            : "Arraste elementos da barra lateral"}
        </p>

        <p
          className={cn(
            "text-xs text-muted-foreground/70 mt-1 transition-opacity duration-300",
            isOver && "opacity-0"
          )}
        >
          Ou clique em um elemento para adicioná-lo
        </p>
      </div>
    </div>
  );
}
