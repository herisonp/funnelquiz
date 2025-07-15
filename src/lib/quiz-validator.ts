import { QuizWithSteps } from "@/types/composed";
import { ElementType, Element } from "@prisma/client";

export interface ValidationError {
  type: "quiz" | "step" | "element";
  id: string;
  message: string;
  field?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class QuizValidator {
  static validate(quiz: QuizWithSteps | null): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!quiz) {
      errors.push({
        type: "quiz",
        id: "quiz",
        message: "Quiz não encontrado",
      });
      return { isValid: false, errors, warnings };
    }

    // Validação básica do quiz
    if (!quiz.title?.trim()) {
      errors.push({
        type: "quiz",
        id: quiz.id,
        message: "Quiz deve ter um título",
        field: "title",
      });
    }

    // Validação de steps
    if (quiz.steps.length === 0) {
      errors.push({
        type: "quiz",
        id: quiz.id,
        message: "Quiz deve ter pelo menos 1 etapa",
      });
    } else {
      quiz.steps.forEach((step) => {
        // Cada step deve ter pelo menos 1 elemento
        if (step.elements.length === 0) {
          errors.push({
            type: "step",
            id: step.id,
            message: `Etapa "${step.title}" deve ter pelo menos 1 elemento`,
          });
        }

        // Validação de elementos
        step.elements.forEach((element) => {
          const elementErrors = this.validateElement(element);
          errors.push(...elementErrors);
        });

        // Warning se step não tem título
        if (!step.title?.trim()) {
          warnings.push({
            type: "step",
            id: step.id,
            message: `Etapa sem título`,
            field: "title",
          });
        }
      });
    }

    // Warning se quiz tem muitas etapas
    if (quiz.steps.length > 5) {
      warnings.push({
        type: "quiz",
        id: quiz.id,
        message:
          "Quiz tem mais de 5 etapas. Considere dividir em múltiplos quizzes para melhor conversão",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private static validateElement(element: Element): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!element.content) {
      errors.push({
        type: "element",
        id: element.id,
        message: "Elemento deve ter conteúdo",
      });
      return errors;
    }

    // Parse do conteúdo JSON
    let content: Record<string, unknown>;
    try {
      content =
        typeof element.content === "string"
          ? JSON.parse(element.content)
          : (element.content as Record<string, unknown>);
    } catch {
      errors.push({
        type: "element",
        id: element.id,
        message: "Conteúdo do elemento é inválido",
      });
      return errors;
    }

    switch (element.type) {
      case ElementType.TEXT:
        if (typeof content.text !== "string" || !content.text.trim()) {
          errors.push({
            type: "element",
            id: element.id,
            message: "Elemento de texto deve ter conteúdo",
            field: "text",
          });
        }
        break;

      case ElementType.MULTIPLE_CHOICE:
        if (!Array.isArray(content.options) || content.options.length < 2) {
          errors.push({
            type: "element",
            id: element.id,
            message: "Múltipla escolha deve ter pelo menos 2 opções",
            field: "options",
          });
        } else {
          // Verificar se todas as opções têm texto
          content.options.forEach((option: unknown, index: number) => {
            if (
              typeof option === "object" &&
              option !== null &&
              "text" in option
            ) {
              const optionObj = option as { text: unknown };
              if (
                typeof optionObj.text !== "string" ||
                !optionObj.text.trim()
              ) {
                errors.push({
                  type: "element",
                  id: element.id,
                  message: `Opção ${index + 1} deve ter texto`,
                  field: `options.${index}.text`,
                });
              }
            } else {
              errors.push({
                type: "element",
                id: element.id,
                message: `Opção ${index + 1} é inválida`,
                field: `options.${index}`,
              });
            }
          });
        }
        break;

      case ElementType.NAVIGATION_BUTTON:
        if (typeof content.label !== "string" || !content.label.trim()) {
          errors.push({
            type: "element",
            id: element.id,
            message: "Botão deve ter texto",
            field: "label",
          });
        }
        break;
    }

    return errors;
  }

  static validateStep(
    quiz: QuizWithSteps | null,
    stepId: string
  ): ValidationResult {
    const fullValidation = this.validate(quiz);

    // Filtrar apenas erros da etapa específica
    const stepErrors = fullValidation.errors.filter(
      (error) =>
        (error.type === "step" && error.id === stepId) ||
        (error.type === "element" &&
          quiz?.steps
            .find((s) => s.id === stepId)
            ?.elements.some((e) => e.id === error.id))
    );

    const stepWarnings = fullValidation.warnings.filter(
      (warning) => warning.type === "step" && warning.id === stepId
    );

    return {
      isValid: stepErrors.length === 0,
      errors: stepErrors,
      warnings: stepWarnings,
    };
  }

  static canPreview(quiz: QuizWithSteps | null): boolean {
    const validation = this.validate(quiz);
    return validation.isValid;
  }

  static getQuickValidationMessage(quiz: QuizWithSteps | null): string | null {
    if (!quiz) return "Quiz não encontrado";

    if (quiz.steps.length === 0) return "Adicione pelo menos 1 etapa";

    const emptySteps = quiz.steps.filter((step) => step.elements.length === 0);
    if (emptySteps.length > 0) {
      return `${emptySteps.length} etapa(s) sem elementos`;
    }

    const validation = this.validate(quiz);
    if (validation.errors.length > 0) {
      return `${validation.errors.length} erro(s) encontrado(s)`;
    }

    return null;
  }
}
