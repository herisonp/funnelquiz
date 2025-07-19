"use client";

import { useState } from "react";
import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Plus,
  X,
  AlertTriangle,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";
import { validateStep } from "@/lib/step-validation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StepTemplateSelector from "./StepTemplateSelector";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function StepsVerticalNavigation() {
  const { quiz, currentStepId, setCurrentStep, removeStep } = useEditorStore();
  const [stepToDelete, setStepToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  if (!quiz) return null;

  const handleStepClick = (stepId: string) => {
    setCurrentStep(stepId);
  };

  const handleAddStep = () => {
    if (quiz.steps.length < 5) {
      setIsTemplateDialogOpen(true);
    }
  };

  const handleDeleteStep = (stepId: string) => {
    if (quiz.steps.length > 1) {
      removeStep(stepId);
      setStepToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (stepId: string) => {
    setStepToDelete(stepId);
    setIsDeleteDialogOpen(true);
  };

  const getStepStatus = (stepId: string) => {
    const step = quiz.steps.find((s) => s.id === stepId);
    if (!step) return { status: "empty", count: 0, hasNavigation: false };

    const isLastStep = step.order === quiz.steps.length - 1;
    const validation = validateStep(step, isLastStep);
    const elementCount = step.elements.length;
    const hasNavigation = step.elements.some(
      (el) => el.type === "NAVIGATION_BUTTON"
    );

    return {
      status: validation.status,
      count: elementCount,
      hasNavigation,
      validation,
    };
  };

  const getStepTooltipContent = (stepId: string) => {
    const step = quiz.steps.find((s) => s.id === stepId);
    const status = getStepStatus(stepId);

    if (!step) return "";

    const elementTypes = step.elements.reduce((acc, el) => {
      acc[el.type] = (acc[el.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const elementSummary = Object.entries(elementTypes)
      .map(([type, count]) => {
        const typeNames = {
          TEXT: "Texto",
          MULTIPLE_CHOICE: "Múltipla Escolha",
          NAVIGATION_BUTTON: "Botão de Navegação",
        };
        return `${count} ${typeNames[type as keyof typeof typeNames] || type}`;
      })
      .join(", ");

    return (
      <div className="text-sm max-w-xs">
        <div className="font-medium">{step.title}</div>
        <div className="text-muted-foreground">
          {status.count === 0 ? "Etapa vazia" : elementSummary}
        </div>
        {status.validation && status.validation.issues.length > 0 && (
          <div className="mt-2 space-y-1">
            {status.validation.issues.slice(0, 3).map((issue, index) => (
              <div
                key={index}
                className={`text-xs ${
                  issue.type === "error"
                    ? "text-red-500"
                    : issue.type === "warning"
                    ? "text-yellow-600"
                    : "text-blue-500"
                }`}
              >
                {issue.type === "error"
                  ? "❌"
                  : issue.type === "warning"
                  ? "⚠️"
                  : "ℹ️"}{" "}
                {issue.message}
              </div>
            ))}
            {status.validation.issues.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{status.validation.issues.length - 3} outras questões
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const stepToDeleteData = stepToDelete
    ? quiz.steps.find((s) => s.id === stepToDelete)
    : null;

  return (
    <TooltipProvider>
      <div className="fixed left-0 top-16 w-60 h-[calc(100vh-4rem)] bg-background border-r z-50 hidden md:flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium text-muted-foreground">
            Etapas ({quiz.steps.length}/5)
          </h3>
        </div>

        {/* Steps List */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {quiz.steps.map((step, index) => {
              const isActive = step.id === currentStepId;
              const stepStatus = getStepStatus(step.id);

              return (
                <div key={step.id} className="relative group">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleStepClick(step.id)}
                        className={cn(
                          "h-12 w-full p-3 flex items-center gap-3 text-sm relative transition-all duration-200 justify-start",
                          isActive &&
                            "bg-primary text-primary-foreground shadow-sm",
                          !isActive && "hover:bg-muted"
                        )}
                      >
                        {/* Step number */}
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-xs font-semibold">
                          {index + 1}
                        </div>

                        {/* Step title */}
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">
                            {step.title}
                          </div>
                        </div>

                        {/* Status indicators */}
                        <div className="flex items-center gap-1">
                          {stepStatus.count > 0 && (
                            <Badge
                              variant={
                                stepStatus.status === "warning"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="h-4 px-1.5 text-xs"
                            >
                              {stepStatus.count}
                            </Badge>
                          )}

                          {stepStatus.status === "warning" && (
                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          )}

                          {stepStatus.status === "valid" &&
                            stepStatus.count > 0 && (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            )}

                          {stepStatus.status === "incomplete" && (
                            <AlertCircle className="h-3 w-3 text-red-500" />
                          )}

                          {stepStatus.status === "empty" && (
                            <Circle className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      {getStepTooltipContent(step.id)}
                    </TooltipContent>
                  </Tooltip>

                  {/* Delete button - shown on hover, only if more than 1 step */}
                  {quiz.steps.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(step.id);
                      }}
                    >
                      <X className="h-2.5 w-2.5" />
                    </Button>
                  )}
                </div>
              );
            })}

            {/* Add Step Button - Last item in the list */}
            <div className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddStep}
                    disabled={quiz.steps.length >= 5}
                    className="h-12 w-full p-3 flex items-center gap-3 text-sm border-dashed hover:bg-muted/50 justify-start"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border border-dashed border-current flex items-center justify-center">
                      <Plus className="h-3 w-3" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-sm font-medium">Nova Etapa</span>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {quiz.steps.length >= 5
                    ? "Máximo de 5 etapas no MVP"
                    : "Adicionar nova etapa"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar Etapa</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar a etapa &ldquo;
              {stepToDeleteData?.title}&rdquo;?
              {stepToDeleteData && stepToDeleteData.elements.length > 0 && (
                <span className="block mt-2 font-medium text-destructive">
                  Esta etapa contém {stepToDeleteData.elements.length}{" "}
                  elemento(s) que serão perdidos permanentemente.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => stepToDelete && handleDeleteStep(stepToDelete)}
            >
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Selection Dialog */}
      <StepTemplateSelector
        isOpen={isTemplateDialogOpen}
        onClose={() => setIsTemplateDialogOpen(false)}
        onSelectTemplate={() => {}} // Template selection is handled in StepTemplateSelector
      />
    </TooltipProvider>
  );
}
