import React from "react";
import { QuizWithSteps } from "@/types/composed";
import { useQuizNavigationManager } from "@/hooks/useQuizNavigationManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Navigation,
  History,
  MapPin,
} from "lucide-react";

interface QuizNavigationDebugProps {
  quiz: QuizWithSteps | null;
}

export function QuizNavigationDebug({ quiz }: QuizNavigationDebugProps) {
  const {
    navigationInfo,
    navigationHistory,
    navigateToStepById,
    navigateNext,
    navigatePrevious,
  } = useQuizNavigationManager(quiz);

  if (!quiz) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Navegação do Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhum quiz carregado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Atual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Estado Atual da Navegação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Etapa Atual (ID):</span>
              <Badge variant="outline" className="ml-2">
                {navigationInfo.currentStepId}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Índice:</span>
              <Badge variant="outline" className="ml-2">
                {navigationInfo.currentStepIndex + 1} de {quiz.steps.length}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Progresso:</span>
              <Badge variant="outline" className="ml-2">
                {Math.round(navigationInfo.progress)}%
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant={navigationInfo.isCompleted ? "default" : "secondary"}
                className="ml-2"
              >
                {navigationInfo.isCompleted ? "Concluído" : "Em andamento"}
              </Badge>
            </div>
          </div>

          {/* Controles de Navegação */}
          <div className="flex gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={navigatePrevious}
              disabled={navigationInfo.isFirstStep}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={navigateNext}
              disabled={navigationInfo.isLastStep}
            >
              Próximo
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Etapas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Etapas do Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {quiz.steps.map((step, index) => {
              const isCurrent = step.id === navigationInfo.currentStepId;
              const wasVisited = navigationHistory.includes(step.id);

              return (
                <div
                  key={step.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isCurrent
                      ? "bg-blue-50 border-blue-200"
                      : wasVisited
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCurrent
                          ? "bg-blue-500 text-white"
                          : wasVisited
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {step.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCurrent && <Badge>Atual</Badge>}
                    {wasVisited && !isCurrent && (
                      <Badge variant="secondary">Visitada</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateToStepById(step.id)}
                      disabled={isCurrent}
                    >
                      Ir para
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Navegação */}
      {navigationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Histórico de Navegação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {navigationHistory.map((stepId, index) => {
                const step = quiz.steps.find((s) => s.id === stepId);
                const stepIndex = quiz.steps.findIndex((s) => s.id === stepId);

                return (
                  <Badge key={`${stepId}-${index}`} variant="outline">
                    {step ? `${stepIndex + 1}. ${step.title}` : stepId}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
