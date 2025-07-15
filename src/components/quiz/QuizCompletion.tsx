import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, RotateCcw, Download } from "lucide-react";
import { QuizWithSteps } from "@/types/composed";
import { useQuizResponseStore } from "@/stores/useQuizResponseStore";
import { ResponseSummary } from "./ResponseSummary";
import { useState } from "react";

interface QuizCompletionProps {
  quiz: QuizWithSteps;
  onRestart: () => void;
  onBack?: () => void;
}

export function QuizCompletion({
  quiz,
  onRestart,
  onBack,
}: QuizCompletionProps) {
  const { currentResponse } = useQuizResponseStore();
  const [showSummary, setShowSummary] = useState(false);

  const handleExportData = () => {
    if (!currentResponse) return;

    const exportData = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      sessionId: currentResponse.sessionId,
      responses: currentResponse.responses,
      completedAt: currentResponse.completedAt,
      startedAt: currentResponse.startedAt,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `quiz-responses-${currentResponse.sessionId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const getTotalResponses = () => {
    if (!currentResponse) return 0;
    return Object.keys(currentResponse.responses).length;
  };

  const getCompletionTime = () => {
    if (!currentResponse?.startedAt || !currentResponse?.completedAt)
      return "N/A";

    const start = new Date(currentResponse.startedAt);
    const end = new Date(currentResponse.completedAt);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));

    if (diffMins < 1) return "Menos de 1 minuto";
    if (diffMins === 1) return "1 minuto";
    return `${diffMins} minutos`;
  };

  return (
    <div className="text-center space-y-8">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>

      {/* Title and message */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Quiz Finalizado!</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Obrigado por participar. Suas respostas foram registradas com sucesso.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">
            {quiz.steps.length}
          </div>
          <div className="text-sm text-muted-foreground">Etapas</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">
            {getTotalResponses()}
          </div>
          <div className="text-sm text-muted-foreground">Respostas</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">
            {getCompletionTime()}
          </div>
          <div className="text-sm text-muted-foreground">Tempo</div>
        </Card>
      </div>

      {/* Call to action message */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="text-lg font-semibold mb-2">O que acontece agora?</h3>
        <p className="text-muted-foreground">
          Suas respostas estão sendo processadas. Nossa equipe entrará em
          contato em breve com informações relevantes baseadas no seu perfil.
        </p>
      </Card>

      {/* Response Summary */}
      {currentResponse && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowSummary(!showSummary)}
              className="min-w-32"
            >
              {showSummary ? "Ocultar" : "Ver"} Respostas
            </Button>
          </div>

          {showSummary && (
            <ResponseSummary
              quiz={quiz}
              responses={currentResponse.responses}
              className="max-w-2xl mx-auto"
            />
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onRestart} variant="outline" className="min-w-32">
          <RotateCcw className="w-4 h-4 mr-2" />
          Refazer Quiz
        </Button>

        <Button
          onClick={handleExportData}
          variant="outline"
          className="min-w-32"
        >
          <Download className="w-4 h-4 mr-2" />
          Baixar Respostas
        </Button>

        {onBack && (
          <Button onClick={onBack} variant="default" className="min-w-32">
            Voltar ao Editor
          </Button>
        )}
      </div>

      {/* Footer info */}
      <div className="pt-8 border-t">
        <p className="text-xs text-muted-foreground">
          ID da Sessão: {currentResponse?.sessionId || "N/A"}
        </p>
      </div>
    </div>
  );
}
