"use client";

import { MousePointer2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyCanvasStateProps {
  className?: string;
}

export default function EmptyCanvasState({ className }: EmptyCanvasStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-8",
        "animate-in fade-in-50 duration-500",
        className
      )}
    >
      {/* Ícone principal com animação sutil */}
      <div className="relative mb-6">
        <div className="rounded-full bg-primary/10 p-6 mb-4">
          <MousePointer2 className="h-8 w-8 text-primary" />
        </div>

        {/* Indicador de direção para sidebar */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex items-center">
          <ArrowLeft className="h-4 w-4 text-muted-foreground animate-pulse" />
          <div className="ml-2 text-xs text-muted-foreground hidden sm:block">
            Sidebar
          </div>
        </div>
      </div>

      {/* Título principal */}
      <h3 className="text-xl font-semibold text-foreground mb-3">
        Comece criando seu quiz
      </h3>

      {/* Descrição e instruções */}
      <div className="space-y-2 max-w-md">
        <p className="text-muted-foreground">
          Arraste elementos da barra lateral para esta área ou clique nos
          elementos para adicioná-los.
        </p>

        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-muted rounded border text-[10px]">
              Esc
            </kbd>
            <span>deselecionar</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-muted rounded border text-[10px]">
              Del
            </kbd>
            <span>remover</span>
          </div>
        </div>
      </div>
    </div>
  );
}
