import { useCallback, useEffect } from "react";
import { QuizWithSteps } from "@/types/composed";
import { useQuizResponseStore } from "@/stores/useQuizResponseStore";

export function useQuizResponse(quiz: QuizWithSteps | null) {
  const {
    currentResponse,
    startQuiz,
    setResponse,
    goToStep,
    completeQuiz,
    resetQuiz,
    getResponse,
    getProgress,
    canProceed,
  } = useQuizResponseStore();

  // Initialize quiz when component mounts
  useEffect(() => {
    if (quiz && !currentResponse) {
      startQuiz(quiz.id);
    }
  }, [quiz, currentResponse, startQuiz]);

  // Navigation actions
  const goToNext = useCallback(() => {
    if (!quiz || !currentResponse) return;

    const nextStepIndex = currentResponse.currentStepIndex + 1;
    if (nextStepIndex < quiz.steps.length) {
      goToStep(nextStepIndex);
    } else {
      completeQuiz();
    }
  }, [quiz, currentResponse, goToStep, completeQuiz]);

  const goToPrevious = useCallback(() => {
    if (!currentResponse) return;

    const prevStepIndex = currentResponse.currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      goToStep(prevStepIndex);
    }
  }, [currentResponse, goToStep]);

  const goToStepByIndex = useCallback(
    (stepIndex: number) => {
      if (!quiz || stepIndex < 0 || stepIndex >= quiz.steps.length) return;
      goToStep(stepIndex);
    },
    [quiz, goToStep]
  );

  // Navigation info
  const navigationInfo = {
    currentStepIndex: currentResponse?.currentStepIndex || 0,
    isFirstStep: (currentResponse?.currentStepIndex || 0) === 0,
    isLastStep: quiz
      ? (currentResponse?.currentStepIndex || 0) === quiz.steps.length - 1
      : true,
    progress: quiz ? getProgress(quiz.steps.length) : 0,
    currentStep: quiz?.steps[currentResponse?.currentStepIndex || 0] || null,
    isCompleted: currentResponse?.isCompleted || false,
  };

  // Check if user can proceed from current step
  const canProceedFromCurrentStep = useCallback(() => {
    if (!navigationInfo.currentStep) return false;

    const requiredElements = navigationInfo.currentStep.elements
      .filter((element) => {
        if (element.type === "MULTIPLE_CHOICE") {
          const content =
            typeof element.content === "string"
              ? JSON.parse(element.content)
              : element.content;
          return content?.required === true;
        }
        return false;
      })
      .map((element) => element.id);

    return canProceed(requiredElements);
  }, [navigationInfo.currentStep, canProceed]);

  // Handle navigation based on target
  const handleNavigation = useCallback(
    (target: string) => {
      switch (target) {
        case "next":
          goToNext();
          break;
        case "previous":
          goToPrevious();
          break;
        default:
          // Handle specific step ID navigation in the future
          break;
      }
    },
    [goToNext, goToPrevious]
  );

  return {
    // State
    currentResponse,
    navigationInfo,

    // Actions
    setResponse,
    handleNavigation,
    goToNext,
    goToPrevious,
    goToStepByIndex,
    completeQuiz,
    resetQuiz,

    // Helpers
    getResponse,
    canProceedFromCurrentStep,
  };
}
