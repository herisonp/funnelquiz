import { useState, useCallback } from "react";
import { QuizWithSteps } from "@/types/composed";

export interface QuizNavigationState {
  currentStepIndex: number;
  responses: Record<string, unknown>;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  currentStep: QuizWithSteps["steps"][0] | null;
}

export function useQuizNavigation(quiz: QuizWithSteps | null) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, unknown>>({});

  const state: QuizNavigationState = {
    currentStepIndex,
    responses,
    isFirstStep: currentStepIndex === 0,
    isLastStep: quiz ? currentStepIndex === quiz.steps.length - 1 : true,
    progress: quiz ? ((currentStepIndex + 1) / quiz.steps.length) * 100 : 0,
    currentStep: quiz?.steps[currentStepIndex] || null,
  };

  const goToNext = useCallback(() => {
    if (quiz && currentStepIndex < quiz.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [quiz, currentStepIndex]);

  const goToPrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [currentStepIndex]);

  const goToStep = useCallback(
    (stepIndex: number) => {
      if (quiz && stepIndex >= 0 && stepIndex < quiz.steps.length) {
        setCurrentStepIndex(stepIndex);
      }
    },
    [quiz]
  );

  const setResponse = useCallback((elementId: string, value: unknown) => {
    setResponses((prev) => ({
      ...prev,
      [elementId]: value,
    }));
  }, []);

  const getResponse = useCallback(
    (elementId: string) => {
      return responses[elementId];
    },
    [responses]
  );

  const clearResponse = useCallback((elementId: string) => {
    setResponses((prev) => {
      const updated = { ...prev };
      delete updated[elementId];
      return updated;
    });
  }, []);

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setResponses({});
  }, []);

  const canProceed = useCallback(() => {
    if (!state.currentStep) return false;

    // Check if all required elements have responses
    const requiredElements = state.currentStep.elements.filter((element) => {
      if (element.type === "MULTIPLE_CHOICE") {
        const content = element.content as Record<string, unknown>;
        return content.required === true;
      }
      return false;
    });

    return requiredElements.every((element) => {
      const response = responses[element.id];
      if (Array.isArray(response)) {
        return response.length > 0;
      }
      return response !== undefined && response !== null && response !== "";
    });
  }, [state.currentStep, responses]);

  return {
    state,
    actions: {
      goToNext,
      goToPrevious,
      goToStep,
      setResponse,
      getResponse,
      clearResponse,
      reset,
      canProceed,
    },
  };
}
