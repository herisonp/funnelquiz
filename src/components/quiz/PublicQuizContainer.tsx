"use client";

import { QuizWithSteps } from "@/types/composed";
import { PublicQuizRenderer } from "./PublicQuizRenderer";
import { QuizCompletion } from "./QuizCompletion";
import { useQuizResponse } from "@/hooks/useQuizResponse";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PublicQuizContainerProps {
  quiz: QuizWithSteps;
}

export function PublicQuizContainer({ quiz }: PublicQuizContainerProps) {
  const router = useRouter();
  const { navigationInfo, resetQuiz } = useQuizResponse(quiz);
  const { isCompleted } = navigationInfo;

  // Aplicar estilos dinâmicos do quiz no body
  useEffect(() => {
    const body = document.body;
    const originalStyle = {
      backgroundColor: body.style.backgroundColor,
      color: body.style.color,
      fontFamily: body.style.fontFamily,
      fontSize: body.style.fontSize,
    };

    // Aplicar estilos do quiz
    if (quiz.backgroundColor) {
      body.style.backgroundColor = quiz.backgroundColor;
    }
    if (quiz.textColor) {
      body.style.color = quiz.textColor;
    }
    if (quiz.primaryFont) {
      body.style.fontFamily = quiz.primaryFont;
    }
    if (quiz.baseFontSize) {
      body.style.fontSize = `${quiz.baseFontSize}px`;
    }

    // Cleanup: restaurar estilos originais quando componente for desmontado
    return () => {
      body.style.backgroundColor = originalStyle.backgroundColor;
      body.style.color = originalStyle.color;
      body.style.fontFamily = originalStyle.fontFamily;
      body.style.fontSize = originalStyle.fontSize;
    };
  }, [
    quiz.backgroundColor,
    quiz.textColor,
    quiz.primaryFont,
    quiz.baseFontSize,
  ]);

  const handleRestart = () => {
    resetQuiz();
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  // Se o quiz foi completado, mostrar tela de finalização
  if (isCompleted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          backgroundColor: quiz.backgroundColor || "hsl(var(--background))",
          color: quiz.textColor || "hsl(var(--foreground))",
        }}
      >
        <div className="w-full max-w-2xl">
          <QuizCompletion
            quiz={quiz}
            onRestart={handleRestart}
            onBack={handleBackToHome}
          />
        </div>
      </div>
    );
  }

  // Renderizar quiz normal
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: quiz.backgroundColor || "hsl(var(--background))",
        color: quiz.textColor || "hsl(var(--foreground))",
      }}
    >
      <PublicQuizRenderer quiz={quiz} />
    </div>
  );
}
