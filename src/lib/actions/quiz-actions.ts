"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

// Schema de validação para criação de quiz
const createQuizSchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres")
    .trim(),
  description: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .optional()
    .transform((val) => val || null),
});

// Tipo para o resultado da action
export type CreateQuizResult = {
  success: boolean;
  data?: {
    id: string;
    title: string;
    description: string | null;
  };
  error?: string;
  fieldErrors?: {
    title?: string[];
    description?: string[];
  };
};

/**
 * Server Action para criar um novo quiz
 * Cria um quiz com uma step inicial vazia
 */
export async function createQuiz(
  formData: FormData
): Promise<CreateQuizResult> {
  try {
    // Extrair dados do FormData
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    // Validar dados
    const validationResult = createQuizSchema.safeParse({
      title,
      description,
    });

    if (!validationResult.success) {
      return {
        success: false,
        error: "Dados inválidos",
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { title: validTitle, description: validDescription } =
      validationResult.data;

    // Criar quiz no banco de dados
    const quiz = await prisma.quiz.create({
      data: {
        title: validTitle,
        description: validDescription,
        isPublished: false,
        // Criar uma step inicial automaticamente
        steps: {
          create: {
            title: "Etapa 1",
            order: 0,
          },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    // Revalidar cache da página do dashboard
    revalidatePath("/dashboard");

    return {
      success: true,
      data: quiz,
    };
  } catch (error) {
    console.error("Erro ao criar quiz:", error);
    return {
      success: false,
      error: "Erro interno do servidor. Tente novamente.",
    };
  }
}

/**
 * Server Action para criar um quiz e redirecionar para o editor
 */
export async function createQuizAndRedirect(formData: FormData) {
  const result = await createQuiz(formData);

  if (result.success && result.data) {
    // Revalidar cache do dashboard antes de redirecionar
    revalidatePath("/dashboard");

    // Redirecionar para o editor do quiz criado
    redirect(`/editor/${result.data.id}`);
  }

  // Se chegou aqui, houve um erro - retornar o resultado
  return result;
}

/**
 * Server Action para deletar um quiz
 */
export async function deleteQuiz(quizId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.quiz.delete({
      where: { id: quizId },
    });

    // Revalidar cache da página do dashboard
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar quiz:", error);
    return {
      success: false,
      error: "Erro ao deletar quiz. Tente novamente.",
    };
  }
}

/**
 * Server Action para duplicar um quiz
 */
export async function duplicateQuiz(quizId: string): Promise<CreateQuizResult> {
  try {
    // Buscar quiz original com todas as steps e elementos
    const originalQuiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        steps: {
          include: {
            elements: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!originalQuiz) {
      return {
        success: false,
        error: "Quiz não encontrado",
      };
    }

    // Criar cópia do quiz
    const duplicatedQuiz = await prisma.quiz.create({
      data: {
        title: `${originalQuiz.title} (Cópia)`,
        description: originalQuiz.description,
        isPublished: false,
        primaryColor: originalQuiz.primaryColor,
        backgroundColor: originalQuiz.backgroundColor,
        textColor: originalQuiz.textColor,
        titleColor: originalQuiz.titleColor,
        primaryFont: originalQuiz.primaryFont,
        headingFont: originalQuiz.headingFont,
        baseFontSize: originalQuiz.baseFontSize,
        steps: {
          create: originalQuiz.steps.map((step) => ({
            title: step.title,
            order: step.order,
            elements: {
              create: step.elements.map((element) => ({
                type: element.type,
                content: element.content as Prisma.InputJsonValue,
                order: element.order,
              })),
            },
          })),
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    // Revalidar cache da página do dashboard
    revalidatePath("/dashboard");

    return {
      success: true,
      data: duplicatedQuiz,
    };
  } catch (error) {
    console.error("Erro ao duplicar quiz:", error);
    return {
      success: false,
      error: "Erro ao duplicar quiz. Tente novamente.",
    };
  }
}
