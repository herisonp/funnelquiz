"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DropZone from "./DropZone";
import SortableElement from "./SortableElement";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export default function EditorCanvas() {
  const { quiz, currentStepId, selectElement, selectedElementId } =
    useEditorStore();

  const currentStep = quiz?.steps.find((step) => step.id === currentStepId);
  const elements = currentStep?.elements || [];

  // Handle click on canvas to deselect elements
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Check if click was on canvas area or empty space
    const target = e.target as HTMLElement;
    const isCanvasArea =
      target.closest(".canvas-deselect-area") === e.currentTarget;

    if (isCanvasArea) {
      selectElement(null);
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

  // Render editor mode
  return (
    <div className="flex-1 flex flex-col bg-muted/30 overflow-auto">
      {/* Canvas content area with improved visual container */}
      <div className="flex-1 p-6">
        {/* Canvas container with visual improvements */}
        <div
          className={cn(
            // Base canvas styling - alterado para permitir scroll vertical
            "mx-auto max-w-4xl min-h-[calc(100vh-12rem)] bg-background",
            "rounded-lg border shadow-sm canvas-container animate-canvas-enter",
            // Interactive states
            "canvas-deselect-area",
            selectedElementId && "cursor-pointer has-selection",
            // Hover and focus states
            "hover:shadow-md focus-within:ring-2 focus-within:ring-primary/20",
            // Better visual hierarchy - removido overflow-hidden
            "relative transition-all duration-200"
          )}
          onClick={handleCanvasClick}
        >
          <div className="w-full p-8 relative">
            {/* Drop zone principal que cobre todo o canvas */}
            <DropZone
              id="main-canvas-dropzone"
              className={cn(
                "w-full absolute inset-0 z-0",
                elements.length === 0 && "flex items-center justify-center"
              )}
              showVisual={elements.length === 0}
            />

            {/* Conteúdo do canvas */}
            <div className="w-full relative z-10">
              <SortableContext
                items={elements.map((el) => el.id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  className={cn(
                    "w-full space-y-6",
                    elements.length === 0 &&
                      "min-h-[calc(100vh-20rem)] flex items-center justify-center"
                  )}
                >
                  {elements.map((element) => (
                    <SortableElement key={element.id} element={element} />
                  ))}
                </div>
              </SortableContext>
            </div>
          </div>

          {/* Subtle visual indicators */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none transition-all duration-200",
              "ring-0 ring-primary/20",
              selectedElementId && "ring-2"
            )}
          />
        </div>
      </div>
    </div>
  );
}
