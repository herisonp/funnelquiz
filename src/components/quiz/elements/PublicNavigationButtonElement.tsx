import { NavigationButtonElementContent } from "@/types/composed";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { getContrastColor } from "@/lib/color-utils";

interface PublicNavigationButtonElementProps {
  content: NavigationButtonElementContent;
  elementId: string;
  onNavigate: (target: string) => void;
  canProceed?: boolean;
  quizColors?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    titleColor: string;
  };
}

export function PublicNavigationButtonElement({
  content,
  onNavigate,
  canProceed = true,
  quizColors,
}: PublicNavigationButtonElementProps) {
  const getVariantClass = () => {
    switch (content.variant) {
      case "secondary":
        return "secondary";
      case "outline":
        return "outline";
      default:
        return "default";
    }
  };

  const getIcon = () => {
    switch (content.targetStep) {
      case "previous":
        return <ArrowLeft className="mr-2 h-4 w-4" />;
      case "next":
        return <ArrowRight className="ml-2 h-4 w-4" />;
      case "submit":
        return <Check className="ml-2 h-4 w-4" />;
      default:
        // Para navegação para etapas específicas, usar ícone de seta
        return <ArrowRight className="ml-2 h-4 w-4" />;
    }
  };

  const getLabel = () => {
    // Usar sempre o label definido no conteúdo ou um padrão baseado no targetStep
    if (content.label) {
      return content.label;
    }

    switch (content.targetStep) {
      case "previous":
        return "Anterior";
      case "next":
        return "Próximo";
      case "submit":
        return "Enviar";
      default:
        return "Continuar";
    }
  };

  const handleClick = () => {
    const target = content.targetStep || "next";
    onNavigate(target);
  };

  // Calcular cores para o botão principal (primary/default)
  const getPrimaryButtonStyles = () => {
    const primaryColor = quizColors?.primaryColor || "var(--quiz-primary)";

    if (content.variant === "primary" || getVariantClass() === "default") {
      const textColor = getContrastColor(primaryColor);
      return {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
        color: textColor,
      };
    }

    return undefined;
  };

  return (
    <div className="flex justify-center mt-8">
      <Button
        variant={getVariantClass()}
        size="lg"
        onClick={handleClick}
        disabled={!canProceed && content.targetStep !== "previous"}
        className="min-w-32 font-medium"
        aria-label={getLabel()}
        style={getPrimaryButtonStyles()}
      >
        {content.targetStep === "previous" && getIcon()}
        {getLabel()}
        {content.targetStep !== "previous" && getIcon()}
      </Button>
    </div>
  );
}
