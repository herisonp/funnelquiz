"use client";

import { useState, useRef } from "react";
import {
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEditorStore } from "@/hooks/useEditorStore";
import { quizExportService, quizImportService } from "@/lib/quiz-export";
import { toast } from "sonner";

interface ExportImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportImportDialog({
  open,
  onOpenChange,
}: ExportImportDialogProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quiz = useEditorStore((state) => state.quiz);
  const setQuiz = useEditorStore((state) => state.setQuiz);

  const handleExport = async () => {
    if (!quiz) {
      toast.error("Nenhum quiz para exportar");
      return;
    }

    try {
      setIsExporting(true);
      quizExportService.exportQuiz(quiz);
      toast.success("Quiz exportado com sucesso!");
      onOpenChange(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Erro ao exportar: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateBackup = async () => {
    if (!quiz) {
      toast.error("Nenhum quiz para fazer backup");
      return;
    }

    try {
      setIsExporting(true);
      quizExportService.createBackup(quiz);
      toast.success("Backup criado com sucesso!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Erro ao criar backup: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      setImportError(null);

      const importedQuiz = await quizImportService.importQuiz(file);

      // Confirma antes de sobrescrever
      if (quiz && quiz.steps.length > 1) {
        const confirmed = window.confirm(
          "Importar este quiz irá substituir o quiz atual. Deseja continuar?"
        );
        if (!confirmed) {
          setIsImporting(false);
          return;
        }
      }

      setQuiz(importedQuiz);
      toast.success("Quiz importado com sucesso!");
      onOpenChange(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      setImportError(errorMessage);
      toast.error(`Erro ao importar: ${errorMessage}`);
    } finally {
      setIsImporting(false);
      // Limpa o input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Exportar / Importar Quiz</DialogTitle>
          <DialogDescription>
            Exporte seu quiz para fazer backup ou importar um quiz existente.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Exportar</TabsTrigger>
            <TabsTrigger value="import">Importar</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-4">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  O export inclui todas as etapas, elementos e configurações do
                  quiz atual. O arquivo pode ser usado para backup ou
                  compartilhamento.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleExport}
                  disabled={!quiz || isExporting}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? "Exportando..." : "Exportar Quiz"}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCreateBackup}
                  disabled={!quiz || isExporting}
                  className="w-full"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isExporting ? "Criando backup..." : "Criar Backup"}
                </Button>
              </div>

              {quiz && (
                <div className="text-sm text-muted-foreground border rounded-md p-3">
                  <div className="font-medium mb-1">Informações do Quiz:</div>
                  <div>Título: {quiz.title}</div>
                  <div>Etapas: {quiz.steps.length}</div>
                  <div>
                    Elementos:{" "}
                    {quiz.steps.reduce(
                      (acc, step) => acc + step.elements.length,
                      0
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Importar um quiz irá substituir completamente o quiz atual.
                  Certifique-se de ter feito backup antes de continuar.
                </AlertDescription>
              </Alert>

              {importError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{importError}</AlertDescription>
                </Alert>
              )}

              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Selecione um arquivo JSON do quiz
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Apenas arquivos .json exportados pelo Funnel Quiz são
                    suportados
                  </p>
                </div>
                <Button
                  onClick={handleFileSelect}
                  disabled={isImporting}
                  className="mt-4"
                >
                  {isImporting ? "Importando..." : "Escolher Arquivo"}
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
