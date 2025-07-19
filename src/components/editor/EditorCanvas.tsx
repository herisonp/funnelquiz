"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DropZone from "./DropZone";
import SortableElement from "./SortableElement";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="flex-1 flex flex-col bg-muted/30">
      {/* Canvas content area with improved visual container */}
      <ScrollArea className="flex-1">
        <div className="p-6 min-h-full">
          {/* Canvas container with visual improvements */}
          <div
            className={cn(
              // Base canvas styling
              "mx-auto max-w-4xl min-h-[calc(100vh-12rem)] bg-background flex flex-col items-center justify-center",
              "rounded-lg border shadow-sm canvas-container animate-canvas-enter",
              // Interactive states
              "canvas-deselect-area",
              selectedElementId && "cursor-pointer has-selection",
              // Hover and focus states
              "hover:shadow-md focus-within:ring-2 focus-within:ring-primary/20",
              // Better visual hierarchy
              "relative overflow-hidden transition-all duration-200"
            )}
            onClick={handleCanvasClick}
          >
            <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
              {/* Drop zone principal que cobre todo o canvas */}
              <DropZone
                id="main-canvas-dropzone"
                className="w-full h-full"
                showVisual={elements.length === 0}
              />

              {/* Conteúdo do canvas */}
              <div className="w-full h-full flex flex-col items-center justify-center relative z-10">
                <SortableContext
                  items={elements.map((el) => el.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="w-full space-y-6">
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
      </ScrollArea>
    </div>
  );
}
