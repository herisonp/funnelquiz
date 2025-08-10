import {
  Quiz,
  Step,
  Element,
  Response,
  Answer,
  ElementType,
} from "@prisma/client";

// Tipos para configuração de cores do quiz
export interface QuizColors {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  titleColor: string;
}

// Tipos para configuração de tipografia do quiz
export interface QuizFonts {
  primaryFont: string; // Fonte principal para todos os textos
  headingFont: string; // Fonte para títulos (h1, h2, h3) e textos grandes (xl, 2xl)
  baseFontSize: string; // Tamanho padrão da fonte
}

// Fontes disponíveis do Google Fonts
export const GOOGLE_FONTS = {
  SERIF: [
    { name: "Playfair Display", value: "Playfair Display, serif" },
    { name: "Merriweather", value: "Merriweather, serif" },
    { name: "Lora", value: "Lora, serif" },
    { name: "Crimson Text", value: "Crimson Text, serif" },
    { name: "Source Serif Pro", value: "Source Serif Pro, serif" },
  ],
  SANS_SERIF: [
    { name: "Inter", value: "Inter, sans-serif" },
    { name: "Roboto", value: "Roboto, sans-serif" },
    { name: "Open Sans", value: "Open Sans, sans-serif" },
    { name: "Montserrat", value: "Montserrat, sans-serif" },
    { name: "Poppins", value: "Poppins, sans-serif" },
    { name: "Nunito", value: "Nunito, sans-serif" },
    { name: "Source Sans Pro", value: "Source Sans Pro, sans-serif" },
  ],
} as const;

// Tamanhos de fonte disponíveis
export const FONT_SIZES = [
  { name: "Pequeno", value: "14px" },
  { name: "Médio", value: "16px" },
  { name: "Grande", value: "18px" },
  { name: "Extra Grande", value: "20px" },
] as const;

// Tipos para operações do editor
export type QuizWithSteps = Quiz & {
  steps: (Step & { elements: Element[] })[];
  colors?: QuizColors;
  fonts?: QuizFonts;
};

export type StepWithElements = Step & {
  elements: Element[];
};

// Tipos para resposta completa
export type ResponseWithAnswers = Response & {
  answers: Answer[];
};

// Tipos para criação (sem campos auto-gerados)
export type CreateQuizInput = Omit<Quiz, "id" | "createdAt" | "updatedAt">;
export type CreateStepInput = Omit<Step, "id" | "quizId">;
export type CreateElementInput = Omit<Element, "id" | "stepId">;

// Conteúdo específico para cada tipo de elemento
export interface TextElementContent {
  text: string;
  fontSize?: "sm" | "base" | "lg" | "xl" | "2xl";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  textAlign?: "left" | "center" | "right";
  color?: string;
}

export interface MultipleChoiceElementContent {
  question: string;
  options: Array<{
    id: string;
    text: string;
    value: string;
  }>;
  required?: boolean;
  allowMultiple?: boolean;
}

export interface NavigationButtonElementContent {
  label: string;
  targetStep?: "next" | "previous" | "submit" | string; // specific step ID or submit action
  variant?: "primary" | "secondary" | "outline";
}

// Union type para conteúdo de elementos
export type ElementContent =
  | TextElementContent
  | MultipleChoiceElementContent
  | NavigationButtonElementContent;

// Definição de elementos disponíveis no editor
export interface ElementDefinition {
  type: ElementType;
  label: string;
  icon: string;
  defaultContent: ElementContent;
  category: "content" | "input" | "navigation";
}

// Estado do editor
export interface EditorState {
  currentStepId: string | null;
  selectedElementId: string | null;
  isPreviewMode: boolean;
  unsavedChanges: boolean;
}

// Re-export dos tipos do Prisma para conveniência
export type {
  ElementType,
  Quiz,
  Step,
  Element,
  Response,
  Answer,
} from "@prisma/client";

// Tipos auxiliares para validação de conteúdo
export type ElementContentMap = {
  TEXT: TextElementContent;
  MULTIPLE_CHOICE: MultipleChoiceElementContent;
  NAVIGATION_BUTTON: NavigationButtonElementContent;
};

// Tipos para respostas
export interface AnswerValue {
  text?: string;
  selectedOptions?: string[];
  multipleChoice?: string | string[];
}

// Tipos para resposta de quiz
export interface QuizResponseData {
  quizId: string;
  sessionId: string;
  responses: Record<string, AnswerValue>;
  currentStepIndex: number;
  startedAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
}

// Type guards para validação de content
export function isTextElementContent(
  content: unknown
): content is TextElementContent {
  return (
    typeof content === "object" &&
    content !== null &&
    "text" in content &&
    typeof (content as Record<string, unknown>).text === "string"
  );
}

export function isMultipleChoiceElementContent(
  content: unknown
): content is MultipleChoiceElementContent {
  return (
    typeof content === "object" &&
    content !== null &&
    "question" in content &&
    "options" in content &&
    typeof (content as Record<string, unknown>).question === "string" &&
    Array.isArray((content as Record<string, unknown>).options)
  );
}

export function isNavigationButtonElementContent(
  content: unknown
): content is NavigationButtonElementContent {
  return (
    typeof content === "object" &&
    content !== null &&
    "label" in content &&
    typeof (content as Record<string, unknown>).label === "string"
  );
}
