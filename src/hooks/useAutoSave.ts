import { useCallback, useEffect, useRef } from "react";
import { useEditorStore } from "@/hooks/useEditorStore";
import { StorageManager } from "@/lib/storage-manager";
import { CURRENT_DATA_VERSION, STORAGE_KEY } from "@/schemas/quiz-schema";
import { toast } from "sonner";

interface UseAutoSaveOptions {
  debounceMs?: number;
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  saveManually: () => Promise<void>;
  saveError: string | null;
}

export function useAutoSave(
  options: UseAutoSaveOptions = {}
): UseAutoSaveReturn {
  const { debounceMs = 500, enabled = true } = options;

  const quiz = useEditorStore((state) => state.quiz);
  const currentStepId = useEditorStore((state) => state.currentStepId);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const lastSavedRef = useRef<Date | null>(null);
  const saveErrorRef = useRef<string | null>(null);
  const storageManager = useRef(StorageManager.getInstance());

  const saveToStorage = useCallback(async () => {
    if (!quiz || isSavingRef.current) return;

    try {
      isSavingRef.current = true;
      saveErrorRef.current = null;

      const dataToSave = {
        version: CURRENT_DATA_VERSION,
        timestamp: new Date(),
        quiz,
        editorState: {
          currentStepId,
          selectedElementId,
          isPreviewMode,
        },
      } as const;

      await storageManager.current.saveData(STORAGE_KEY, dataToSave);
      lastSavedRef.current = new Date();

      // Dispara evento customizado para componentes que precisam saber do status
      window.dispatchEvent(
        new CustomEvent("quiz-saved", {
          detail: { timestamp: lastSavedRef.current },
        })
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      saveErrorRef.current = errorMessage;

      console.error("Erro ao salvar quiz:", error);

      // Mostra toast de erro apenas se não for erro de quota
      if (!errorMessage.includes("quota")) {
        toast.error("Erro ao salvar quiz automaticamente");
      } else {
        toast.warning("Espaço de armazenamento insuficiente", {
          description: "Considere exportar e limpar dados antigos",
        });
      }

      window.dispatchEvent(
        new CustomEvent("quiz-save-error", {
          detail: { error: errorMessage },
        })
      );
    } finally {
      isSavingRef.current = false;
    }
  }, [quiz, currentStepId, selectedElementId, isPreviewMode]);

  const saveManually = useCallback(async () => {
    // Cancela auto-save pendente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    await saveToStorage();
    toast.success("Quiz salvo com sucesso");
  }, [saveToStorage]);

  // Auto-save com debounce
  useEffect(() => {
    if (!enabled || !quiz) return;

    // Cancela timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Agenda novo salvamento
    timeoutRef.current = setTimeout(() => {
      saveToStorage();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    quiz,
    currentStepId,
    selectedElementId,
    isPreviewMode,
    enabled,
    debounceMs,
    saveToStorage,
  ]);

  // Salvamento manual via evento customizado
  useEffect(() => {
    const handleManualSave = () => {
      saveManually();
    };

    window.addEventListener("manual-save", handleManualSave);
    return () => window.removeEventListener("manual-save", handleManualSave);
  }, [saveManually]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Salva quando página é fechada
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (quiz && enabled) {
        // Usa salvamento síncrono para garantir execução
        try {
          const dataToSave = {
            version: CURRENT_DATA_VERSION,
            timestamp: new Date(),
            quiz,
            editorState: {
              currentStepId,
              selectedElementId,
              isPreviewMode,
            },
          };

          const jsonString = JSON.stringify(dataToSave);
          localStorage.setItem(STORAGE_KEY, jsonString);
        } catch (error) {
          console.warn("Não foi possível salvar ao fechar página:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [quiz, currentStepId, selectedElementId, isPreviewMode, enabled]);

  return {
    isSaving: isSavingRef.current,
    lastSaved: lastSavedRef.current,
    saveManually,
    saveError: saveErrorRef.current,
  };
}
