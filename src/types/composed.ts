import {
  Quiz,
  Step,
  Element,
  Response,
  Answer,
  ElementType,
} from "@prisma/client";

// Tipos para operações do editor
export type QuizWithSteps = Quiz & {
  steps: (Step & { elements: Element[] })[];
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
  text: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  action: "next" | "previous" | "submit";
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
