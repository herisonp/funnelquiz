"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import { ElementWrapper } from "./ElementWrapper";
import ElementRenderer from "./ElementRenderer";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function QuizPreview() {
  const {
    quiz,
    currentStepId,
    selectedElementId,
    selectElement,
    removeElement,
    isPreviewMode,
  } = useEditorStore();

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

  if (elements.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          title="Nenhum elemento ainda"
          description={
            isPreviewMode
              ? "Volte ao modo edição para adicionar elementos ao seu quiz."
              : "Arraste elementos da sidebar para começar a criar seu quiz."
          }
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex-1 flex flex-col",
        isPreviewMode ? "bg-background" : "bg-muted/30"
      )}
    >
      {/* Preview header */}
      {isPreviewMode && (
        <div className="p-6 border-b bg-background">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-muted-foreground mt-2">{quiz.description}</p>
            )}
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span>{currentStep.title}</span>
              <span>•</span>
              <span>
                Etapa {(currentStep.order || 0) + 1} de {quiz.steps.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <ScrollArea className="flex-1">
        <div
          className={cn(
            "p-6 min-h-full canvas-deselect-area transition-colors duration-200",
            isPreviewMode ? "bg-gradient-to-b from-background to-muted/20" : "",
            selectedElementId && "cursor-pointer hover:bg-muted/10"
          )}
          onClick={handleCanvasClick}
        >
          <div className="max-w-2xl mx-auto space-y-6 pb-20">
            {elements.map((element) => (
              <ElementWrapper
                key={element.id}
                element={element}
                isSelected={selectedElementId === element.id}
                onSelect={() => selectElement(element.id)}
                onDelete={() => removeElement(element.id)}
                className={cn(
                  "transition-all duration-200",
                  isPreviewMode &&
                    "bg-background/50 rounded-lg p-4 border border-border/50"
                )}
              >
                <ElementRenderer element={element} />
              </ElementWrapper>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
