export interface QuizNavigationState {
  /** ID da etapa atual */
  currentStepId: string;
  /** ID da última etapa acessada (para funcionalidades futuras como "voltar") */
  lastStepId: string | null;
  /** Histórico de navegação (para analytics ou funcionalidades avançadas) */
  navigationHistory: string[];
  /** Timestamp da última navegação */
  lastNavigationAt: Date;
}

export interface NavigationTarget {
  /** Tipo da navegação */
  type: "next" | "previous" | "submit" | "step";
  /** ID da etapa de destino (quando type === "step") */
  stepId?: string;
}

export interface StepNavigationInfo {
  /** ID da etapa atual */
  currentStepId: string;
  /** Índice da etapa atual (para compatibilidade) */
  currentStepIndex: number;
  /** Se é a primeira etapa */
  isFirstStep: boolean;
  /** Se é a última etapa */
  isLastStep: boolean;
  /** Se o quiz foi completado */
  isCompleted: boolean;
  /** Progresso percentual */
  progress: number;
}
