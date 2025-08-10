import { Element } from "@/types/composed";
import { PublicTextElement } from "./elements/PublicTextElement";
import { PublicMultipleChoiceElement } from "./elements/PublicMultipleChoiceElement";
import { PublicNavigationButtonElement } from "./elements/PublicNavigationButtonElement";

interface QuizElementRendererProps {
  element: Element;
  onNavigate: (target: string) => void;
  canProceed?: boolean;
  quizColors?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    titleColor: string;
  };
  quizFonts?: {
    primaryFont: string;
    headingFont: string;
    baseFontSize: string;
  };
}

export function QuizElementRenderer({
  element,
  onNavigate,
  canProceed = true,
  quizColors,
  quizFonts,
}: QuizElementRendererProps) {
  try {
    const content =
      typeof element.content === "string"
        ? JSON.parse(element.content)
        : (element.content as Record<string, unknown>);

    switch (element.type) {
      case "TEXT":
        return (
          <PublicTextElement
            content={content}
            elementId={element.id}
            quizColors={quizColors}
            quizFonts={quizFonts}
          />
        );

      case "MULTIPLE_CHOICE":
        return (
          <PublicMultipleChoiceElement
            content={content}
            elementId={element.id}
          />
        );

      case "NAVIGATION_BUTTON":
        return (
          <PublicNavigationButtonElement
            content={content}
            elementId={element.id}
            onNavigate={onNavigate}
            canProceed={canProceed}
            quizColors={quizColors}
          />
        );

      default:
        return (
          <div className="text-sm text-muted-foreground text-center p-4 border border-dashed rounded-lg">
            Elemento não suportado: {element.type}
          </div>
        );
    }
  } catch (error) {
    console.error("Erro ao renderizar elemento:", error);
    return (
      <div className="text-sm text-destructive text-center p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
        Erro ao carregar elemento
      </div>
    );
  }
}
