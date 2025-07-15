"use client";

import { useState, useEffect, useRef } from "react";
import { Element } from "@prisma/client";
import { TextElementContent, isTextElementContent } from "@/types/composed";
import { useEditorStore } from "@/hooks/useEditorStore";
import { cn } from "@/lib/utils";

interface TextElementProps {
  element: Element;
  isSelected?: boolean;
  isEditing?: boolean;
}

export function TextElement({
  element,
  isSelected,
  isEditing,
}: TextElementProps) {
  const { updateElement } = useEditorStore();
  const [isEditingText, setIsEditingText] = useState(false);
  const [localText, setLocalText] = useState("");
  const textRef = useRef<HTMLDivElement>(null);

  // Parse content
  let content: TextElementContent;
  try {
    const contentStr =
      typeof element.content === "string"
        ? element.content
        : JSON.stringify(element.content);
    const parsed = JSON.parse(contentStr);
    content = isTextElementContent(parsed)
      ? parsed
      : {
          text: "Texto inválido",
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

  useEffect(() => {
    setLocalText(content.text);
  }, [content.text]);

  const handleClick = () => {
    if (isEditing) {
      setIsEditingText(true);
    }
  };

  const handleTextChange = (newText: string) => {
    setLocalText(newText);
    updateElement(element.id, {
      content: JSON.stringify({
        ...content,
        text: newText,
      }),
    });
  };

  const handleBlur = () => {
    setIsEditingText(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setIsEditingText(false);
    }
    if (e.key === "Escape") {
      setIsEditingText(false);
      setLocalText(content.text);
    }
  };

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

  if (isEditingText && isEditing) {
    return (
      <div
        className={cn(
          "w-full border-2 border-dashed border-primary/50 rounded-md p-2",
          isSelected && "ring-2 ring-primary"
        )}
      >
        <input
          type="text"
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          onBlur={() => {
            handleTextChange(localText);
            handleBlur();
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full bg-transparent outline-none border-none",
            getFontSizeClass(content.fontSize || "base"),
            getTextAlignClass(content.textAlign || "left"),
            getFontWeightClass(content.fontWeight)
          )}
          autoFocus
          placeholder="Digite seu texto..."
        />
      </div>
    );
  }

  return (
    <div
      ref={textRef}
      onClick={handleClick}
      className={cn(
        "w-full rounded-md transition-all duration-200",
        isEditing && "cursor-text hover:bg-muted/50",
        isSelected && isEditing && "ring-2 ring-primary",
        !localText.trim() &&
          isEditing &&
          "border-2 border-dashed border-muted-foreground/30"
      )}
    >
      <p
        className={cn(
          getFontSizeClass(content.fontSize || "base"),
          getTextAlignClass(content.textAlign || "left"),
          getFontWeightClass(content.fontWeight),
          content.color && `text-[${content.color}]`,
          !localText.trim() && isEditing && "text-muted-foreground italic",
          "min-h-[1.5em] p-2"
        )}
      >
        {localText.trim() || (isEditing ? "Clique para editar..." : "")}
      </p>
    </div>
  );
}
