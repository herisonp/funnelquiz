import { useEffect, useCallback } from "react";
import { useEditorStore } from "./useEditorStore";
import { QuizWithSteps } from "@/types/composed";

const STORAGE_KEY = "funnelquiz-editor-state";
const AUTOSAVE_DELAY = 2000; // 2 seconds

export function useEditorPersistence() {
  const { quiz, setQuiz } = useEditorStore();

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);

        // Validate the structure before loading
        if (isValidQuizStructure(parsed)) {
          // Convert string dates back to Date objects
          const restoredQuiz: QuizWithSteps = {
            ...parsed,
            createdAt: new Date(parsed.createdAt),
            updatedAt: new Date(parsed.updatedAt),
          };
          setQuiz(restoredQuiz);
          console.log("Editor state restored from localStorage");
        } else {
          console.warn(
            "Invalid quiz structure in localStorage, creating new quiz"
          );
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to load editor state from localStorage:", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [setQuiz]);

  // Save state to localStorage with debouncing
  const saveToLocalStorage = useCallback((quizData: QuizWithSteps) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quizData));
      console.log("Editor state saved to localStorage");
    } catch (error) {
      console.error("Failed to save editor state to localStorage:", error);
    }
  }, []);

  // Auto-save effect with debouncing
  useEffect(() => {
    if (!quiz) return;

    const timeoutId = setTimeout(() => {
      saveToLocalStorage(quiz);
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [quiz, saveToLocalStorage]);

  // Manual save function
  const saveNow = useCallback(() => {
    if (quiz) {
      saveToLocalStorage(quiz);
    }
  }, [quiz, saveToLocalStorage]);

  // Clear saved state
  const clearSavedState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log("Editor state cleared from localStorage");
    } catch (error) {
      console.error("Failed to clear editor state from localStorage:", error);
    }
  }, []);

  // Export/import functions
  const exportQuiz = useCallback(() => {
    if (!quiz) return null;

    try {
      const exportData = {
        quiz,
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error("Failed to export quiz:", error);
      return null;
    }
  }, [quiz]);

  const importQuiz = useCallback(
    (jsonData: string) => {
      try {
        const parsed = JSON.parse(jsonData);

        // Validate import structure
        if (!parsed.quiz || !isValidQuizStructure(parsed.quiz)) {
          throw new Error("Invalid quiz structure in import data");
        }

        const restoredQuiz: QuizWithSteps = {
          ...parsed.quiz,
          createdAt: new Date(parsed.quiz.createdAt),
          updatedAt: new Date(parsed.quiz.updatedAt),
        };

        setQuiz(restoredQuiz);
        saveToLocalStorage(restoredQuiz);

        return { success: true, message: "Quiz imported successfully" };
      } catch (error) {
        console.error("Failed to import quiz:", error);
        return {
          success: false,
          message:
            error instanceof Error ? error.message : "Failed to import quiz",
        };
      }
    },
    [setQuiz, saveToLocalStorage]
  );

  return {
    saveNow,
    clearSavedState,
    exportQuiz,
    importQuiz,
  };
}

// Validation function for quiz structure
function isValidQuizStructure(data: unknown): data is QuizWithSteps {
  if (!data || typeof data !== "object") return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    Array.isArray(obj.steps) &&
    obj.steps.every((step: unknown) => {
      if (!step || typeof step !== "object") return false;
      const stepObj = step as Record<string, unknown>;

      return (
        typeof stepObj.id === "string" &&
        typeof stepObj.title === "string" &&
        typeof stepObj.order === "number" &&
        Array.isArray(stepObj.elements) &&
        stepObj.elements.every((element: unknown) => {
          if (!element || typeof element !== "object") return false;
          const elementObj = element as Record<string, unknown>;

          return (
            typeof elementObj.id === "string" &&
            typeof elementObj.type === "string" &&
            typeof elementObj.order === "number"
          );
        })
      );
    })
  );
}

// Hook for checking if there's saved data
export function useHasSavedData() {
  const hasSavedData =
    typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) !== null;
  return hasSavedData;
}
