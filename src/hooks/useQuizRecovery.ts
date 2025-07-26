import { useEffect, useState } from "react";
import { useEditorStore } from "@/hooks/useEditorStore";
import { StorageManager } from "@/lib/storage-manager";
import { STORAGE_KEY, SavedQuizData } from "@/schemas/quiz-schema";

interface UseQuizRecoveryReturn {
  isLoading: boolean;
  error: string | null;
  hasRecoveredData: boolean;
}

export function useQuizRecovery(): UseQuizRecoveryReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRecoveredData, setHasRecoveredData] = useState(false);

  const setQuiz = useEditorStore((state) => state.setQuiz);
  const setCurrentStep = useEditorStore((state) => state.setCurrentStep);
  const selectElement = useEditorStore((state) => state.selectElement);
  const createNewQuiz = useEditorStore((state) => state.createNewQuiz);

  useEffect(() => {
    const loadSavedQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const storageManager = StorageManager.getInstance();

        if (!storageManager.isStorageAvailable()) {
          console.warn("localStorage não está disponível");
          createNewQuiz();
          setIsLoading(false);
          return;
        }

        const savedData = await storageManager.loadData(STORAGE_KEY);

        if (!savedData) {
          console.log("Nenhum quiz salvo encontrado, criando novo quiz");
          createNewQuiz();
          setIsLoading(false);
          return;
        }

        console.log("Dados salvos carregados:", savedData);

        // Restaura o quiz com valores padrão para novos campos
        const savedQuiz = savedData.quiz as typeof savedData.quiz & {
          primaryColor?: string;
          backgroundColor?: string;
          textColor?: string;
          titleColor?: string;
          primaryFont?: string;
          headingFont?: string;
          baseFontSize?: string;
        };

        const quizWithDefaults = {
          ...savedData.quiz,
          primaryColor:
            savedQuiz.primaryColor ||
            savedQuiz.colors?.primaryColor ||
            "#3b82f6",
          backgroundColor:
            savedQuiz.backgroundColor ||
            savedQuiz.colors?.backgroundColor ||
            "#ffffff",
          textColor:
            savedQuiz.textColor || savedQuiz.colors?.textColor || "#374151",
          titleColor:
            savedQuiz.titleColor || savedQuiz.colors?.titleColor || "#111827",
          primaryFont:
            savedQuiz.primaryFont ||
            savedQuiz.fonts?.primaryFont ||
            "Inter, sans-serif",
          headingFont:
            savedQuiz.headingFont ||
            savedQuiz.fonts?.headingFont ||
            "Inter, sans-serif",
          baseFontSize:
            savedQuiz.baseFontSize || savedQuiz.fonts?.baseFontSize || "16px",
          colors: savedQuiz.colors || {
            primaryColor: savedQuiz.primaryColor || "#3b82f6",
            backgroundColor: savedQuiz.backgroundColor || "#ffffff",
            textColor: savedQuiz.textColor || "#374151",
            titleColor: savedQuiz.titleColor || "#111827",
          },
          fonts: savedQuiz.fonts || {
            primaryFont: savedQuiz.primaryFont || "Inter, sans-serif",
            headingFont: savedQuiz.headingFont || "Inter, sans-serif",
            baseFontSize: savedQuiz.baseFontSize || "16px",
          },
        };

        setQuiz(quizWithDefaults);
        setHasRecoveredData(true);

        // Restaura estado do editor se disponível
        if (savedData.editorState) {
          const { currentStepId, selectedElementId } = savedData.editorState;

          if (currentStepId) {
            setCurrentStep(currentStepId);
          }

          if (selectedElementId) {
            selectElement(selectedElementId);
          }
        }

        console.log("Quiz recuperado com sucesso");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        console.error("Erro ao carregar quiz salvo:", err);
        setError(errorMessage);

        // Fallback para quiz vazio em caso de erro
        createNewQuiz();
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedQuiz();
  }, [setQuiz, setCurrentStep, selectElement, createNewQuiz]);

  return {
    isLoading,
    error,
    hasRecoveredData,
  };
}

/**
 * Hook para recuperação específica de dados corrompidos
 */
export function useDataRecovery() {
  const storageManager = StorageManager.getInstance();

  const attemptRecovery = async (): Promise<SavedQuizData | null> => {
    try {
      // Tenta carregar backup
      const backupData = await storageManager.loadData(
        "funnelquiz-editor-backup"
      );
      if (backupData) {
        console.log("Dados recuperados do backup");
        return backupData;
      }

      // Tenta carregar dados brutos e fazer parsing manual
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (rawData) {
        try {
          const parsed = JSON.parse(rawData);

          // Verificação básica de estrutura
          if (parsed && parsed.quiz && parsed.quiz.id) {
            console.log("Dados recuperados com parsing manual");
            return parsed as SavedQuizData;
          }
        } catch (parseError) {
          console.warn("Erro no parsing manual:", parseError);
        }
      }

      return null;
    } catch (error) {
      console.error("Erro na tentativa de recuperação:", error);
      return null;
    }
  };

  const clearCorruptedData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("funnelquiz-editor-backup");
      console.log("Dados corrompidos removidos");
    } catch (error) {
      console.error("Erro ao limpar dados corrompidos:", error);
    }
  };

  return {
    attemptRecovery,
    clearCorruptedData,
  };
}
