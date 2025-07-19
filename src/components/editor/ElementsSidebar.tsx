"use client";

import {
  AVAILABLE_ELEMENTS,
  ELEMENT_CATEGORIES,
} from "@/lib/element-definitions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Type, CheckSquare, ArrowRight, Layers } from "lucide-react";
import DraggableElement from "./DraggableElement";

const iconMap = {
  Type,
  CheckSquare,
  ArrowRight,
};

export default function ElementsSidebar() {
  return (
    <>
      <div className="fixed top-16 left-0 md:left-60 w-44 h-[calc(100vh-4rem)] bg-background border-r z-40">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center p-2">
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              <h2 className="font-semibold text-sm">Elementos</h2>
            </div>
          </div>
          <Separator />

          {/* Elements list */}
          <ScrollArea className="flex-1 p-1">
            <div className="space-y-4">
              {ELEMENT_CATEGORIES.map((category) => {
                const categoryElements = AVAILABLE_ELEMENTS.filter(
                  (element) => element.category === category.key
                );

                return (
                  <div key={category.key} className="space-y-2">
                    <div>
                      <h3 className="text-xs font-medium text-foreground">
                        {category.label}
                      </h3>
                    </div>

                    <div className="grid gap-1">
                      {categoryElements.map((element) => (
                        <DraggableElement
                          key={element.type}
                          element={element}
                          icon={iconMap[element.icon as keyof typeof iconMap]}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
