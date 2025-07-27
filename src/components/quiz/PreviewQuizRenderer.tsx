"use client";

import { QuizWithSteps } from "@/types/composed";
import { useQuizResponse } from "@/hooks/useQuizResponse";
import { QuizContainer } from "./QuizContainer";
import { QuizElementRenderer } from "./QuizElementRenderer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PreviewQuizRendererProps {
  quiz: QuizWithSteps;
  onBack?: () => void;
  allowStepNavigation?: boolean;
}

export function PreviewQuizRenderer({
  quiz,
  onBack,
  allowStepNavigation = false,
}: PreviewQuizRendererProps) {
  const {
    navigationInfo,
    handleNavigation,
    goToPrevious,
    goToNext,
    goToStepByIndex,
    canProceedFromCurrentStep,
  } = useQuizResponse(quiz);

  const { currentStepIndex, isFirstStep, isLastStep, progress, currentStep } =
    navigationInfo;

  // Show error if no current step
  if (!currentStep) {
    return (
      <QuizContainer
        currentStep={1}
        totalSteps={quiz.steps.length}
        progress={0}
        onBack={onBack}
        title="Erro"
        colors={quiz.colors}
      >
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-destructive">
            Etapa não encontrada
          </h2>
          <p className="text-muted-foreground">
            Ocorreu um erro ao carregar a etapa atual do quiz.
          </p>
          {onBack && (
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Editor
            </Button>
          )}
        </div>
      </QuizContainer>
    );
  }

  // Check if current step has navigation buttons
  const hasNavigationButtons = currentStep.elements.some(
    (element) => element.type === "NAVIGATION_BUTTON"
  );

  const canProceed = canProceedFromCurrentStep();

  return (
    <QuizContainer
      currentStep={currentStepIndex + 1}
      totalSteps={quiz.steps.length}
      progress={progress}
      onBack={onBack}
      onStepClick={allowStepNavigation ? goToStepByIndex : undefined}
      allowNavigation={allowStepNavigation}
      colors={quiz.colors}
    >
      <div className="space-y-4">
        {/* Render step elements */}
        {currentStep.elements
          .sort((a, b) => a.order - b.order)
          .map((element) => (
            <QuizElementRenderer
              key={element.id}
              element={element}
              onNavigate={handleNavigation}
              isLastStep={isLastStep}
              canProceed={canProceed}
              quizColors={quiz.colors}
              quizFonts={quiz.fonts}
            />
          ))}

        {/* Auto navigation if no navigation buttons present */}
        {!hasNavigationButtons && (
          <div className="flex justify-between pt-8 border-t">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={isFirstStep}
              className="min-w-32"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            <Button
              onClick={goToNext}
              disabled={!canProceed}
              className="min-w-32"
            >
              {isLastStep ? "Finalizar" : "Próximo"}
              {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        )}

        {/* Validation message */}
        {!canProceed && !isFirstStep && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Complete todos os campos obrigatórios para continuar
            </p>
          </div>
        )}
      </div>
    </QuizContainer>
  );
}
