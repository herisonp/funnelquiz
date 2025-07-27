import { useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/hooks/useEditorStore";
import { updateQuiz } from "@/lib/actions/quiz-actions";
import { StorageManager } from "@/lib/storage-manager";
import { QuizWithSteps } from "@/types/composed";
import { useParams } from "next/navigation";

interface UseQuizAutoSaveOptions {
  /**
   * Intervalo de debounce em milissegundos
   * @default 2000
   */
  debounceMs?: number;

  /**
   * Se deve salvar no localStorage como backup
   * @default true
   */
  saveToLocalStorage?: boolean;
}

interface UseQuizAutoSaveReturn {
  saveError: string | null;
  isSaving: boolean;
  lastSaved: Date | null;
  forceSave: () => Promise<void>;
}

/**
 * Hook para salvamento automático do quiz no banco de dados
 * Substitui o useAutoSave anterior, agora salvando no banco
 */
export function useQuizAutoSave(
  options: UseQuizAutoSaveOptions = {}
): UseQuizAutoSaveReturn {
  const { debounceMs = 2000, saveToLocalStorage = true } = options;

  const params = useParams();
  const quizId = params?.id as string;

  const quiz = useEditorStore((state) => state.quiz);
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges);
  const markAsSaved = useEditorStore((state) => state.markAsSaved);
  const setSaving = useEditorStore((state) => state.setSaving);
  const isSaving = useEditorStore((state) => state.isSaving);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<Date | null>(null);
  const saveErrorRef = useRef<string | null>(null);

  const saveQuiz = useCallback(
    async (quizData: QuizWithSteps): Promise<void> => {
      if (!quizId || !quizData) {
        throw new Error("Quiz ID ou dados não fornecidos");
      }

      try {
        setSaving(true);
        saveErrorRef.current = null;

        // 1. Salva no banco de dados
        const result = await updateQuiz(quizId, quizData);

        if (!result.success) {
          throw new Error(result.error || "Erro ao salvar quiz no banco");
        }

        // 2. Salva no localStorage como backup (se habilitado)
        if (saveToLocalStorage) {
          try {
            const storageManager = StorageManager.getInstance();
            if (storageManager.isStorageAvailable()) {
              await storageManager.saveData(`funnelquiz-editor-${quizId}`, {
                version: "1.0.0",
                timestamp: new Date(),
                quiz: quizData,
                editorState: {
                  currentStepId: useEditorStore.getState().currentStepId,
                  selectedElementId:
                    useEditorStore.getState().selectedElementId,
                },
              });
            }
          } catch (localError) {
            console.warn(
              "Erro ao salvar no localStorage (não crítico):",
              localError
            );
          }
        }

        // 3. Atualiza estado de sucesso
        markAsSaved();
        lastSavedRef.current = new Date();

        console.log("Quiz salvo com sucesso no banco de dados");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";
        saveErrorRef.current = errorMessage;
        console.error("Erro ao salvar quiz:", error);
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [quizId, saveToLocalStorage, setSaving, markAsSaved]
  );

  const forceSave = useCallback(async (): Promise<void> => {
    if (!quiz || !hasUnsavedChanges) {
      return;
    }

    // Cancela salvamento pendente
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    await saveQuiz(quiz);
  }, [quiz, hasUnsavedChanges, saveQuiz]);

  // Salvamento automático com debounce
  useEffect(() => {
    if (!quiz || !hasUnsavedChanges || isSaving) {
      return;
    }

    // Cancela timeout anterior
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Agenda novo salvamento
    saveTimeoutRef.current = setTimeout(() => {
      saveQuiz(quiz).catch((error) => {
        console.error("Erro no salvamento automático:", error);
      });
    }, debounceMs);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [quiz, hasUnsavedChanges, isSaving, debounceMs, saveQuiz]);

  // Salvamento manual via evento personalizado (Ctrl+S)
  useEffect(() => {
    const handleManualSave = () => {
      if (quiz && hasUnsavedChanges) {
        forceSave().catch((error) => {
          console.error("Erro no salvamento manual:", error);
        });
      }
    };

    window.addEventListener("manual-save", handleManualSave);

    return () => {
      window.removeEventListener("manual-save", handleManualSave);
    };
  }, [quiz, hasUnsavedChanges, forceSave]);

  // Salvamento ao sair da página
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isSaving) {
        const message =
          "Você tem alterações não salvas. Deseja sair mesmo assim?";
        event.returnValue = message;
        return message;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && hasUnsavedChanges && quiz) {
        // Salvamento síncrono quando a aba fica inativa
        navigator.sendBeacon(
          `/api/quiz/${quizId}/autosave`,
          JSON.stringify(quiz)
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasUnsavedChanges, isSaving, quiz, quizId]);

  return {
    saveError: saveErrorRef.current,
    isSaving,
    lastSaved: lastSavedRef.current,
    forceSave,
  };
}
