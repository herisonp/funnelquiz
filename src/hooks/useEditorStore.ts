import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  QuizWithSteps,
  StepWithElements,
  CreateElementInput,
} from "@/types/composed";
import { ElementType } from "@prisma/client";
import { createDefaultElement } from "@/lib/element-definitions";
import { v4 as uuidv4 } from "uuid";

interface EditorState {
  // Quiz data
  quiz: QuizWithSteps | null;
  currentStepId: string | null;
  selectedElementId: string | null;

  // UI state
  isPropertiesPanelOpen: boolean;

  // Persistence state
  hasUnsavedChanges: boolean;

  // Loading and validation states
  isLoading: boolean;
  isValidating: boolean;
  isSaving: boolean;
  keyboardShortcutsEnabled: boolean;

  // Actions
  setQuiz: (quiz: QuizWithSteps) => void;
  setCurrentStep: (stepId: string) => void;
  selectElement: (elementId: string | null) => void;

  // Quiz management
  createNewQuiz: () => void;
  resetQuiz: () => void;
  clearQuiz: () => void;

  // Step management
  addStep: () => void;
  removeStep: (stepId: string) => void;
  updateStepTitle: (stepId: string, title: string) => void;

  // Element management
  addElement: (type: ElementType, order?: number) => void;
  removeElement: (elementId: string) => void;
  updateElement: (
    elementId: string,
    updates: Partial<CreateElementInput>
  ) => void;
  moveElement: (elementId: string, newOrder: number) => void;

  // UI actions
  togglePropertiesPanel: () => void;

  // Loading and validation actions
  setLoading: (isLoading: boolean) => void;
  setValidating: (isValidating: boolean) => void;
  setSaving: (isSaving: boolean) => void;
  setKeyboardShortcutsEnabled: (enabled: boolean) => void;

  // Persistence actions
  markAsSaved: () => void;
  markAsChanged: () => void;
}

const createEmptyQuiz = (): QuizWithSteps => ({
  id: uuidv4(),
  title: "Novo Quiz",
  description: "",
  isPublished: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  steps: [
    {
      id: uuidv4(),
      title: "Etapa 1",
      order: 0,
      quizId: "",
      elements: [],
    },
  ],
});

export const useEditorStore = create<EditorState>()(
  devtools(
    (set, get) => ({
      // Initial state
      quiz: null,
      currentStepId: null,
      selectedElementId: null,
      isPropertiesPanelOpen: true,
      hasUnsavedChanges: false,
      isLoading: false,
      isValidating: false,
      isSaving: false,
      keyboardShortcutsEnabled: true,

      // Actions
      setQuiz: (quiz) =>
        set({
          quiz,
          currentStepId: quiz.steps[0]?.id || null,
          hasUnsavedChanges: false,
        }),

      setCurrentStep: (stepId) =>
        set({ currentStepId: stepId, selectedElementId: null }),

      selectElement: (elementId) =>
        set({
          selectedElementId: elementId,
        }),

      createNewQuiz: () => {
        const newQuiz = createEmptyQuiz();
        set({
          quiz: newQuiz,
          currentStepId: newQuiz.steps[0].id,
          selectedElementId: null,
          hasUnsavedChanges: false,
        });
      },

      resetQuiz: () => {
        const newQuiz = createEmptyQuiz();
        set({
          quiz: newQuiz,
          currentStepId: newQuiz.steps[0].id,
          selectedElementId: null,
          hasUnsavedChanges: true,
        });
      },

      clearQuiz: () => {
        set({
          quiz: null,
          currentStepId: null,
          selectedElementId: null,
          hasUnsavedChanges: false,
        });
      },

      addStep: () => {
        const { quiz } = get();
        if (!quiz || quiz.steps.length >= 5) return; // MVP limit: 5 steps

        const newStep: StepWithElements = {
          id: uuidv4(),
          title: `Etapa ${quiz.steps.length + 1}`,
          order: quiz.steps.length,
          quizId: quiz.id,
          elements: [],
        };

        set({
          quiz: {
            ...quiz,
            steps: [...quiz.steps, newStep],
          },
          currentStepId: newStep.id,
          hasUnsavedChanges: true,
        });
      },

      removeStep: (stepId) => {
        const { quiz, currentStepId } = get();
        if (!quiz || quiz.steps.length <= 1) return; // Minimum 1 step

        const filteredSteps = quiz.steps.filter((step) => step.id !== stepId);
        const reorderedSteps = filteredSteps.map((step, index) => ({
          ...step,
          order: index,
          // Preserva o título original da etapa, não renomeia automaticamente
        }));

        const newCurrentStepId =
          currentStepId === stepId
            ? reorderedSteps[0]?.id || null
            : currentStepId;

        set({
          quiz: {
            ...quiz,
            steps: reorderedSteps,
          },
          currentStepId: newCurrentStepId,
          selectedElementId: null,
          hasUnsavedChanges: true,
        });
      },

      updateStepTitle: (stepId, title) => {
        const { quiz } = get();
        if (!quiz) return;

        set({
          quiz: {
            ...quiz,
            steps: quiz.steps.map((step) =>
              step.id === stepId ? { ...step, title } : step
            ),
          },
          hasUnsavedChanges: true,
        });
      },

      addElement: (type, order) => {
        const { quiz, currentStepId } = get();
        if (!quiz || !currentStepId) return;

        const currentStep = quiz.steps.find(
          (step) => step.id === currentStepId
        );
        if (!currentStep) return;

        const defaultElement = createDefaultElement(type);
        const insertOrder = order ?? currentStep.elements.length;

        // Criar novo elemento
        const newElement = {
          id: uuidv4(),
          stepId: currentStepId,
          order: insertOrder,
          ...defaultElement,
        };

        // Inserir elemento na posição específica e reordenar
        const elements = [...currentStep.elements];
        elements.splice(insertOrder, 0, newElement);

        // Reordenar todos os elementos
        const reorderedElements = elements.map((element, index) => ({
          ...element,
          order: index,
        }));

        set({
          quiz: {
            ...quiz,
            steps: quiz.steps.map((step) =>
              step.id === currentStepId
                ? {
                    ...step,
                    elements: reorderedElements,
                  }
                : step
            ),
          },
          selectedElementId: newElement.id,
          isPropertiesPanelOpen: true,
          hasUnsavedChanges: true,
        });
      },

      removeElement: (elementId) => {
        const { quiz } = get();
        if (!quiz) return;

        set({
          quiz: {
            ...quiz,
            steps: quiz.steps.map((step) => ({
              ...step,
              elements: step.elements.filter(
                (element) => element.id !== elementId
              ),
            })),
          },
          selectedElementId: null,
          hasUnsavedChanges: true,
        });
      },

      updateElement: (elementId, updates) => {
        const { quiz } = get();
        if (!quiz) return;

        set({
          quiz: {
            ...quiz,
            steps: quiz.steps.map((step) => ({
              ...step,
              elements: step.elements.map((element) =>
                element.id === elementId ? { ...element, ...updates } : element
              ),
            })),
          },
          hasUnsavedChanges: true,
        });
      },

      moveElement: (elementId, newOrder) => {
        const { quiz, currentStepId } = get();
        if (!quiz || !currentStepId) return;

        const currentStep = quiz.steps.find(
          (step) => step.id === currentStepId
        );
        if (!currentStep) return;

        const elements = [...currentStep.elements];
        const elementIndex = elements.findIndex((el) => el.id === elementId);

        if (elementIndex === -1) return;

        const [movedElement] = elements.splice(elementIndex, 1);
        elements.splice(newOrder, 0, movedElement);

        // Reorder all elements
        const reorderedElements = elements.map((element, index) => ({
          ...element,
          order: index,
        }));

        set({
          quiz: {
            ...quiz,
            steps: quiz.steps.map((step) =>
              step.id === currentStepId
                ? { ...step, elements: reorderedElements }
                : step
            ),
          },
          hasUnsavedChanges: true,
        });
      },

      togglePropertiesPanel: () =>
        set((state) => ({
          isPropertiesPanelOpen: !state.isPropertiesPanelOpen,
        })),

      // Loading and validation actions
      setLoading: (isLoading) => set({ isLoading }),
      setValidating: (isValidating) => set({ isValidating }),
      setSaving: (isSaving) => set({ isSaving }),
      setKeyboardShortcutsEnabled: (enabled) =>
        set({ keyboardShortcutsEnabled: enabled }),

      // Persistence actions
      markAsSaved: () => set({ hasUnsavedChanges: false }),

      markAsChanged: () => set({ hasUnsavedChanges: true }),
    }),
    {
      name: "editor-store",
    }
  )
);
