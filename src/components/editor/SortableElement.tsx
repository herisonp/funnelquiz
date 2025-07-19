"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Element } from "@prisma/client";
import { useEditorStore } from "@/hooks/useEditorStore";
import ElementWrapper from "./ElementWrapper";
import { ElementRenderer } from "@/components/common/ElementRenderer";
import { cn } from "@/lib/utils";

interface SortableElementProps {
  element: Element;
}

export default function SortableElement({ element }: SortableElementProps) {
  const { selectedElementId, selectElement, removeElement } = useEditorStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: element.id,
    data: {
      element,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedElementId === element.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative sortable-element",
        isDragging && "dragging opacity-50 scale-95",
        isOver && "over scale-105"
      )}
      {...attributes}
      {...listeners}
    >
      <ElementWrapper
        element={element}
        isSelected={isSelected}
        isDragging={isDragging}
        onSelect={() => selectElement(element.id)}
        onDelete={() => removeElement(element.id)}
      >
        <ElementRenderer element={element} mode="editor" />
      </ElementWrapper>

      {/* Drag handle indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded-lg pointer-events-none" />
      )}
    </div>
  );
}
