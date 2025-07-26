"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import { useGoogleFonts, useQuizFontStyles } from "@/hooks/useGoogleFonts";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DropZone from "./DropZone";
import SortableElement from "./SortableElement";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function EditorCanvas() {
  const { quiz, currentStepId, selectElement, selectedElementId } =
    useEditorStore();

  const currentStep = quiz?.steps.find((step) => step.id === currentStepId);
  const elements = currentStep?.elements || [];

  // Load Google Fonts and apply font styles
  useGoogleFonts(quiz);
  useQuizFontStyles(quiz);

  // Apply quiz colors as CSS variables
  useEffect(() => {
    if (quiz?.colors) {
      const root = document.documentElement;
      root.style.setProperty("--quiz-primary", quiz.colors.primaryColor);
      root.style.setProperty("--quiz-background", quiz.colors.backgroundColor);
      root.style.setProperty("--quiz-text", quiz.colors.textColor);
      root.style.setProperty("--quiz-title", quiz.colors.titleColor);
    }
  }, [quiz?.colors]);

  // Handle click on canvas to deselect elements
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Check if click was on canvas area or empty space
    const target = e.target as HTMLElement;
    const isCanvasArea =
      target.closest(".canvas-deselect-area") === e.currentTarget;

    if (isCanvasArea) {
      selectElement(null);
    }
  };

  if (!quiz || !currentStep) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          title="Nenhum quiz selecionado"
          description="Selecione ou crie um quiz para começar a editar."
        />
      </div>
    );
  }

  // Render editor mode
  return (
    <div className="flex-1 flex flex-col bg-muted/30 overflow-auto">
      {/* Canvas content area with improved visual container */}
      <div className="flex-1 p-6">
        {/* Canvas container with visual improvements */}
        <div
          className={cn(
            // Base canvas styling - alterado para permitir scroll vertical
            "mx-auto max-w-4xl min-h-[calc(100vh-12rem)]",
            "rounded-lg border shadow-sm canvas-container animate-canvas-enter quiz-canvas",
            // Interactive states
            "canvas-deselect-area",
            selectedElementId && "cursor-pointer has-selection",
            // Hover and focus states
            "hover:shadow-md focus-within:ring-2 focus-within:ring-primary/20",
            // Better visual hierarchy - removido overflow-hidden
            "relative transition-all duration-200"
          )}
          style={{
            backgroundColor: quiz?.colors?.backgroundColor || "#ffffff",
          }}
          onClick={handleCanvasClick}
        >
          <div
            className={cn(
              "w-full p-8 relative",
              elements.length === 0 &&
                "flex items-center justify-center min-h-[calc(100vh-20rem)]"
            )}
          >
            {/* Drop zone principal que cobre todo o canvas */}
            <DropZone
              id="main-canvas-dropzone"
              className="w-[90%] absolute inset-0 z-0 left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2"
              showVisual={elements.length === 0}
            />

            {/* Conteúdo do canvas */}
            <div className="w-full max-w-[450px] mx-auto relative z-10">
              <SortableContext
                items={elements.map((el) => el.id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  className={cn(
                    "w-full space-y-6",
                    elements.length === 0 &&
                      "min-h-[calc(100vh-20rem)] flex items-center justify-center"
                  )}
                >
                  {elements.map((element) => (
                    <SortableElement key={element.id} element={element} />
                  ))}
                </div>
              </SortableContext>
            </div>
          </div>

          {/* Subtle visual indicators */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none transition-all duration-200",
              "ring-0 ring-primary/20",
              selectedElementId && "ring-2"
            )}
          />
        </div>
      </div>
    </div>
  );
}
