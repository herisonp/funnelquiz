"use client";

import { Element } from "@prisma/client";
import {
  NavigationButtonElementContent,
  isNavigationButtonElementContent,
} from "@/types/composed";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationButtonElementProps {
  element: Element;
  onNavigate?: (targetStep: string) => void;
  disabled?: boolean;
  className?: string;
}

export function NavigationButtonElement({
  element,
  onNavigate,
  disabled = false,
  className,
}: NavigationButtonElementProps) {
  // Parse content
  let content: NavigationButtonElementContent;
  try {
    const contentStr =
      typeof element.content === "string"
        ? element.content
        : JSON.stringify(element.content);
    const parsed = JSON.parse(contentStr);
    content = isNavigationButtonElementContent(parsed)
      ? parsed
      : {
          label: "Continuar",
          targetStep: "next",
          variant: "primary",
        };
  } catch {
    content = {
      label: "Continuar",
      targetStep: "next",
      variant: "primary",
    };
  }

  const getButtonVariant = (variant: string) => {
    const variantMap = {
      primary: "default",
      secondary: "secondary",
      outline: "outline",
    };
    return variantMap[variant as keyof typeof variantMap] || "default";
  };

  const getIcon = (targetStep: string) => {
    if (targetStep === "previous") {
      return <ArrowLeft className="h-4 w-4" />;
    }
    if (targetStep === "submit") {
      return <CheckCircle className="h-4 w-4" />;
    }
    return <ArrowRight className="h-4 w-4" />;
  };

  const handleClick = () => {
    if (onNavigate && !disabled) {
      onNavigate(content.targetStep || "next");
    }
  };

  return (
    <div className={cn("w-full flex justify-center", className)}>
      <Button
        variant={
          getButtonVariant(content.variant || "primary") as
            | "default"
            | "secondary"
            | "outline"
        }
        onClick={handleClick}
        disabled={disabled}
        className="min-w-[120px]"
        size="lg"
      >
        {content.targetStep === "previous" && getIcon(content.targetStep)}
        <span className="mx-2">{content.label}</span>
        {content.targetStep !== "previous" &&
          getIcon(content.targetStep || "next")}
      </Button>
    </div>
  );
}
