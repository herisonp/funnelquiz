import { TextElementContent } from "@/types/composed";

interface PublicTextElementProps {
  content: TextElementContent;
  elementId: string;
  quizColors?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    titleColor: string;
  };
  quizFonts?: {
    primaryFont: string;
    headingFont: string;
    baseFontSize: string;
  };
}

export function PublicTextElement({
  content,
  quizColors,
  quizFonts,
}: PublicTextElementProps) {
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

  // Determina a cor do texto baseada nas configurações
  const getTextColor = () => {
    if (content.color) return content.color;

    // Usa cor do título para textos grandes, cor normal para os demais
    const isTitle = content.fontSize === "2xl" || content.fontSize === "xl";
    return isTitle
      ? quizColors?.titleColor || "var(--quiz-title)"
      : quizColors?.textColor || "var(--quiz-text)";
  };

  // Determina se deve usar classe de título para aplicação da fonte
  const isLargeText = content.fontSize === "2xl" || content.fontSize === "xl";

  // Determina a fonte a ser usada
  const getFontFamily = () => {
    if (isLargeText && quizFonts?.headingFont) {
      return quizFonts.headingFont;
    }
    if (quizFonts?.primaryFont) {
      return quizFonts.primaryFont;
    }
    return undefined;
  };

  return (
    <div
      className={`
        prose prose-lg max-w-none 
        ${getFontSizeClass(content.fontSize)}
        ${getFontWeightClass(content.fontWeight)}
        ${getTextAlignClass(content.textAlign)}
        ${isLargeText ? "quiz-heading-text" : "quiz-body-text"}
      `}
      style={{
        color: getTextColor(),
        fontFamily: getFontFamily(),
      }}
    >
      <p
        className="mb-0"
        style={{
          fontFamily: getFontFamily(),
        }}
      >
        {content.text || "Texto vazio"}
      </p>
    </div>
  );
}
