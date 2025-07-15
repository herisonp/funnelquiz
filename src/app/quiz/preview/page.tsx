"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PublicQuizRenderer } from "@/components/quiz/PublicQuizRenderer";

export default function QuizPreviewPage() {
  const router = useRouter();
  const { quiz } = useEditorStore();

  const handleBackToEditor = () => {
    router.push("/editor");
  };

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <EmptyState
          title="Nenhum quiz para visualizar"
          description="Volte ao editor para criar seu quiz."
        />
        <Button onClick={handleBackToEditor} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Editor
        </Button>
      </div>
    );
  }

  return (
    <PublicQuizRenderer
      quiz={quiz}
      onBack={handleBackToEditor}
      allowStepNavigation={true}
    />
  );
}
