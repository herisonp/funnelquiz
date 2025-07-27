"use client";

import { QuizWithSteps } from "@/types/composed";

interface QuizLoadingProps {
  quiz: QuizWithSteps;
}

export function QuizLoading({ quiz }: QuizLoadingProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: quiz.backgroundColor || "hsl(var(--background))",
        color: quiz.textColor || "hsl(var(--foreground))",
        fontFamily: quiz.primaryFont || "inherit",
      }}
    >
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-current border-t-transparent mx-auto"></div>
        <p className="text-sm opacity-70">Carregando quiz...</p>
      </div>
    </div>
  );
}
