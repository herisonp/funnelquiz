"use client";

import { useState } from "react";
import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Eye, RotateCcw, Menu, FileText, Trash2 } from "lucide-react";
import StepsNavigation from "./StepsNavigation";
import { SaveStatus } from "./SaveStatus";
import { ExportImportDialog } from "./ExportImportDialog";

export default function EditorHeader() {
  const router = useRouter();
  const [showExportImport, setShowExportImport] = useState(false);
  const { quiz, resetQuiz, clearQuiz, toggleSidebar } = useEditorStore();

  const handlePreview = () => {
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
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>

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
              </>
            )}
          </div>

          {/* Center section - Steps Navigation */}
          <div className="hidden md:flex flex-1 justify-center max-w-2xl">
            <StepsNavigation />
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Save Status */}
            <SaveStatus className="hidden sm:flex" />

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportImport(true)}
              className="hidden sm:flex"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export/Import
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="hidden sm:flex"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="hidden md:flex"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar
            </Button>

            <Button onClick={handlePreview} size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
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
