import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuizWithSteps, AnswerValue, Element } from "@/types/composed";
import { QuizResponseUtils } from "@/lib/quiz-response-utils";

interface ResponseSummaryProps {
  quiz: QuizWithSteps;
  responses: Record<string, AnswerValue>;
  className?: string;
}

export function ResponseSummary({
  quiz,
  responses,
  className = "",
}: ResponseSummaryProps) {
  const getElementTitle = (element: Element): string => {
    try {
      const content =
        typeof element.content === "string"
          ? JSON.parse(element.content)
          : element.content;

      switch (element.type) {
        case "MULTIPLE_CHOICE":
          return content.question || "Pergunta sem título";
        case "TEXT":
          return "Texto informativo";
        case "NAVIGATION_BUTTON":
          return "Botão de navegação";
        default:
          return "Elemento desconhecido";
      }
    } catch {
      return "Elemento inválido";
    }
  };

  const getResponseDisplay = (elementId: string, element: Element): string => {
    const response = responses[elementId];
    if (!response) return "Sem resposta";

    try {
      const content =
        typeof element.content === "string"
          ? JSON.parse(element.content)
          : element.content;

      switch (element.type) {
        case "MULTIPLE_CHOICE":
          if (content.allowMultiple && Array.isArray(response.multipleChoice)) {
            return response.multipleChoice.length > 0
              ? response.multipleChoice.join(", ")
              : "Nenhuma opção selecionada";
          }
          return String(response.multipleChoice || "Nenhuma opção selecionada");

        case "TEXT":
          return response.text || "Sem resposta";

        default:
          return QuizResponseUtils.formatAnswerForDisplay(
            response,
            element.type
          );
      }
    } catch {
      return "Erro ao formatar resposta";
    }
  };

  const getElementBadgeVariant = (elementType: string) => {
    switch (elementType) {
      case "MULTIPLE_CHOICE":
        return "default";
      case "TEXT":
        return "secondary";
      case "NAVIGATION_BUTTON":
        return "outline";
      default:
        return "outline";
    }
  };

  const getElementBadgeLabel = (elementType: string) => {
    switch (elementType) {
      case "MULTIPLE_CHOICE":
        return "Múltipla Escolha";
      case "TEXT":
        return "Texto";
      case "NAVIGATION_BUTTON":
        return "Navegação";
      default:
        return elementType;
    }
  };

  // Collect all elements with responses
  const elementsWithResponses = quiz.steps.flatMap((step, stepIndex) =>
    step.elements
      .filter((element) => responses[element.id])
      .map((element) => ({
        ...element,
        stepIndex: stepIndex + 1,
        stepTitle: step.title || `Etapa ${stepIndex + 1}`,
      }))
  );

  if (elementsWithResponses.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-muted-foreground">
          <p>Nenhuma resposta registrada.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Resumo das Suas Respostas
        </h3>
        <p className="text-sm text-muted-foreground">
          Confira abaixo um resumo de todas as informações fornecidas
        </p>
      </div>

      <div className="space-y-4">
        {elementsWithResponses.map((element) => (
          <Card key={element.id} className="p-4">
            <div className="space-y-3">
              {/* Header with step and element type */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {element.stepTitle}
                  </Badge>
                  <Badge
                    variant={getElementBadgeVariant(element.type)}
                    className="text-xs"
                  >
                    {getElementBadgeLabel(element.type)}
                  </Badge>
                </div>
              </div>

              {/* Question/Element title */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                  {getElementTitle(element)}
                </h4>
              </div>

              {/* Response */}
              <div className="bg-muted/30 rounded-md p-3">
                <p className="text-sm font-medium">
                  {getResponseDisplay(element.id, element)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary stats */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="text-center space-y-2">
          <h4 className="font-semibold text-sm">Estatísticas</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-primary">
                {elementsWithResponses.length}
              </div>
              <div className="text-muted-foreground">Respostas</div>
            </div>
            <div>
              <div className="font-semibold text-primary">
                {quiz.steps.length}
              </div>
              <div className="text-muted-foreground">Etapas</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
