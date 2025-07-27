"use client";

import { Element } from "@prisma/client";
import { TextElementContent, isTextElementContent } from "@/types/composed";
import { cn } from "@/lib/utils";

interface TextElementProps {
  element: Element;
  className?: string;
}

export function TextElement({ element, className }: TextElementProps) {
  // Parse content
  let content: TextElementContent;
  try {
    const parsed =
      typeof element.content === "string"
        ? JSON.parse(element.content)
        : element.content;
    content = isTextElementContent(parsed)
      ? parsed
      : {
          text: "Texto não disponível",
          fontSize: "base",
          textAlign: "left",
        };
  } catch {
    content = {
      text: "Erro ao carregar texto",
      fontSize: "base",
      textAlign: "left",
    };
  }

  const getFontSizeClass = (fontSize: string) => {
    const sizeMap = {
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    };
    return sizeMap[fontSize as keyof typeof sizeMap] || "text-base";
  };

  const getTextAlignClass = (textAlign: string) => {
    const alignMap = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };
    return alignMap[textAlign as keyof typeof alignMap] || "text-left";
  };

  const getFontWeightClass = (fontWeight?: string) => {
    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };
    return weightMap[fontWeight as keyof typeof weightMap] || "font-normal";
  };

  if (!content.text.trim()) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      <p
        className={cn(
          getFontSizeClass(content.fontSize || "base"),
          getTextAlignClass(content.textAlign || "left"),
          getFontWeightClass(content.fontWeight),
          "whitespace-pre-wrap break-words"
        )}
        style={{
          color: content.color || undefined,
        }}
      >
        {content.text}
      </p>
    </div>
  );
}
