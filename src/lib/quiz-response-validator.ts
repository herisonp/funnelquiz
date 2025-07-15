import { ElementType } from "@prisma/client";

export interface ResponseValidationError {
  elementId: string;
  field: string;
  message: string;
}

export interface ResponseValidationResult {
  isValid: boolean;
  errors: ResponseValidationError[];
}

export interface ElementResponse {
  elementId: string;
  elementType: ElementType;
  value: unknown;
  required?: boolean;
}

export class QuizResponseValidator {
  static validateStepResponses(
    elements: Array<{
      id: string;
      type: ElementType;
      content: unknown;
    }>,
    responses: Record<string, unknown>
  ): ResponseValidationResult {
    const errors: ResponseValidationError[] = [];

    for (const element of elements) {
      // Parse do conteúdo JSON se necessário
      let content: Record<string, unknown>;
      try {
        content =
          typeof element.content === "string"
            ? JSON.parse(element.content)
            : (element.content as Record<string, unknown>);
      } catch {
        continue; // Skip elementos com conteúdo inválido
      }

      const response = responses[element.id];
      const isRequired = content.required === true;

      // Validar resposta obrigatória
      if (isRequired && this.isEmpty(response)) {
        errors.push({
          elementId: element.id,
          field: "value",
          message: "Este campo é obrigatório",
        });
        continue;
      }

      // Validações específicas por tipo
      switch (element.type) {
        case ElementType.MULTIPLE_CHOICE:
          this.validateMultipleChoiceResponse(
            element,
            response,
            content,
            errors
          );
          break;
        // Outros tipos podem ser adicionados aqui no futuro
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private static validateMultipleChoiceResponse(
    element: { id: string; type: ElementType },
    response: unknown,
    content: Record<string, unknown>,
    errors: ResponseValidationError[]
  ): void {
    if (this.isEmpty(response)) return;

    const allowMultiple = content.allowMultiple === true;
    const options = Array.isArray(content.options) ? content.options : [];
    const validValues = options
      .map((opt: unknown) => {
        if (typeof opt === "object" && opt !== null && "value" in opt) {
          return (opt as { value: unknown }).value;
        }
        return null;
      })
      .filter(Boolean);

    if (allowMultiple) {
      // Múltipla seleção
      if (!Array.isArray(response)) {
        errors.push({
          elementId: element.id,
          field: "value",
          message: "Resposta deve ser uma lista de opções",
        });
        return;
      }

      const invalidValues = response.filter(
        (val) => !validValues.includes(val)
      );
      if (invalidValues.length > 0) {
        errors.push({
          elementId: element.id,
          field: "value",
          message: "Uma ou mais opções selecionadas são inválidas",
        });
      }
    } else {
      // Seleção única
      if (Array.isArray(response)) {
        errors.push({
          elementId: element.id,
          field: "value",
          message: "Apenas uma opção pode ser selecionada",
        });
        return;
      }

      if (!validValues.includes(response)) {
        errors.push({
          elementId: element.id,
          field: "value",
          message: "Opção selecionada é inválida",
        });
      }
    }
  }

  private static isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    return false;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    // Simples validação de telefone brasileiro
    const phoneRegex =
      /^(?:\+55\s?)?(?:\(\d{2}\)\s?)?(?:9\s?)?\d{4}[-.\s]?\d{4}$/;
    return phoneRegex.test(phone);
  }

  static getFieldValidationMessage(
    elementType: ElementType,
    fieldName: string,
    value: unknown
  ): string | null {
    switch (fieldName) {
      case "email":
        if (typeof value === "string" && value && !this.validateEmail(value)) {
          return "Email inválido";
        }
        break;
      case "phone":
        if (typeof value === "string" && value && !this.validatePhone(value)) {
          return "Telefone inválido";
        }
        break;
    }
    return null;
  }
}
