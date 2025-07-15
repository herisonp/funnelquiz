import { StepWithElements, Element } from "@/types/composed";

export interface StepValidationResult {
  isValid: boolean;
  issues: StepValidationIssue[];
  status: "empty" | "incomplete" | "warning" | "valid";
}

export interface StepValidationIssue {
  type: "error" | "warning" | "info";
  message: string;
  elementId?: string;
}

export function validateStep(
  step: StepWithElements,
  isLastStep = false
): StepValidationResult {
  const issues: StepValidationIssue[] = [];
  let status: StepValidationResult["status"] = "valid";

  // Check if step is empty
  if (step.elements.length === 0) {
    issues.push({
      type: "warning",
      message: "Esta etapa está vazia. Adicione pelo menos um elemento.",
    });
    status = "empty";
    return { isValid: false, issues, status };
  }

  // Check for navigation button (not required on last step)
  const hasNavigationButton = step.elements.some(
    (element) => element.type === "NAVIGATION_BUTTON"
  );

  if (!hasNavigationButton && !isLastStep) {
    issues.push({
      type: "warning",
      message:
        "Adicione um botão de navegação para permitir que os usuários avancem para a próxima etapa.",
    });
    status = "warning";
  }

  // Check for content elements
  const hasContent = step.elements.some(
    (element) => element.type === "TEXT" || element.type === "MULTIPLE_CHOICE"
  );

  if (!hasContent) {
    issues.push({
      type: "warning",
      message: "Considere adicionar conteúdo (texto ou pergunta) nesta etapa.",
    });
    if (status === "valid") status = "warning";
  }

  // Validate individual elements
  step.elements.forEach((element) => {
    const elementIssues = validateElement(element);
    issues.push(...elementIssues);
  });

  // Check for multiple choice without options
  const multipleChoiceElements = step.elements.filter(
    (element) => element.type === "MULTIPLE_CHOICE"
  );

  multipleChoiceElements.forEach((element) => {
    const content = element.content as Record<string, unknown>;
    if (
      !content.options ||
      !Array.isArray(content.options) ||
      content.options.length === 0
    ) {
      issues.push({
        type: "error",
        message:
          "Pergunta de múltipla escolha precisa ter pelo menos uma opção.",
        elementId: element.id,
      });
      status = "incomplete";
    }
  });

  // Determine final validation status
  const hasErrors = issues.some((issue) => issue.type === "error");

  if (hasErrors) {
    status = "incomplete";
  }

  const isValid = status === "valid" || status === "warning";

  return {
    isValid,
    issues,
    status,
  };
}

function validateElement(element: Element): StepValidationIssue[] {
  const issues: StepValidationIssue[] = [];
  const content = element.content as Record<string, unknown>;

  switch (element.type) {
    case "TEXT":
      if (
        !content.text ||
        typeof content.text !== "string" ||
        content.text.trim() === ""
      ) {
        issues.push({
          type: "warning",
          message: "Elemento de texto está vazio.",
          elementId: element.id,
        });
      }
      break;

    case "MULTIPLE_CHOICE":
      if (
        !content.question ||
        typeof content.question !== "string" ||
        content.question.trim() === ""
      ) {
        issues.push({
          type: "warning",
          message: "Pergunta de múltipla escolha não tem texto da pergunta.",
          elementId: element.id,
        });
      }

      if (
        content.options &&
        Array.isArray(content.options) &&
        content.options.length > 0
      ) {
        content.options.forEach((option: unknown, index: number) => {
          const optionObj = option as Record<string, unknown>;
          if (
            !optionObj.text ||
            typeof optionObj.text !== "string" ||
            optionObj.text.trim() === ""
          ) {
            issues.push({
              type: "warning",
              message: `Opção ${index + 1} está vazia.`,
              elementId: element.id,
            });
          }
        });
      }
      break;

    case "NAVIGATION_BUTTON":
      if (
        !content.label ||
        typeof content.label !== "string" ||
        content.label.trim() === ""
      ) {
        issues.push({
          type: "warning",
          message: "Botão de navegação não tem texto.",
          elementId: element.id,
        });
      }
      break;
  }

  return issues;
}

export function validateAllSteps(steps: StepWithElements[]): {
  isValid: boolean;
  stepResults: Map<string, StepValidationResult>;
  totalIssues: number;
} {
  const stepResults = new Map<string, StepValidationResult>();
  let totalIssues = 0;
  let allValid = true;

  steps.forEach((step, index) => {
    const isLastStep = index === steps.length - 1;
    const result = validateStep(step, isLastStep);

    stepResults.set(step.id, result);
    totalIssues += result.issues.length;

    if (!result.isValid) {
      allValid = false;
    }
  });

  return {
    isValid: allValid,
    stepResults,
    totalIssues,
  };
}

// Helper function to get step status for UI
export function getStepStatus(
  step: StepWithElements,
  isLastStep = false
): {
  status: "empty" | "incomplete" | "warning" | "valid";
  color: "gray" | "red" | "yellow" | "green";
  icon: "circle" | "alert-circle" | "alert-triangle" | "check-circle";
} {
  const validation = validateStep(step, isLastStep);

  const statusMap = {
    empty: { color: "gray" as const, icon: "circle" as const },
    incomplete: { color: "red" as const, icon: "alert-circle" as const },
    warning: { color: "yellow" as const, icon: "alert-triangle" as const },
    valid: { color: "green" as const, icon: "check-circle" as const },
  };

  return {
    status: validation.status,
    ...statusMap[validation.status],
  };
}
