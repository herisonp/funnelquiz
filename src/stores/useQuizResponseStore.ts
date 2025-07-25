import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AnswerValue } from "@/types/composed";
import { ElementType } from "@prisma/client";
import {
  QuizResponseValidator,
  ResponseValidationResult,
} from "@/lib/quiz-response-validator";

interface QuizResponse {
  quizId: string;
  sessionId: string;
  responses: Record<string, AnswerValue>;
  currentStepIndex: number;
  startedAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
}

interface QuizResponseState {
  // Current response data
  currentResponse: QuizResponse | null;

  // Validation state
  validationErrors: Record<string, string[]>;
  lastValidationResult: ResponseValidationResult | null;

  // Actions
  startQuiz: (quizId: string) => void;
  setResponse: (elementId: string, value: AnswerValue) => void;
  goToStep: (stepIndex: number) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;

  // Validation actions
  validateStep: (
    elements: Array<{
      id: string;
      type: ElementType;
      content: unknown;
    }>
  ) => ResponseValidationResult;
  clearValidationErrors: () => void;
  removeResponse: (elementId: string) => void;

  // Getters
  getResponse: (elementId: string) => AnswerValue | undefined;
  getProgress: (totalSteps: number) => number;
  canProceed: (requiredElements: string[]) => boolean;
  hasValidationErrors: (elementId?: string) => boolean;
}

const generateSessionId = () => {
  return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useQuizResponseStore = create<QuizResponseState>()(
  devtools(
    persist(
      (set, get) => ({
        currentResponse: null,
        validationErrors: {},
        lastValidationResult: null,

        startQuiz: (quizId: string) => {
          const sessionId = generateSessionId();
          const newResponse: QuizResponse = {
            quizId,
            sessionId,
            responses: {},
            currentStepIndex: 0,
            startedAt: new Date(),
            isCompleted: false,
          };

          set({ currentResponse: newResponse });
        },

        setResponse: (elementId: string, value: AnswerValue) => {
          const { currentResponse } = get();
          if (!currentResponse) return;

          set({
            currentResponse: {
              ...currentResponse,
              responses: {
                ...currentResponse.responses,
                [elementId]: value,
              },
            },
            // Limpar erros de validação para este elemento
            validationErrors: {
              ...get().validationErrors,
              [elementId]: [],
            },
          });
        },

        goToStep: (stepIndex: number) => {
          const { currentResponse } = get();
          if (!currentResponse) return;

          set({
            currentResponse: {
              ...currentResponse,
              currentStepIndex: stepIndex,
            },
          });
        },

        completeQuiz: () => {
          const { currentResponse } = get();
          if (!currentResponse) return;

          set({
            currentResponse: {
              ...currentResponse,
              completedAt: new Date(),
              isCompleted: true,
            },
          });
        },

        resetQuiz: () => {
          set({ currentResponse: null });
        },

        validateStep: (elements) => {
          const { currentResponse } = get();
          if (!currentResponse) return { isValid: false, errors: [] };

          // Converter responses para o formato esperado pelo validador
          const responses: Record<string, unknown> = {};
          Object.entries(currentResponse.responses).forEach(
            ([elementId, value]) => {
              if (value.text !== undefined) {
                responses[elementId] = value.text;
              } else if (value.selectedOptions !== undefined) {
                responses[elementId] = value.selectedOptions;
              } else if (value.multipleChoice !== undefined) {
                responses[elementId] = value.multipleChoice;
              }
            }
          );

          const result = QuizResponseValidator.validateStepResponses(
            elements,
            responses
          );

          // Organizar erros por elemento
          const errorsByElement: Record<string, string[]> = {};
          result.errors.forEach((error) => {
            if (!errorsByElement[error.elementId]) {
              errorsByElement[error.elementId] = [];
            }
            errorsByElement[error.elementId].push(error.message);
          });

          set({
            validationErrors: errorsByElement,
            lastValidationResult: result,
          });

          return result;
        },

        clearValidationErrors: () => {
          set({ validationErrors: {} });
        },

        removeResponse: (elementId: string) => {
          const { currentResponse } = get();
          if (!currentResponse) return;

          const newResponses = { ...currentResponse.responses };
          delete newResponses[elementId];

          set({
            currentResponse: {
              ...currentResponse,
              responses: newResponses,
            },
            // Limpar erros de validação para este elemento
            validationErrors: {
              ...get().validationErrors,
              [elementId]: [],
            },
          });
        },

        getResponse: (elementId: string) => {
          const { currentResponse } = get();
          return currentResponse?.responses[elementId];
        },

        getProgress: (totalSteps: number) => {
          const { currentResponse } = get();
          if (!currentResponse || totalSteps === 0) return 0;
          return ((currentResponse.currentStepIndex + 1) / totalSteps) * 100;
        },

        canProceed: (requiredElements: string[]) => {
          const { currentResponse } = get();
          if (!currentResponse) return false;

          return requiredElements.every((elementId) => {
            const response = currentResponse.responses[elementId];
            if (!response) return false;

            // Check if response has meaningful value
            if (response.text && response.text.trim() === "") return false;
            if (
              response.selectedOptions &&
              response.selectedOptions.length === 0
            )
              return false;
            if (response.multipleChoice) {
              if (Array.isArray(response.multipleChoice)) {
                return response.multipleChoice.length > 0;
              }
              return response.multipleChoice !== "";
            }

            return true;
          });
        },

        hasValidationErrors: (elementId?: string) => {
          const { validationErrors } = get();
          if (elementId) {
            return validationErrors[elementId]?.length > 0;
          }
          return Object.values(validationErrors).some(
            (errors) => errors.length > 0
          );
        },
      }),
      {
        name: "quiz-response-storage",
        partialize: (state) => ({ currentResponse: state.currentResponse }),
      }
    ),
    { name: "QuizResponseStore" }
  )
);
