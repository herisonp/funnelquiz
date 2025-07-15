"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TooltipHelpProps {
  content: string;
  children?: React.ReactNode;
  variant?: "info" | "help";
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  shortcut?: string;
}

export function TooltipHelp({
  content,
  children,
  variant = "help",
  side = "top",
  className,
  shortcut,
}: TooltipHelpProps) {
  const Icon = variant === "help" ? HelpCircle : Info;

  const tooltipContent = (
    <div className="space-y-1">
      <p className="text-sm">{content}</p>
      {shortcut && (
        <div className="flex items-center gap-1 pt-1 border-t border-border/50">
          <span className="text-xs text-muted-foreground">Atalho:</span>
          <kbd className="px-1 py-0.5 text-xs bg-muted rounded border">
            {shortcut}
          </kbd>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors",
                "h-4 w-4",
                className
              )}
            >
              <Icon className="h-3 w-3" />
              <span className="sr-only">{content}</span>
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface HelpTextProps {
  children: React.ReactNode;
  className?: string;
}

export function HelpText({ children, className }: HelpTextProps) {
  return (
    <p className={cn("text-sm text-muted-foreground mt-1", className)}>
      {children}
    </p>
  );
}

interface QuickTooltipProps {
  content: string;
  children: React.ReactNode;
  shortcut?: string;
  side?: "top" | "right" | "bottom" | "left";
}

export function QuickTooltip({
  content,
  children,
  shortcut,
  side = "top",
}: QuickTooltipProps) {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>
          <div className="space-y-1">
            <p className="text-sm">{content}</p>
            {shortcut && (
              <div className="flex items-center gap-1 pt-1 border-t border-border/50">
                <kbd className="px-1 py-0.5 text-xs bg-muted rounded border">
                  {shortcut}
                </kbd>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
