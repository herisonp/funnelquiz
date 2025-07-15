"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

export default function StepsNavigation() {
  const { quiz, currentStepId, setCurrentStep, addStep, removeStep } =
    useEditorStore();

  if (!quiz) return null;

  const handleAddStep = () => {
    if (quiz.steps.length < 5) {
      // MVP limit
      addStep();
    }
  };

  const handleRemoveStep = (stepId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (quiz.steps.length > 1) {
      // Minimum 1 step
      removeStep(stepId);
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {quiz.steps.map((step) => (
        <div key={step.id} className="relative group">
          <Button
            variant={currentStepId === step.id ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentStep(step.id)}
            className={cn("min-w-0 relative")}
          >
            <span className="truncate">{step.title}</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              {step.elements.length}
            </Badge>
          </Button>
          {quiz.steps.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleRemoveStep(step.id, e)}
              className="absolute -top-2 -right-2 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}

      {quiz.steps.length < 5 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddStep}
          className="min-w-0"
        >
          <Plus className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Nova Etapa</span>
        </Button>
      )}
    </div>
  );
}
