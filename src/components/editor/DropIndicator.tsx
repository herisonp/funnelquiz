"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DropIndicatorProps {
  id: string;
  className?: string;
  children?: React.ReactNode;
}

export default function DropIndicator({
  id,
  className,
  children,
}: DropIndicatorProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "transition-all duration-200",
        isOver && "scale-105",
        className
      )}
    >
      {children}
      {isOver && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded-lg pointer-events-none animate-pulse" />
      )}
    </div>
  );
}
