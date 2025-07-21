"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/hooks/useEditorStore";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useEditorDragDrop } from "@/hooks/useEditorDragDrop";
import { DndContext, closestCenter } from "@dnd-kit/core";
import EditorHeader from "./EditorHeader";
import ElementsSidebar from "./ElementsSidebar";
import EditorCanvas from "./EditorCanvas";
import PropertiesPanel from "./PropertiesPanel";
import StepsVerticalNavigation from "./StepsVerticalNavigation";
import EditorDragOverlay from "./EditorDragOverlay";
import { cn } from "@/lib/utils";

export default function EditorLayout() {
  const { isPropertiesPanelOpen, createNewQuiz, quiz } = useEditorStore();
  const { saveManually } = useAutoSave();

  // Drag and drop hooks (only in editor mode)
  const {
    sensors,
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useEditorDragDrop();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Initialize quiz if none exists
  useEffect(() => {
    if (!quiz) {
      createNewQuiz();
    }
  }, [quiz, createNewQuiz]);

  // Save before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveManually();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveManually]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <EditorHeader />

      {/* Steps Vertical Navigation */}
      <StepsVerticalNavigation />

      {/* Main content area with DndContext */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar - Elements */}
          <ElementsSidebar />

          {/* Main canvas area */}
          <div
            className={cn(
              "flex-1 flex flex-col min-w-0",
              // Margem esquerda: Mobile: ElementsSidebar (11rem = 176px), Desktop: StepsNav (15rem = 240px) + ElementsSidebar (11rem = 176px) = 26rem (416px)
              "ml-44 md:ml-[26rem]",
              // Margem direita quando PropertiesPanel está aberto (20rem = 320px)
              isPropertiesPanelOpen ? "mr-80" : "mr-0"
            )}
          >
            <EditorCanvas />
          </div>

          {/* Right sidebar - Properties */}
          {isPropertiesPanelOpen && <PropertiesPanel />}
        </div>

        {/* Drag overlay */}
        <EditorDragOverlay activeElement={dragState.activeElement} />
      </DndContext>
    </div>
  );
}
