"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import ElementProperties from "./ElementProperties";

export default function PropertiesPanel() {
  const { quiz, currentStepId, selectedElementId, updateStepTitle } =
    useEditorStore();
  const [stepTitle, setStepTitle] = useState("");

  const currentStep = quiz?.steps.find((step) => step.id === currentStepId);
  const selectedElement = currentStep?.elements.find(
    (el) => el.id === selectedElementId
  );

  // Sincronizar o título local com o título da etapa atual
  useEffect(() => {
    if (currentStep?.title) {
      setStepTitle(currentStep.title);
    }
  }, [currentStep?.title]);

  // Função para atualizar o título da etapa
  const handleStepTitleChange = (newTitle: string) => {
    setStepTitle(newTitle);
  };

  // Função para salvar o título quando o campo perde o foco
  const handleStepTitleBlur = () => {
    if (currentStep && stepTitle.trim() && stepTitle !== currentStep.title) {
      updateStepTitle(currentStep.id, stepTitle.trim());
    }
  };

  // Função para salvar o título quando pressionar Enter
  const handleStepTitleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur(); // Remove o foco do campo, acionando o handleStepTitleBlur
    }
  };

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-background border-l z-40">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center p-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <h2 className="font-semibold">Propriedades</h2>
          </div>
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
                        <Input
                          value={stepTitle}
                          onChange={(e) =>
                            handleStepTitleChange(e.target.value)
                          }
                          onBlur={handleStepTitleBlur}
                          onKeyPress={handleStepTitleKeyPress}
                          placeholder="Digite o título da etapa"
                          className="mt-1"
                        />
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
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
