"use client";

import { useEffect } from "react";
import EditorLayout from "@/components/editor/EditorLayout";
import { useQuizRecovery } from "@/hooks/useQuizRecovery";
import { useAutoSave } from "@/hooks/useAutoSave";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function EditorPage() {
  const { isLoading, error, hasRecoveredData } = useQuizRecovery();
  const { saveError } = useAutoSave();

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
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Alertas de erro */}
      {error && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados salvos: {error}. Um novo quiz foi criado.
          </AlertDescription>
        </Alert>
      )}

      {saveError && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erro ao salvar: {saveError}. Suas alterações podem não estar sendo
            salvas.
          </AlertDescription>
        </Alert>
      )}

      {/* Notificação de recuperação de dados */}
      {hasRecoveredData && !error && (
        <Alert className="mx-4 mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Quiz recuperado automaticamente dos dados salvos anteriormente.
          </AlertDescription>
        </Alert>
      )}

      <EditorLayout />
    </div>
  );
}
