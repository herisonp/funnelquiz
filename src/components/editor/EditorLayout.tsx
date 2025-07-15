"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import EditorHeader from "./EditorHeader";
import ElementsSidebar from "./ElementsSidebar";
import EditorCanvas from "./EditorCanvas";
import PropertiesPanel from "./PropertiesPanel";
import { cn } from "@/lib/utils";

export default function EditorLayout() {
  const { isSidebarCollapsed, isPropertiesPanelOpen } = useEditorStore();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <EditorHeader />

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
