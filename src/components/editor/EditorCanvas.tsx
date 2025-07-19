"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import { useQuizValidation } from "@/hooks/useQuizValidation";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DropZone from "./DropZone";
import SortableElement from "./SortableElement";
import QuizPreview from "./QuizPreview";
import EmptyCanvasState from "./EmptyCanvasState";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function EditorCanvas() {
  const {
    quiz,
    currentStepId,
    isPreviewMode,
    selectElement,
    selectedElementId,
  } = useEditorStore();
  const { currentStepValidation } = useQuizValidation();

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

  // Render preview mode
  if (isPreviewMode) {
    return <QuizPreview />;
  }

  // Render editor mode
  return (
    <div className="flex-1 flex flex-col bg-muted/30">
      {/* Canvas header */}
      <div className="p-4 border-b bg-background shadow-sm">
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

      {/* Canvas content area with improved visual container */}
      <ScrollArea className="flex-1">
        <div className="p-6 min-h-full">
          {/* Canvas container with visual improvements */}
          <div
            className={cn(
              // Base canvas styling
              "mx-auto max-w-4xl min-h-[calc(100vh-12rem)] bg-background",
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
            {/* Canvas content */}
            <div className="p-8">
              {elements.length === 0 ? (
                <EmptyCanvasState />
              ) : (
                <SortableContext
                  items={elements.map((el) => el.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-6 pb-20">
                    {/* Drop zone principal */}
                    <DropZone
                      id="canvas-dropzone"
                      className="h-20 transform-gpu"
                    />

                    {elements.map((element) => (
                      <SortableElement key={element.id} element={element} />
                    ))}

                    {/* Drop zone no final */}
                    <DropZone
                      id="canvas-dropzone-end"
                      className="h-16 border-muted-foreground/15 transform-gpu"
                    />
                  </div>
                </SortableContext>
              )}
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
