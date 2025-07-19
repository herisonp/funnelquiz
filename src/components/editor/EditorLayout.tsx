"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/hooks/useEditorStore";
import { useEditorPersistence } from "@/hooks/useEditorPersistence";
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
  const { saveNow } = useEditorPersistence();

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
      saveNow();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveNow]);

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
              "flex-1 flex flex-col min-w-0 ml-72 md:ml-96", // Mobile: apenas sidebar (288px), Desktop: navegação (240px) + sidebar (144px) = 384px
              isPropertiesPanelOpen ? "mr-80" : "mr-0"
            )}
          >
            <EditorCanvas />
          </div>

          {/* Right sidebar - Properties */}
          <PropertiesPanel />
        </div>

        {/* Drag overlay */}
        <EditorDragOverlay activeElement={dragState.activeElement} />
      </DndContext>
    </div>
  );
}
