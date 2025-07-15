import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface QuizHeaderProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  onBack?: () => void;
  title?: string;
}

export function QuizHeader({
  currentStep,
  totalSteps,
  progress,
  onBack,
  title,
}: QuizHeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Back button */}
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        )}

        {/* Progress section */}
        <div className="flex-1 max-w-md mx-auto">
          <div className="text-center mb-2">
            <span className="text-sm text-muted-foreground">
              {title ? title : `Etapa ${currentStep} de ${totalSteps}`}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Spacer to balance the layout */}
        <div className="w-20" />
      </div>
    </header>
  );
}
