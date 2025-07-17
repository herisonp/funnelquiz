"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface DropZoneProps {
  id?: string;
  className?: string;
}

export default function DropZone({
  id = "canvas-dropzone",
  className,
}: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 transition-all duration-200",
        isOver && "border-primary bg-primary/5 dropzone-active scale-105",
        "hover:border-muted-foreground/40",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div
          className={cn(
            "rounded-full p-3 mb-3 transition-all duration-200",
            isOver
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Plus className="h-6 w-6" />
        </div>
        <p
          className={cn(
            "text-sm font-medium transition-colors duration-200",
            isOver ? "text-primary" : "text-muted-foreground"
          )}
        >
          {isOver
            ? "Solte o elemento aqui"
            : "Arraste elementos da barra lateral"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Ou clique em um elemento para adicioná-lo
        </p>
      </div>
    </div>
  );
}
