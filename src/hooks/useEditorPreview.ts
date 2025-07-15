import { useEditorStore } from "./useEditorStore";
import { useQuizResponseStore } from "@/stores/useQuizResponseStore";
import { useEffect } from "react";

/**
 * Hook para integração entre o editor e o preview do quiz
 * Gerencia a sincronização de dados e estados entre as duas interfaces
 */
export function useEditorPreview() {
  const { quiz, isPreviewMode, togglePreviewMode } = useEditorStore();
  const { resetQuiz, startQuiz } = useQuizResponseStore();

  // Reset quiz response when entering preview mode
  useEffect(() => {
    if (isPreviewMode && quiz) {
      resetQuiz();
      startQuiz(quiz.id);
    }
  }, [isPreviewMode, quiz, resetQuiz, startQuiz]);

  const enterPreviewMode = () => {
    if (quiz) {
      togglePreviewMode();
    }
  };

  const exitPreviewMode = () => {
    if (isPreviewMode) {
      togglePreviewMode();
      resetQuiz();
    }
  };

  const canPreview = Boolean(quiz && quiz.steps.length > 0);

  const previewValidation = {
    hasQuiz: Boolean(quiz),
    hasSteps: Boolean(quiz && quiz.steps.length > 0),
    hasElements: Boolean(
      quiz && quiz.steps.some((step) => step.elements.length > 0)
    ),
    isValid: canPreview,
  };

  return {
    // State
    quiz,
    isPreviewMode,
    canPreview,
    previewValidation,

    // Actions
    enterPreviewMode,
    exitPreviewMode,
    togglePreviewMode,
  };
}
