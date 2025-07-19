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
  const { isSidebarCollapsed, isPropertiesPanelOpen, createNewQuiz, quiz } =
    useEditorStore();
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
              "flex-1 flex flex-col transition-all duration-300 min-w-0",
              !isSidebarCollapsed
                ? "ml-80 md:ml-[400px]" // Mobile: apenas sidebar (320px), Desktop: navegação + sidebar (400px)
                : "ml-0 md:ml-36", // Mobile: sem margin, Desktop: navegação + sidebar recolhido (36px)
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
