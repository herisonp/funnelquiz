import {
  ElementType,
  Element,
  TextElementContent,
  MultipleChoiceElementContent,
  NavigationButtonElementContent,
} from "@/types/composed";

export interface ElementDefinition {
  type: ElementType;
  label: string;
  icon: string;
  category: "content" | "input" | "navigation";
  description: string;
  defaultContent:
    | TextElementContent
    | MultipleChoiceElementContent
    | NavigationButtonElementContent;
}

export const AVAILABLE_ELEMENTS: ElementDefinition[] = [
  {
    type: "TEXT",
    label: "Texto",
    icon: "Type",
    category: "content",
    description: "Adicione texto personalizado com formatação",
    defaultContent: {
      text: "Digite seu texto aqui",
      fontSize: "base",
      fontWeight: "normal",
      textAlign: "left",
    } as TextElementContent,
  },
  {
    type: "MULTIPLE_CHOICE",
    label: "Múltipla Escolha",
    icon: "CheckSquare",
    category: "input",
    description: "Pergunta com opções de resposta",
    defaultContent: {
      question: "Qual é a sua pergunta?",
      options: [
        { id: "option-1", text: "Opção 1" },
        { id: "option-2", text: "Opção 2" },
      ],
      required: false,
      allowMultiple: false,
    } as MultipleChoiceElementContent,
  },
  {
    type: "NAVIGATION_BUTTON",
    label: "Botão de Navegação",
    icon: "ArrowRight",
    category: "navigation",
    description: "Botão para navegar entre etapas",
    defaultContent: {
      label: "Continuar",
      targetStep: "next",
      variant: "primary",
    } as NavigationButtonElementContent,
  },
];

export function getElementDefinition(
  type: ElementType
): ElementDefinition | undefined {
  return AVAILABLE_ELEMENTS.find((def) => def.type === type);
}

export function createDefaultElement(
  type: ElementType
): Omit<Element, "id" | "stepId" | "order"> {
  const definition = getElementDefinition(type);
  if (!definition) {
    throw new Error(`Definição não encontrada para o tipo: ${type}`);
  }

  return {
    type,
    content: JSON.stringify(definition.defaultContent),
  };
}

export function getElementsByCategory(
  category: ElementDefinition["category"]
): ElementDefinition[] {
  return AVAILABLE_ELEMENTS.filter((def) => def.category === category);
}

export const ELEMENT_CATEGORIES = [
  {
    key: "content",
    label: "Conteúdo",
    description: "Elementos de texto e mídia",
  },
  {
    key: "input",
    label: "Perguntas",
    description: "Elementos de entrada de dados",
  },
  {
    key: "navigation",
    label: "Navegação",
    description: "Botões e controles de navegação",
  },
] as const;
