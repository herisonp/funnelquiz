import { ReactNode } from "react";
import { QuizHeader } from "./QuizHeader";
import { QuizFooter } from "./QuizFooter";
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
  title,
  className = "",
  colors,
}: QuizContainerProps) {
  return (
    <div
      className={`min-h-screen bg-background ${className}`}
      style={{
        backgroundColor: colors?.backgroundColor || "hsl(var(--card))",
      }}
    >
      {/* Header */}
      <QuizHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        progress={progress}
        onBack={onBack}
        title={title}
      />
      {/* Main content */}
      <main className="w-full max-w-md mx-auto px-4 py-8">
        <div className="min-h-[500px] flex flex-col justify-start">
          {children}
        </div>
      </main>
      {/* Footer with step navigation */}
      <footer className="sticky bottom-0">
        <QuizFooter />
      </footer>
    </div>
  );
}
