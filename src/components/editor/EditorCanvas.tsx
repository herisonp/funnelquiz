"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import { useQuizValidation } from "@/hooks/useQuizValidation";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ElementType } from "@prisma/client";
import DropZone from "./DropZone";
import ElementRenderer from "./ElementRenderer";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpText } from "@/components/ui/tooltip-help";

export default function EditorCanvas() {
  const { quiz, currentStepId, addElement, moveElement } = useEditorStore();
  const { currentStepValidation } = useQuizValidation();

  const currentStep = quiz?.steps.find((step) => step.id === currentStepId);
  const elements = currentStep?.elements || [];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle dropping from sidebar (new element)
    if (active.id.toString().startsWith("element-")) {
      const elementType = active.data.current?.type as ElementType;
      if (elementType) {
        addElement(elementType);
      }
      return;
    }

    // Handle reordering existing elements
    if (active.id !== over.id) {
      const activeIndex = elements.findIndex((el) => el.id === active.id);
      const overIndex = elements.findIndex((el) => el.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        moveElement(active.id.toString(), overIndex);
      }
    }
  };

  if (!quiz || !currentStep) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          title="Nenhum quiz selecionado"
          description="Selecione ou crie um quiz para começar a editar."
        />
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex-1 flex flex-col bg-muted/30">
        {/* Canvas header */}
        <div className="p-4 border-b bg-background">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{currentStep.title}</h2>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {elements.length} elemento{elements.length !== 1 ? "s" : ""}
                </p>
                {currentStepValidation.errors.length > 0 && (
                  <span className="text-xs text-destructive">
                    • {currentStepValidation.errors.length} erro
                    {currentStepValidation.errors.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Canvas content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {elements.length === 0 ? (
              <div className="space-y-4">
                <DropZone />
                <HelpText className="text-center">
                  Arraste elementos da sidebar para começar ou use os atalhos:{" "}
                  <kbd className="px-1 py-0.5 text-xs bg-muted rounded border">
                    Delete
                  </kbd>{" "}
                  para remover,{" "}
                  <kbd className="px-1 py-0.5 text-xs bg-muted rounded border">
                    Esc
                  </kbd>{" "}
                  para deselecionar
                </HelpText>
              </div>
            ) : (
              <SortableContext
                items={elements.map((el) => el.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4 max-w-2xl mx-auto">
                  {elements.map((element) => (
                    <ElementRenderer key={element.id} element={element} />
                  ))}

                  {/* Drop zone at the end */}
                  <DropZone />
                </div>
              </SortableContext>
            )}
          </div>
        </ScrollArea>
      </div>

      <DragOverlay>
        {/* Drag overlay content will be implemented when needed */}
      </DragOverlay>
    </DndContext>
  );
}
