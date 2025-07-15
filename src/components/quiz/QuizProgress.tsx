interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (stepIndex: number) => void;
  allowNavigation?: boolean;
}

export function QuizProgress({
  currentStep,
  totalSteps,
  onStepClick,
  allowNavigation = false,
}: QuizProgressProps) {
  return (
    <div className="flex justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isClickable = allowNavigation && onStepClick;

        return (
          <button
            key={index}
            onClick={isClickable ? () => onStepClick(index) : undefined}
            disabled={!isClickable}
            className={`
              w-3 h-3 rounded-full transition-all duration-200
              ${
                isActive
                  ? "bg-primary scale-110 shadow-sm"
                  : isCompleted
                  ? "bg-primary/70 hover:bg-primary/80"
                  : "bg-muted hover:bg-muted/80"
              }
              ${
                isClickable
                  ? "cursor-pointer hover:scale-105"
                  : "cursor-default"
              }
            `}
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
