"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={handleBackToEditor}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Editor
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-semibold">{quiz.title}</h1>
            <p className="text-sm text-muted-foreground">Preview do Quiz</p>
          </div>
          <div></div> {/* Spacer for layout */}
        </div>
      </header>

      {/* Preview content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
            {quiz.description && (
              <p className="text-muted-foreground">{quiz.description}</p>
            )}
          </div>

          <div className="space-y-8">
            {quiz.steps.map((step, index) => (
              <div key={step.id} className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {index + 1}. {step.title}
                </h3>

                <div className="space-y-4">
                  {step.elements.map((element) => {
                    try {
                      const content = JSON.parse(element.content as string);

                      switch (element.type) {
                        case "TEXT":
                          return (
                            <div
                              key={element.id}
                              className="prose prose-sm max-w-none"
                            >
                              <p>{content.text || "Texto vazio"}</p>
                            </div>
                          );

                        case "MULTIPLE_CHOICE":
                          return (
                            <div key={element.id} className="space-y-3">
                              <h4 className="font-medium">
                                {content.question}
                              </h4>
                              <div className="space-y-2">
                                {content.options?.map(
                                  (option: { id: string; text: string }) => (
                                    <label
                                      key={option.id}
                                      className="flex items-center gap-2 cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        name={`question-${element.id}`}
                                        className="text-primary"
                                      />
                                      <span>{option.text}</span>
                                    </label>
                                  )
                                )}
                              </div>
                            </div>
                          );

                        case "NAVIGATION_BUTTON":
                          return (
                            <div
                              key={element.id}
                              className="flex justify-center"
                            >
                              <Button
                                variant={content.variant || "default"}
                                size={content.size || "default"}
                              >
                                {content.text || "Botão"}
                              </Button>
                            </div>
                          );

                        default:
                          return (
                            <div
                              key={element.id}
                              className="text-sm text-muted-foreground"
                            >
                              Elemento desconhecido: {element.type}
                            </div>
                          );
                      }
                    } catch {
                      return (
                        <div
                          key={element.id}
                          className="text-sm text-destructive"
                        >
                          Erro ao renderizar elemento
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
