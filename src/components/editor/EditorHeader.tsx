"use client";

import { useState } from "react";
import { useEditorStore } from "@/hooks/useEditorStore";
import { useQuizValidation } from "@/hooks/useQuizValidation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import {
  Eye,
  RotateCcw,
  Menu,
  FileText,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { SaveStatus } from "./SaveStatus";
import { ExportImportDialog } from "./ExportImportDialog";
import { QuickTooltip } from "@/components/ui/tooltip-help";
import { toast } from "sonner";

export default function EditorHeader() {
  const router = useRouter();
  const [showExportImport, setShowExportImport] = useState(false);
  const { quiz, resetQuiz, clearQuiz, toggleSidebar, currentStepId } =
    useEditorStore();
  const { canPreview, hasErrors, errorCount, quickValidationMessage } =
    useQuizValidation();

  const handlePreview = () => {
    if (!canPreview) {
      toast.error(
        quickValidationMessage || "Corrija os erros antes de visualizar o quiz"
      );
      return;
    }
    router.push("/quiz/preview");
  };

  const handleReset = () => {
    if (
      confirm(
        "Tem certeza que deseja resetar o quiz? Todas as alterações serão perdidas."
      )
    ) {
      resetQuiz();
    }
  };

  const handleClear = () => {
    if (
      confirm(
        "Tem certeza que deseja limpar o quiz? Isso irá remover todos os dados salvos."
      )
    ) {
      clearQuiz();
    }
  };

  return (
    <>
      <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-full flex items-center justify-between px-4">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <QuickTooltip content="Alternar sidebar">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </QuickTooltip>

            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-foreground">
                Funnel Quiz Editor
              </h1>
              <Badge variant="secondary" className="text-xs">
                MVP
              </Badge>
            </div>

            {quiz && (
              <>
                <Separator orientation="vertical" className="h-6" />
                <div className="text-sm text-muted-foreground">
                  {quiz.title}
                </div>
                {/* Mobile step indicator */}
                <div className="md:hidden text-xs text-muted-foreground ml-2">
                  Etapa{" "}
                  {(quiz.steps.findIndex((s) => s.id === currentStepId) || 0) +
                    1}
                  /{quiz.steps.length}
                </div>
              </>
            )}
          </div>

          {/* Center section */}
          <div className="hidden md:flex items-center gap-4 flex-1 justify-center max-w-2xl">
            {/* Center content can be added here if needed */}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Save Status */}
            <SaveStatus className="hidden sm:flex" />

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            <QuickTooltip content="Exportar/Importar configuração do quiz">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportImport(true)}
                className="hidden sm:flex"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export/Import
              </Button>
            </QuickTooltip>

            <QuickTooltip content="Resetar quiz mantendo estrutura">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="hidden sm:flex"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </QuickTooltip>

            <QuickTooltip content="Limpar todos os dados salvos">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="hidden md:flex"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            </QuickTooltip>

            <QuickTooltip
              content={
                canPreview
                  ? "Visualizar quiz (Ctrl+P)"
                  : quickValidationMessage ||
                    "Corrija os erros antes de visualizar"
              }
              shortcut="Ctrl+P"
            >
              <Button
                onClick={handlePreview}
                size="sm"
                disabled={!canPreview}
                variant={hasErrors ? "outline" : "default"}
              >
                {hasErrors && <AlertTriangle className="h-4 w-4 mr-2" />}
                <Eye className="h-4 w-4 mr-2" />
                Preview
                {errorCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {errorCount}
                  </Badge>
                )}
              </Button>
            </QuickTooltip>
          </div>
        </div>
      </header>

      <ExportImportDialog
        open={showExportImport}
        onOpenChange={setShowExportImport}
      />
    </>
  );
}
