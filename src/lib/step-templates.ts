import { ElementType } from "@prisma/client";
import { CreateElementInput } from "@/types/composed";
import { createDefaultElement } from "@/lib/element-definitions";

export interface StepTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  elements: Omit<CreateElementInput, "order">[];
}

export const stepTemplates: StepTemplate[] = [
  {
    id: "introduction",
    name: "Introdução",
    description: "Página de boas-vindas com texto e botão para continuar",
    icon: "👋",
    elements: [
      {
        type: "TEXT" as ElementType,
        content: {
          text: "Bem-vindo ao nosso quiz!",
          fontSize: "2xl",
          fontWeight: "bold",
          textAlign: "center",
        },
      },
      {
        type: "TEXT" as ElementType,
        content: {
          text: "Responda algumas perguntas rápidas para descobrir mais sobre nossos serviços.",
          fontSize: "base",
          textAlign: "center",
        },
      },
      {
        type: "NAVIGATION_BUTTON" as ElementType,
        content: {
          label: "Começar Quiz",
          variant: "default",
          size: "default",
        },
      },
    ],
  },
  {
    id: "question",
    name: "Pergunta",
    description: "Pergunta com opções de múltipla escolha",
    icon: "❓",
    elements: [
      {
        type: "TEXT" as ElementType,
        content: {
          text: "Qual é a sua pergunta?",
          fontSize: "xl",
          fontWeight: "semibold",
          textAlign: "left",
        },
      },
      {
        type: "MULTIPLE_CHOICE" as ElementType,
        content: {
          question: "Selecione uma opção:",
          options: [
            { id: "1", text: "Opção 1", value: "opcao-1" },
            { id: "2", text: "Opção 2", value: "opcao-2" },
            { id: "3", text: "Opção 3", value: "opcao-3" },
          ],
          required: true,
          allowMultiple: false,
        },
      },
      {
        type: "NAVIGATION_BUTTON" as ElementType,
        content: {
          label: "Próxima",
          variant: "default",
          size: "default",
        },
      },
    ],
  },
  {
    id: "lead-capture",
    name: "Captura de Lead",
    description: "Formulário para capturar informações do usuário",
    icon: "📝",
    elements: [
      {
        type: "TEXT" as ElementType,
        content: {
          text: "Quase terminando!",
          fontSize: "xl",
          fontWeight: "semibold",
          textAlign: "center",
        },
      },
      {
        type: "TEXT" as ElementType,
        content: {
          text: "Para receber seus resultados personalizados, precisamos de algumas informações:",
          fontSize: "base",
          textAlign: "center",
        },
      },
      {
        type: "MULTIPLE_CHOICE" as ElementType,
        content: {
          question: "Nome completo:",
          options: [{ id: "name", text: "Digite seu nome", value: "name" }],
          required: true,
          allowMultiple: false,
        },
      },
      {
        type: "MULTIPLE_CHOICE" as ElementType,
        content: {
          question: "Email:",
          options: [{ id: "email", text: "Digite seu email", value: "email" }],
          required: true,
          allowMultiple: false,
        },
      },
      {
        type: "NAVIGATION_BUTTON" as ElementType,
        content: {
          label: "Enviar Resultados",
          variant: "default",
          size: "default",
        },
      },
    ],
  },
  {
    id: "thank-you",
    name: "Agradecimento",
    description: "Página final com agradecimento e próximos passos",
    icon: "🎉",
    elements: [
      {
        type: "TEXT" as ElementType,
        content: {
          text: "Obrigado!",
          fontSize: "2xl",
          fontWeight: "bold",
          textAlign: "center",
        },
      },
      {
        type: "TEXT" as ElementType,
        content: {
          text: "Suas respostas foram enviadas com sucesso. Em breve você receberá um email com seus resultados personalizados.",
          fontSize: "base",
          textAlign: "center",
        },
      },
      {
        type: "TEXT" as ElementType,
        content: {
          text: "Enquanto isso, que tal conhecer mais sobre nossos serviços?",
          fontSize: "base",
          textAlign: "center",
        },
      },
      {
        type: "NAVIGATION_BUTTON" as ElementType,
        content: {
          label: "Visitar Site",
          variant: "outline",
          size: "default",
        },
      },
    ],
  },
];

export function getTemplateById(templateId: string): StepTemplate | undefined {
  return stepTemplates.find((template) => template.id === templateId);
}

export function createStepFromTemplate(
  templateId: string
): Omit<CreateElementInput, "order">[] | null {
  const template = getTemplateById(templateId);
  if (!template) return null;

  return template.elements.map((element) => ({
    ...element,
    // Ensure we have all required fields from createDefaultElement
    ...createDefaultElement(element.type),
    // Override with template content
    content: element.content,
  }));
}
