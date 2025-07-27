"use client";

import { useEffect } from "react";
import EditorLayout from "@/components/editor/EditorLayout";
import { useQuizData } from "@/hooks/useQuizData";
import { useQuizAutoSave } from "@/hooks/useQuizAutoSave";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

export default function EditarQuizPage() {
  const { isLoading, error, quiz } = useQuizData();
  const { saveError } = useQuizAutoSave();

  // Exibe toast para erros de carregamento
  useEffect(() => {
    if (error) {
      toast.error(
        `Erro ao carregar dados salvos: ${error}. Um novo quiz foi criado.`,
        {
          position: "top-right",
          duration: 5000,
        }
      );
    }
  }, [error]);

  // Exibe toast para erros de salvamento
  useEffect(() => {
    if (saveError) {
      toast.error(
        `Erro ao salvar: ${saveError}. Suas alterações podem não estar sendo salvas automaticamente.`,
        {
          position: "top-right",
          duration: 5000,
        }
      );
    }
  }, [saveError]);

  // Adiciona atalho de teclado Ctrl+S
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        // O salvamento manual será disparado pelo SaveStatus
        const saveEvent = new CustomEvent("manual-save");
        window.dispatchEvent(saveEvent);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="large" />
          <p className="text-muted-foreground">Carregando editor...</p>
          {quiz && (
            <p className="text-sm text-muted-foreground">Quiz: {quiz.title}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Editor Layout */}
      <div className="flex-1 min-h-0">
        <EditorLayout />
      </div>
    </div>
  );
}
