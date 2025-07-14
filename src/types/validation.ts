// Erro de validação
export interface ValidationError {
  elementId: string;
  message: string;
  code: string;
}

// Estado de validação
export interface ValidationState {
  isValid: boolean;
  errors: ValidationError[];
  touched: Record<string, boolean>;
}

// Resultado de validação simples
export interface ValidationResult {
  isValid: boolean;
  error?: ValidationError;
}

// Regras de validação básicas para MVP
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minSelections?: number;
  maxSelections?: number;
}

// Context de validação para formulários
export interface ValidationContext {
  validateElement: (
    elementId: string,
    value: unknown,
    rules?: ValidationRules
  ) => ValidationResult;
  validateStep: (
    stepId: string,
    values: Record<string, unknown>
  ) => ValidationState;
  validateQuiz?: (values: Record<string, unknown>) => ValidationState;
  clearErrors?: () => void;
}
