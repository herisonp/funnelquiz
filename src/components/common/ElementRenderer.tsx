"use client";

import { Element } from "@prisma/client";
import { PublicTextElement } from "../quiz/elements/PublicTextElement";
import { PublicMultipleChoiceElement } from "../quiz/elements/PublicMultipleChoiceElement";
import { PublicNavigationButtonElement } from "../quiz/elements/PublicNavigationButtonElement";
import { TextElement as QuizTextElement } from "../quiz/elements/TextElement";
import { MultipleChoiceElement as QuizMultipleChoiceElement } from "../quiz/elements/MultipleChoiceElement";
import { NavigationButtonElement as QuizNavigationButtonElement } from "../quiz/elements/NavigationButtonElement";
import { cn } from "@/lib/utils";

interface ElementRendererProps {
  element: Element;
  mode: "editor" | "quiz";

  // Quiz mode props
  value?: string | string[];
  onAnswer?: (value: string | string[]) => void;
  onNavigate?: (targetStep: string) => void;
  disabled?: boolean;

  // Common props
  className?: string;
}

export function ElementRenderer({
  element,
  mode,
  value,
  onAnswer,
  onNavigate,
  disabled,
  className,
}: ElementRendererProps) {
  // Error boundary for invalid elements
  if (!element || !element.type) {
    return (
      <div
        className={cn(
          "p-4 border border-red-200 bg-red-50 rounded-md",
          className
        )}
      >
        <p className="text-red-600 text-sm">Elemento inválido ou corrompido</p>
      </div>
    );
  }

  try {
    // Parse content once
    const content =
      typeof element.content === "string"
        ? JSON.parse(element.content)
        : (element.content as Record<string, unknown>);

    if (mode === "editor") {
      // Use public components in editor mode for consistent appearance
      switch (element.type) {
        case "TEXT":
          return <PublicTextElement content={content} elementId={element.id} />;

        case "MULTIPLE_CHOICE":
          return (
            <PublicMultipleChoiceElement
              content={content}
              elementId={element.id}
            />
          );

        case "NAVIGATION_BUTTON":
          return (
            <PublicNavigationButtonElement
              content={content}
              elementId={element.id}
              onNavigate={() => {}} // No-op in editor mode
              isLastStep={false}
              canProceed={true}
            />
          );

        default:
          return (
            <div
              className={cn(
                "p-4 border border-yellow-200 bg-yellow-50 rounded-md",
                className
              )}
            >
              <p className="text-yellow-700 text-sm">
                Tipo de elemento não reconhecido: {element.type}
              </p>
            </div>
          );
      }
    } else {
      // Render quiz components
      switch (element.type) {
        case "TEXT":
          return <QuizTextElement element={element} className={className} />;

        case "MULTIPLE_CHOICE":
          return (
            <QuizMultipleChoiceElement
              element={element}
              value={value}
              onAnswer={onAnswer}
              className={className}
            />
          );

        case "NAVIGATION_BUTTON":
          return (
            <QuizNavigationButtonElement
              element={element}
              onNavigate={onNavigate}
              disabled={disabled}
              className={className}
            />
          );

        default:
          return (
            <div
              className={cn(
                "p-4 border border-gray-200 bg-gray-50 rounded-md",
                className
              )}
            >
              <p className="text-gray-600 text-sm">
                Elemento não suportado no quiz público
              </p>
            </div>
          );
      }
    }
  } catch (error) {
    // Error boundary for rendering errors
    console.error(`Erro ao renderizar elemento ${element.id}:`, error);

    return (
      <div
        className={cn(
          "p-4 border border-red-200 bg-red-50 rounded-md",
          className
        )}
      >
        <p className="text-red-600 text-sm">
          Erro ao renderizar elemento. Verifique o console para mais detalhes.
        </p>
        {mode === "editor" && (
          <p className="text-red-500 text-xs mt-1">
            ID: {element.id} | Tipo: {element.type}
          </p>
        )}
      </div>
    );
  }
}
