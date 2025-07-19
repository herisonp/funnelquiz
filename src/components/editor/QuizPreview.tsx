"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import ElementWrapper from "./ElementWrapper";
import ElementRenderer from "./ElementRenderer";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function QuizPreview() {
  const {
    quiz,
    currentStepId,
    selectedElementId,
    selectElement,
    removeElement,
  } = useEditorStore();

  const currentStep = quiz?.steps.find((step) => step.id === currentStepId);
  const elements = currentStep?.elements || [];

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
          description="Arraste elementos da sidebar para começar a criar seu quiz."
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-muted/30">
      {/* Content area */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <ScrollArea className="h-full">
            {elements.map((element) => (
              <ElementWrapper
                key={element.id}
                element={element}
                isSelected={selectedElementId === element.id}
                onSelect={() => selectElement(element.id)}
                onDelete={() => removeElement(element.id)}
                className="transition-all duration-200 bg-background/50 rounded-lg p-4 border border-border/50"
              >
                <ElementRenderer element={element} />
              </ElementWrapper>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
