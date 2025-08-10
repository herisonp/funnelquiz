"use client";

import { Element } from "@prisma/client";
import {
  NavigationButtonElementContent,
  isNavigationButtonElementContent,
} from "@/types/composed";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getContrastColor } from "@/lib/color-utils";

interface NavigationButtonElementProps {
  element: Element;
  onNavigate?: (targetStep: string) => void;
  disabled?: boolean;
  className?: string;
  quizColors?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    titleColor: string;
  };
}

export function NavigationButtonElement({
  element,
  onNavigate,
  disabled = false,
  className,
  quizColors,
}: NavigationButtonElementProps) {
  // Parse content
  let content: NavigationButtonElementContent;
  try {
    const parsed =
      typeof element.content === "string"
        ? JSON.parse(element.content)
        : element.content;
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

  // Calcular cores para o botão principal (primary/default)
  const getPrimaryButtonStyles = () => {
    const primaryColor = quizColors?.primaryColor;

    if (primaryColor && (content.variant === "primary" || !content.variant)) {
      const textColor = getContrastColor(primaryColor);
      return {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
        color: textColor,
      };
    }

    return undefined;
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
        style={getPrimaryButtonStyles()}
      >
        {content.targetStep === "previous" && getIcon(content.targetStep)}
        <span className="mx-2">{content.label}</span>
        {content.targetStep !== "previous" &&
          getIcon(content.targetStep || "next")}
      </Button>
    </div>
  );
}
