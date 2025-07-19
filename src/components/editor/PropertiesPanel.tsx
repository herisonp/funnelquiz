"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Settings, X } from "lucide-react";
import ElementProperties from "./ElementProperties";

export default function PropertiesPanel() {
  const {
    quiz,
    currentStepId,
    selectedElementId,
    isPropertiesPanelOpen,
    togglePropertiesPanel,
  } = useEditorStore();

  const currentStep = quiz?.steps.find((step) => step.id === currentStepId);
  const selectedElement = currentStep?.elements.find(
    (el) => el.id === selectedElementId
  );

  return (
    <div
      className={cn(
        "fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-background border-l z-40 transition-transform duration-300",
        isPropertiesPanelOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <h2 className="font-semibold">Propriedades</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePropertiesPanel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {selectedElement ? (
              <ElementProperties element={selectedElement} />
            ) : (
              <div className="space-y-6">
                {/* Step Information */}
                {currentStep && (
                  <div>
                    <h3 className="font-medium text-foreground mb-3">
                      Informações do Step
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Título
                        </label>
                        <p className="text-sm font-medium">
                          {currentStep.title}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Elementos
                        </label>
                        <p className="text-sm font-medium">
                          {currentStep.elements.length} elemento(s)
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Ordem
                        </label>
                        <p className="text-sm font-medium">
                          {currentStep.order}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Help Text */}
                <div className="text-center py-4">
                  <Settings className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-foreground mb-2">
                    Selecione um elemento
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Clique em um elemento no canvas para editar suas
                    propriedades
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
