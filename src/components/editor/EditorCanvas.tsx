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
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpText } from "@/components/ui/tooltip-help";
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
        <div
          className={cn(
            "p-6 canvas-deselect-area min-h-full transition-colors duration-200",
            selectedElementId && "cursor-pointer hover:bg-muted/20"
          )}
          onClick={handleCanvasClick}
        >
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
                para deselecionar ou clique em área vazia
              </HelpText>
            </div>
          ) : (
            <SortableContext
              items={elements.map((el) => el.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4 max-w-2xl mx-auto pb-20">
                {/* Drop zone principal para teste simples */}
                <DropZone id="canvas-dropzone" className="h-20 p-6" />

                {elements.map((element) => (
                  <SortableElement key={element.id} element={element} />
                ))}

                {/* Drop zone no final */}
                <DropZone
                  id="canvas-dropzone-end"
                  className="h-16 p-4 border-muted-foreground/15"
                />
              </div>
            </SortableContext>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
