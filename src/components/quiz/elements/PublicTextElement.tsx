import { TextElementContent } from "@/types/composed";

interface PublicTextElementProps {
  content: TextElementContent;
  elementId: string;
}

export function PublicTextElement({ content }: PublicTextElementProps) {
  const getFontSizeClass = (fontSize?: string) => {
    switch (fontSize) {
      case "sm":
        return "text-sm";
      case "lg":
        return "text-lg";
      case "xl":
        return "text-xl";
      case "2xl":
        return "text-2xl";
      default:
        return "text-base";
    }
  };

  const getFontWeightClass = (fontWeight?: string) => {
    switch (fontWeight) {
      case "medium":
        return "font-medium";
      case "semibold":
        return "font-semibold";
      case "bold":
        return "font-bold";
      default:
        return "font-normal";
    }
  };

  const getTextAlignClass = (textAlign?: string) => {
    switch (textAlign) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <div
      className={`
        prose prose-lg max-w-none 
        ${getFontSizeClass(content.fontSize)}
        ${getFontWeightClass(content.fontWeight)}
        ${getTextAlignClass(content.textAlign)}
      `}
      style={{
        color: content.color || undefined,
      }}
    >
      <p className="mb-0">{content.text || "Texto vazio"}</p>
    </div>
  );
}
