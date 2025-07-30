"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuizResponseStore } from "@/stores/useQuizResponseStore";
import { useEditorStore } from "@/hooks/useEditorStore";
import { QuizCompletion } from "@/components/quiz/QuizCompletion";
import { QuizContainer } from "@/components/quiz/QuizContainer";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function QuizCompletePage() {
  const router = useRouter();
  const { quiz } = useEditorStore();
  const { currentResponse, resetQuiz } = useQuizResponseStore();

  const handleBackToEditor = () => {
    router.push(`/quiz/quiz/${quiz?.id}`);
  };

  const handleRestart = () => {
    resetQuiz();
    router.push("/quiz/preview");
  };

  // Redirect if no completed response
  useEffect(() => {
    if (!currentResponse?.isCompleted) {
      router.push("/quiz/preview");
    }
  }, [currentResponse, router]);

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <EmptyState
          title="Quiz não encontrado"
          description="Não foi possível encontrar os dados do quiz."
        />
        <Button onClick={handleBackToEditor} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Editor
        </Button>
      </div>
    );
  }

  if (!currentResponse?.isCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <EmptyState
          title="Quiz não finalizado"
          description="Complete o quiz antes de ver os resultados."
        />
        <Button onClick={() => router.push("/quiz/preview")} className="mt-4">
          Continuar Quiz
        </Button>
      </div>
    );
  }

  return (
    <QuizContainer
      currentStep={quiz.steps.length}
      totalSteps={quiz.steps.length}
      progress={100}
      onBack={handleBackToEditor}
      title="Quiz Finalizado"
    >
      <QuizCompletion
        quiz={quiz}
        onRestart={handleRestart}
        onBack={handleBackToEditor}
      />
    </QuizContainer>
  );
}
