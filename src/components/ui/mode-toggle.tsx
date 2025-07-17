"use client";

import { Button } from "@/components/ui/button";
import { QuickTooltip } from "@/components/ui/tooltip-help";
import { Eye, Edit3, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  isPreviewMode: boolean;
  onToggle: () => void;
  className?: string;
}

export function ModeToggle({
  isPreviewMode,
  onToggle,
  className,
}: ModeToggleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 bg-muted rounded-lg p-1",
        className
      )}
    >
      <QuickTooltip content={`Modo Edição${isPreviewMode ? " (Tab)" : ""}`}>
        <Button
          variant={!isPreviewMode ? "secondary" : "ghost"}
          size="sm"
          onClick={() => !isPreviewMode || onToggle()}
          className={cn(
            "h-8 px-3 gap-2 transition-all",
            !isPreviewMode && "bg-background shadow-sm"
          )}
        >
          <Edit3 className="h-4 w-4" />
          <span className="hidden sm:inline">Editar</span>
        </Button>
      </QuickTooltip>

      <QuickTooltip content={`Modo Preview${!isPreviewMode ? " (Tab)" : ""}`}>
        <Button
          variant={isPreviewMode ? "secondary" : "ghost"}
          size="sm"
          onClick={() => isPreviewMode || onToggle()}
          className={cn(
            "h-8 px-3 gap-2 transition-all",
            isPreviewMode && "bg-background shadow-sm"
          )}
        >
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">Preview</span>
        </Button>
      </QuickTooltip>

      <div className="ml-1 text-xs text-muted-foreground hidden md:flex items-center gap-1">
        <Keyboard className="h-3 w-3" />
        <span>Tab</span>
      </div>
    </div>
  );
}
