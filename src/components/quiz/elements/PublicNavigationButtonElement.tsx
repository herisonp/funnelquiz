import { NavigationButtonElementContent } from "@/types/composed";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

interface PublicNavigationButtonElementProps {
  content: NavigationButtonElementContent;
  elementId: string;
  onNavigate: (target: string) => void;
  isLastStep?: boolean;
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
  isLastStep = false,
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
    if (isLastStep) {
      return <Check className="ml-2 h-4 w-4" />;
    }

    switch (content.targetStep) {
      case "previous":
        return <ArrowLeft className="mr-2 h-4 w-4" />;
      case "next":
      default:
        return <ArrowRight className="ml-2 h-4 w-4" />;
    }
  };

  const getLabel = () => {
    if (isLastStep && content.targetStep !== "previous") {
      return "Finalizar Quiz";
    }
    return (
      content.label ||
      (content.targetStep === "previous" ? "Anterior" : "Próximo")
    );
  };

  const handleClick = () => {
    const target = content.targetStep || "next";
    onNavigate(target);
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
        style={
          content.variant === "primary" || getVariantClass() === "default"
            ? {
                backgroundColor:
                  quizColors?.primaryColor || "var(--quiz-primary)",
                borderColor: quizColors?.primaryColor || "var(--quiz-primary)",
              }
            : undefined
        }
      >
        {content.targetStep === "previous" && getIcon()}
        {getLabel()}
        {content.targetStep !== "previous" && getIcon()}
      </Button>
    </div>
  );
}
