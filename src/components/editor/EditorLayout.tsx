"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/hooks/useEditorStore";
import { useEditorPersistence } from "@/hooks/useEditorPersistence";
import EditorHeader from "./EditorHeader";
import ElementsSidebar from "./ElementsSidebar";
import EditorCanvas from "./EditorCanvas";
import PropertiesPanel from "./PropertiesPanel";
import StepsNavigation from "./StepsNavigation";
import { cn } from "@/lib/utils";

export default function EditorLayout() {
  const { isSidebarCollapsed, isPropertiesPanelOpen, createNewQuiz, quiz } =
    useEditorStore();
  const { saveNow } = useEditorPersistence();

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

      {/* Steps Navigation */}
      <StepsNavigation />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Elements */}
        <ElementsSidebar />

        {/* Main canvas area */}
        <div
          className={cn(
            "flex-1 flex flex-col transition-all duration-300",
            isSidebarCollapsed ? "ml-0" : "ml-80",
            isPropertiesPanelOpen ? "mr-80" : "mr-0"
          )}
        >
          <EditorCanvas />
        </div>

        {/* Right sidebar - Properties */}
        <PropertiesPanel />
      </div>
    </div>
  );
}
