import { ElementType } from "@prisma/client";
import { ElementContent } from "./composed";

// Dados do quiz para interface pública (sem dados sensíveis)
export interface PublicQuizData {
  id: string;
  title: string;
  description?: string;
  steps: PublicStepData[];
}

export interface PublicStepData {
  id: string;
  title: string;
  order: number;
  elements: PublicElementData[];
}

export interface PublicElementData {
  id: string;
  type: ElementType;
  order: number;
  content: ElementContent;
}

// Estado da sessão do quiz
export interface QuizSessionState {
  currentStepIndex: number;
  responses: Record<string, unknown>;
  sessionId: string;
  startedAt: Date;
}

// Navegação no quiz público
export interface QuizNavigationState {
  canGoBack: boolean;
  canGoForward: boolean;
  isLastStep: boolean;
  isFirstStep: boolean;
  currentStep: number;
  totalSteps: number;
}

// Progresso do quiz
export interface QuizProgress {
  completedSteps: number;
  totalSteps: number;
  percentage: number;
}

// Valores de resposta simplificados para o MVP
export type AnswerValue = string | string[] | number | boolean;

// Props para navegação no quiz público
export interface QuizNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isLastStep: boolean;
}

// Estado de validação para quiz público
export interface PublicQuizValidationState {
  isValid: boolean;
  errors: Record<string, string>;
  canProceed: boolean;
}
