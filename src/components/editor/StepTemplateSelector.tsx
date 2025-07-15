"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { stepTemplates, createStepFromTemplate } from "@/lib/step-templates";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEditorStore } from "@/hooks/useEditorStore";

interface StepTemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

export default function StepTemplateSelector({
  isOpen,
  onClose,
  onSelectTemplate,
}: StepTemplateSelectorProps) {
  const { addStep } = useEditorStore();

  const handleSelectTemplate = (templateId: string) => {
    if (templateId === "empty") {
      // Create empty step
      addStep();
      onSelectTemplate(templateId);
      onClose();
      return;
    }

    const templateElements = createStepFromTemplate(templateId);
    if (!templateElements) return;

    // For MVP, we'll add an empty step and the user can manually add elements
    // In a future version, we could add a method to create a step with predefined elements
    addStep();

    onSelectTemplate(templateId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Escolher Template de Etapa</DialogTitle>
          <DialogDescription>
            Selecione um template para começar sua etapa com conteúdo
            pré-definido, ou crie uma etapa vazia.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Empty template option */}
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
            onClick={() => handleSelectTemplate("empty")}
          >
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">📝</div>
              <CardTitle className="text-lg">Etapa Vazia</CardTitle>
              <CardDescription>
                Comece do zero e adicione seus próprios elementos
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Template options */}
          {stepTemplates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
              onClick={() => handleSelectTemplate(template.id)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{template.icon}</div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    Inclui:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {template.elements.map((element, index) => {
                      const elementTypes = {
                        TEXT: "Texto",
                        MULTIPLE_CHOICE: "Múltipla Escolha",
                        NAVIGATION_BUTTON: "Botão de Navegação",
                      };
                      return (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                          {elementTypes[
                            element.type as keyof typeof elementTypes
                          ] || element.type}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
