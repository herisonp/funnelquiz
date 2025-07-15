"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface DropZoneProps {
  className?: string;
}

export default function DropZone({ className }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: "canvas-dropzone",
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 transition-colors",
        isOver && "border-primary bg-primary/5",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div
          className={cn(
            "rounded-full p-3 mb-3 transition-colors",
            isOver
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Plus className="h-6 w-6" />
        </div>
        <p
          className={cn(
            "text-sm font-medium transition-colors",
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
