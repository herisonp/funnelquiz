import { useCallback } from "react";
import { QuizWithSteps } from "@/types/composed";
import { useQuizResponseStore } from "@/stores/useQuizResponseStore";
import { StepNavigationInfo } from "@/types/navigation";

/**
 * Hook avançado para gerenciar navegação do quiz
 * Combina navegação por índice e por ID
 */
export function useQuizNavigationManager(quiz: QuizWithSteps | null) {
  const { currentResponse, goToStep, goToStepById } = useQuizResponseStore();

  // Informações de navegação enriquecidas
  const getNavigationInfo = useCallback((): StepNavigationInfo => {
    if (!quiz || !currentResponse) {
      return {
        currentStepId: "",
        currentStepIndex: 0,
        isFirstStep: true,
        isLastStep: true,
        isCompleted: false,
        progress: 0,
      };
    }

    const currentStepIndex = currentResponse.currentStepIndex;
    const currentStepId =
      currentResponse.currentStepId || quiz.steps[currentStepIndex]?.id || "";

    return {
      currentStepId,
      currentStepIndex,
      isFirstStep: currentStepIndex === 0,
      isLastStep: currentStepIndex === quiz.steps.length - 1,
      isCompleted: currentResponse.isCompleted,
      progress: ((currentStepIndex + 1) / quiz.steps.length) * 100,
    };
  }, [quiz, currentResponse]);

  // Navegação por ID com validação
  const navigateToStepById = useCallback(
    (stepId: string) => {
      if (!quiz) return false;

      const step = quiz.steps.find((s) => s.id === stepId);
      if (!step) return false;

      goToStepById(stepId, quiz);
      return true;
    },
    [quiz, goToStepById]
  );

  // Navegação por índice
  const navigateToStepByIndex = useCallback(
    (stepIndex: number) => {
      if (!quiz || stepIndex < 0 || stepIndex >= quiz.steps.length) {
        return false;
      }

      goToStep(stepIndex);
      return true;
    },
    [quiz, goToStep]
  );

  // Navegação inteligente (próximo/anterior)
  const navigateNext = useCallback(() => {
    const navInfo = getNavigationInfo();
    if (navInfo.isLastStep) return false;

    return navigateToStepByIndex(navInfo.currentStepIndex + 1);
  }, [getNavigationInfo, navigateToStepByIndex]);

  const navigatePrevious = useCallback(() => {
    const navInfo = getNavigationInfo();
    if (navInfo.isFirstStep) return false;

    return navigateToStepByIndex(navInfo.currentStepIndex - 1);
  }, [getNavigationInfo, navigateToStepByIndex]);

  // Verificar se uma etapa existe
  const stepExists = useCallback(
    (stepId: string): boolean => {
      if (!quiz) return false;
      return quiz.steps.some((step) => step.id === stepId);
    },
    [quiz]
  );

  // Obter dados de uma etapa por ID
  const getStepById = useCallback(
    (stepId: string) => {
      if (!quiz) return null;
      return quiz.steps.find((step) => step.id === stepId) || null;
    },
    [quiz]
  );

  // Obter histórico de navegação
  const getNavigationHistory = useCallback(() => {
    return currentResponse?.navigationHistory || [];
  }, [currentResponse]);

  return {
    // Estado
    navigationInfo: getNavigationInfo(),
    navigationHistory: getNavigationHistory(),

    // Navegação
    navigateToStepById,
    navigateToStepByIndex,
    navigateNext,
    navigatePrevious,

    // Utilitários
    stepExists,
    getStepById,
  };
}
