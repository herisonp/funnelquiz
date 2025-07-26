import { QuizColors } from "@/types";

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (stepIndex: number) => void;
  allowNavigation?: boolean;
  colors?: QuizColors;
}

export function QuizProgress({
  currentStep,
  totalSteps,
  onStepClick,
  allowNavigation = false,
  colors,
}: QuizProgressProps) {
  return (
    <div className="flex justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isClickable = allowNavigation && onStepClick;

        // Use primary color from colors prop or fallback to default
        const primaryColor = colors?.primaryColor || "hsl(var(--primary))";

        return (
          <button
            key={index}
            onClick={isClickable ? () => onStepClick(index) : undefined}
            disabled={!isClickable}
            className={`
              w-3 h-3 rounded-full transition-all duration-200
              ${
                isActive
                  ? "scale-110 shadow-sm"
                  : isCompleted
                  ? "hover:opacity-80"
                  : "bg-muted hover:bg-muted/80"
              }
              ${
                isClickable
                  ? "cursor-pointer hover:scale-105"
                  : "cursor-default"
              }
            `}
            style={{
              backgroundColor:
                isActive || isCompleted ? primaryColor : undefined,
              opacity: isCompleted && !isActive ? 0.7 : 1,
            }}
            aria-label={`${
              isCompleted ? "Concluído" : isActive ? "Atual" : "Pendente"
            }: Etapa ${stepNumber}`}
            aria-current={isActive ? "step" : undefined}
          />
        );
      })}
    </div>
  );
}
