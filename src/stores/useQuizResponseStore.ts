import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AnswerValue } from "@/types/composed";

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

  // Actions
  startQuiz: (quizId: string) => void;
  setResponse: (elementId: string, value: AnswerValue) => void;
  goToStep: (stepIndex: number) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;

  // Getters
  getResponse: (elementId: string) => AnswerValue | undefined;
  getProgress: (totalSteps: number) => number;
  canProceed: (requiredElements: string[]) => boolean;
}

const generateSessionId = () => {
  return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useQuizResponseStore = create<QuizResponseState>()(
  devtools(
    persist(
      (set, get) => ({
        currentResponse: null,

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
      }),
      {
        name: "quiz-response-storage",
        partialize: (state) => ({ currentResponse: state.currentResponse }),
      }
    ),
    { name: "QuizResponseStore" }
  )
);
