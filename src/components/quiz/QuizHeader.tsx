import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { QuizColors } from "@/types";
import React from "react";

interface QuizHeaderProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  onBack?: () => void;
  title?: string;
  colors?: QuizColors;
}

export function QuizHeader({ progress, onBack, colors }: QuizHeaderProps) {
  return (
    <header className="w-full">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Back button */}
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-white/65 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
          </Button>
        )}

        {/* Progress section */}
        <div className="flex-1 max-w-3xs md:max-w-md mx-auto">
          <Progress
            value={progress}
            className="h-2"
            style={
              {
                "--progress-background":
                  colors?.primaryColor ||
                  "var(--quiz-primary, hsl(var(--primary)))",
              } as React.CSSProperties
            }
          />
        </div>

        {/* Spacer to balance the layout */}
        {onBack && <div className="w-11" />}
      </div>
    </header>
  );
}
