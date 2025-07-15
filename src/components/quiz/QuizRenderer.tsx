import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { QuizWithSteps, Element } from "@/types/composed";
import { useQuizNavigation } from "@/hooks/useQuizNavigation";

interface QuizRendererProps {
  quiz: QuizWithSteps;
  onBack?: () => void;
}

export default function QuizRenderer({ quiz, onBack }: QuizRendererProps) {
  const { state, actions } = useQuizNavigation(quiz);
  const {
    currentStep,
    isFirstStep,
    isLastStep,
    progress,
    currentStepIndex,
    responses,
  } = state;

  const handleNext = () => {
    if (!isLastStep) {
      actions.goToNext();
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      actions.goToPrevious();
    }
  };

  const handleResponse = (elementId: string, value: unknown) => {
    actions.setResponse(elementId, value);
  };

  const renderElement = (element: Element) => {
    try {
      const content =
        typeof element.content === "string"
          ? JSON.parse(element.content)
          : (element.content as Record<string, unknown>);

      switch (element.type) {
        case "TEXT":
          return (
            <div
              key={element.id}
              className="prose prose-lg max-w-none text-center"
              style={{
                fontSize:
                  content.fontSize === "2xl"
                    ? "1.5rem"
                    : content.fontSize === "xl"
                    ? "1.25rem"
                    : content.fontSize === "lg"
                    ? "1.125rem"
                    : "1rem",
                fontWeight:
                  content.fontWeight === "bold"
                    ? "700"
                    : content.fontWeight === "semibold"
                    ? "600"
                    : content.fontWeight === "medium"
                    ? "500"
                    : "400",
                textAlign:
                  (content.textAlign as "left" | "center" | "right") || "left",
              }}
            >
              <p>{String(content.text || "Texto vazio")}</p>
            </div>
          );

        case "MULTIPLE_CHOICE":
          const options =
            (content.options as Array<{
              id: string;
              text: string;
              value: string;
            }>) || [];
          return (
            <div key={element.id} className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                {String(content.question || "")}
              </h3>
              <div className="space-y-3 max-w-md mx-auto">
                {options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <input
                      type={content.allowMultiple ? "checkbox" : "radio"}
                      name={`question-${element.id}`}
                      value={option.value}
                      checked={
                        content.allowMultiple
                          ? Array.isArray(responses[element.id]) &&
                            (responses[element.id] as string[]).includes(
                              option.value
                            )
                          : responses[element.id] === option.value
                      }
                      onChange={(e) => {
                        if (content.allowMultiple) {
                          const current = Array.isArray(responses[element.id])
                            ? (responses[element.id] as string[])
                            : [];
                          const newValue = e.target.checked
                            ? [...current, option.value]
                            : current.filter((v: string) => v !== option.value);
                          handleResponse(element.id, newValue);
                        } else {
                          handleResponse(element.id, option.value);
                        }
                      }}
                      className="text-primary"
                    />
                    <span className="flex-1">{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          );

        case "NAVIGATION_BUTTON":
          return (
            <div key={element.id} className="flex justify-center mt-8">
              <Button
                variant={
                  (content.variant as "default" | "outline" | "ghost") ||
                  "default"
                }
                size={(content.size as "default" | "sm" | "lg") || "default"}
                onClick={handleNext}
                disabled={isLastStep}
                className="min-w-32"
              >
                {String(content.label || "Próximo")}
                {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          );

        default:
          return (
            <div
              key={element.id}
              className="text-sm text-muted-foreground text-center"
            >
              Elemento desconhecido: {element.type}
            </div>
          );
      }
    } catch {
      return (
        <div key={element.id} className="text-sm text-destructive text-center">
          Erro ao renderizar elemento
        </div>
      );
    }
  };

  if (!currentStep) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Etapa não encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with progress */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          )}
          <div className="flex-1 max-w-md mx-auto">
            <div className="text-center mb-2">
              <span className="text-sm text-muted-foreground">
                Etapa {currentStepIndex + 1} de {quiz.steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      {/* Step content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border rounded-lg p-8 min-h-[400px] flex flex-col justify-center">
            <div className="space-y-6">
              {currentStep.elements
                .sort((a, b) => a.order - b.order)
                .map(renderElement)}

              {/* Auto navigation if no navigation button */}
              {!currentStep.elements.some(
                (el) => el.type === "NAVIGATION_BUTTON"
              ) && (
                <div className="flex justify-between pt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isFirstStep}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </Button>

                  <Button onClick={handleNext} disabled={isLastStep}>
                    {isLastStep ? "Finalizar" : "Próximo"}
                    {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Step navigation dots */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center gap-2">
            {quiz.steps.map((_, index) => (
              <button
                key={index}
                onClick={() => actions.goToStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStepIndex
                    ? "bg-primary"
                    : index < currentStepIndex
                    ? "bg-primary/50"
                    : "bg-muted"
                }`}
                aria-label={`Ir para etapa ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
