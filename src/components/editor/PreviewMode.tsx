import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink } from "lucide-react";
import { PublicQuizRenderer } from "@/components/quiz/PublicQuizRenderer";
import { useEditorPreview } from "@/hooks/useEditorPreview";
import { EmptyState } from "@/components/ui/empty-state";

interface PreviewModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewMode({ isOpen, onClose }: PreviewModeProps) {
  const { quiz, previewValidation } = useEditorPreview();

  const handleOpenInNewTab = () => {
    window.open("/quiz/preview", "_blank");
  };

  if (!previewValidation.isValid) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Preview do Quiz
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="py-6">
            <EmptyState
              title="Não é possível visualizar"
              description={
                !previewValidation.hasQuiz
                  ? "Nenhum quiz criado ainda."
                  : !previewValidation.hasSteps
                  ? "Adicione pelo menos uma etapa ao quiz."
                  : "Adicione elementos às etapas do quiz."
              }
            />

            <div className="mt-4 flex justify-center">
              <Button onClick={onClose} variant="outline">
                Voltar ao Editor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Preview do Quiz</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Nova Aba
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <div className="h-full bg-background">
            {quiz && (
              <PublicQuizRenderer quiz={quiz} allowStepNavigation={true} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
