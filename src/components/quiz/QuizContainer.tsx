import { ReactNode } from "react";
import { QuizHeader } from "./QuizHeader";
import { QuizFooter } from "./QuizFooter";
import { QuizColors } from "@/types";
import { cn } from "@/lib/utils";

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
      className={cn(
        `min-h-screen bg-background relative flex flex-col`,
        className
      )}
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

      <QuizFooter className="mt-auto" />
    </div>
  );
}
