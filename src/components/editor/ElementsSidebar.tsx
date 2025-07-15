"use client";

import { useEditorStore } from "@/hooks/useEditorStore";
import {
  AVAILABLE_ELEMENTS,
  ELEMENT_CATEGORIES,
} from "@/lib/element-definitions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Type,
  CheckSquare,
  ArrowRight,
  ChevronLeft,
  Layers,
} from "lucide-react";
import DraggableElement from "./DraggableElement";

const iconMap = {
  Type,
  CheckSquare,
  ArrowRight,
};

export default function ElementsSidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useEditorStore();

  return (
    <>
      <div
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r transition-all duration-300 z-40",
          isSidebarCollapsed
            ? "-translate-x-full lg:-translate-x-0 lg:w-16"
            : "w-80"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                <h2 className="font-semibold">Elementos</h2>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className={cn("h-8 w-8 p-0", isSidebarCollapsed && "mx-auto")}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform",
                  isSidebarCollapsed && "rotate-180"
                )}
              />
            </Button>
          </div>

          {!isSidebarCollapsed && (
            <>
              <Separator />

              {/* Elements list */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  {ELEMENT_CATEGORIES.map((category) => {
                    const categoryElements = AVAILABLE_ELEMENTS.filter(
                      (element) => element.category === category.key
                    );

                    return (
                      <div key={category.key} className="space-y-2">
                        <div>
                          <h3 className="text-sm font-medium text-foreground">
                            {category.label}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {category.description}
                          </p>
                        </div>

                        <div className="space-y-2">
                          {categoryElements.map((element) => (
                            <DraggableElement
                              key={element.type}
                              element={element}
                              icon={
                                iconMap[element.icon as keyof typeof iconMap]
                              }
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
