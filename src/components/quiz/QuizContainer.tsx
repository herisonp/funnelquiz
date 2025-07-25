import { ReactNode } from "react";
import { QuizHeader } from "./QuizHeader";
import { QuizProgress } from "./QuizProgress";
import { QuizColors } from "@/types";

interface QuizContainerProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  progress: number;
  onBack?: () => void;
  onStepClick?: (stepIndex: number) => void;
  allowNavigation?: boolean;
  title?: string;
  className?: string;
  colors?: QuizColors;
}

export function QuizContainer({
  children,
  currentStep,
  totalSteps,
  progress,
  onBack,
  onStepClick,
  allowNavigation = false,
  title,
  className = "",
  colors,
}: QuizContainerProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Header */}
      <QuizHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        progress={progress}
        onBack={onBack}
        title={title}
      />
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div
            className="border rounded-lg p-8 min-h-[500px] flex flex-col justify-center shadow-sm"
            style={{
              backgroundColor: colors?.backgroundColor || "hsl(var(--card))",
            }}
          >
            {children}
          </div>
        </div>
      </main>
      {/* Footer with step navigation */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky bottom-0">
        <div className="container mx-auto px-4">
          <QuizProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            onStepClick={onStepClick}
            allowNavigation={allowNavigation}
          />
        </div>
      </footer>
    </div>
  );
}
