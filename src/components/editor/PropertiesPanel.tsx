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
    selectElement,
  } = useEditorStore();

  const currentStep = quiz?.steps.find((step) => step.id === currentStepId);
  const selectedElement = currentStep?.elements.find(
    (el) => el.id === selectedElementId
  );

  if (!isPropertiesPanelOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-background border-l z-40 transition-transform duration-300"
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
            onClick={() => selectElement(null)}
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
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">
                  Nenhum elemento selecionado
                </h3>
                <p className="text-sm text-muted-foreground">
                  Clique em um elemento no canvas para editar suas propriedades
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
