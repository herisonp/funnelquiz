"use client";

import { useState } from "react";
import { useEditorStore } from "@/hooks/useEditorStore";
import { useQuizValidation } from "@/hooks/useQuizValidation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Eye, FileText, AlertTriangle } from "lucide-react";
import { SaveStatus } from "./SaveStatus";
import { ExportImportDialog } from "./ExportImportDialog";
import { QuickTooltip } from "@/components/ui/tooltip-help";
import { toast } from "sonner";

export default function EditorHeader() {
  const router = useRouter();
  const [showExportImport, setShowExportImport] = useState(false);
  const { quiz, currentStepId } = useEditorStore();
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

  return (
    <>
      <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-full flex items-center justify-between px-4">
          {/* Left section */}
          <div className="flex items-center gap-4">
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
