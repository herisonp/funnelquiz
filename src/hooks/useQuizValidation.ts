"use client";

import { useMemo } from "react";
import { useEditorStore } from "./useEditorStore";
import { QuizValidator, ValidationResult } from "@/lib/quiz-validator";

export function useQuizValidation() {
  const { quiz, currentStepId } = useEditorStore();

  const validation = useMemo((): ValidationResult => {
    return QuizValidator.validate(quiz);
  }, [quiz]);

  const currentStepValidation = useMemo((): ValidationResult => {
    if (!currentStepId) {
      return { isValid: true, errors: [], warnings: [] };
    }
    return QuizValidator.validateStep(quiz, currentStepId);
  }, [quiz, currentStepId]);

  const canPreview = useMemo((): boolean => {
    return QuizValidator.canPreview(quiz);
  }, [quiz]);

  const quickValidationMessage = useMemo((): string | null => {
    return QuizValidator.getQuickValidationMessage(quiz);
  }, [quiz]);

  const getElementErrors = (elementId: string) => {
    return validation.errors.filter(
      (error) => error.type === "element" && error.id === elementId
    );
  };

  const getStepErrors = (stepId: string) => {
    return validation.errors.filter(
      (error) =>
        (error.type === "step" && error.id === stepId) ||
        (error.type === "element" &&
          quiz?.steps
            .find((s) => s.id === stepId)
            ?.elements.some((e) => e.id === error.id))
    );
  };

  const hasErrors = validation.errors.length > 0;
  const hasWarnings = validation.warnings.length > 0;
  const errorCount = validation.errors.length;
  const warningCount = validation.warnings.length;

  return {
    // Validação completa
    validation,
    currentStepValidation,

    // Estados
    canPreview,
    hasErrors,
    hasWarnings,
    errorCount,
    warningCount,

    // Mensagens
    quickValidationMessage,

    // Utilitários
    getElementErrors,
    getStepErrors,
  };
}
