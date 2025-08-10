"use client";

import { QuizWithSteps } from "@/types/composed";
import { PublicQuizRenderer } from "./PublicQuizRenderer";
import { QuizLoading } from "./QuizLoading";
import { useEffect } from "react";
import { useHydration } from "@/hooks/useHydration";

interface PublicQuizContainerProps {
  quiz: QuizWithSteps;
}

export function PublicQuizContainer({ quiz }: PublicQuizContainerProps) {
  const isHydrated = useHydration();

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

  // Mostrar loading enquanto não hidratou para evitar erros de hidratação
  if (!isHydrated) {
    return <QuizLoading quiz={quiz} />;
  }

  // Renderizar quiz normal - sem tela de finalização
  return <PublicQuizRenderer quiz={quiz} />;
}
