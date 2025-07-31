"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { QuizWithSteps } from "@/types/composed";

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
    .nullable()
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      return val.trim();
    }),
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
    const description = formData.get("description") as string | null;

    // Validar dados
    const validationResult = createQuizSchema.safeParse({
      title,
      description: description || "",
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
    redirect(`/dashboard/quiz/${result.data.id}`);
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
    revalidatePath(`/dashboard/quiz/${quizId}`);
    revalidatePath(`/${quizId}`);

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

// Tipos para as novas actions
export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Busca um quiz completo pelo ID
 */
export async function getQuizById(
  quizId: string
): Promise<ActionResult<QuizWithSteps | null>> {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        steps: {
          include: {
            elements: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!quiz) {
      return { success: false, error: "Quiz não encontrado" };
    }

    // Adiciona campos de compatibilidade para o frontend
    const quizWithCompatibility: QuizWithSteps = {
      ...quiz,
      colors: {
        primaryColor: quiz.primaryColor,
        backgroundColor: quiz.backgroundColor,
        textColor: quiz.textColor,
        titleColor: quiz.titleColor,
      },
      fonts: {
        primaryFont: quiz.primaryFont,
        headingFont: quiz.headingFont,
        baseFontSize: quiz.baseFontSize,
      },
    };

    return { success: true, data: quizWithCompatibility };
  } catch (error) {
    console.error("Erro ao buscar quiz:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

/**
 * Atualiza um quiz completo (dados gerais, steps e elementos)
 */
export async function updateQuiz(
  quizId: string,
  quiz: QuizWithSteps
): Promise<ActionResult<QuizWithSteps>> {
  try {
    // Transação para garantir consistência
    const updatedQuiz = await prisma.$transaction(async (tx) => {
      // 1. Atualiza dados gerais do quiz
      await tx.quiz.update({
        where: { id: quizId },
        data: {
          title: quiz.title,
          description: quiz.description,
          isPublished: quiz.isPublished,
          primaryColor: quiz.primaryColor,
          backgroundColor: quiz.backgroundColor,
          textColor: quiz.textColor,
          titleColor: quiz.titleColor,
          primaryFont: quiz.primaryFont,
          headingFont: quiz.headingFont,
          baseFontSize: quiz.baseFontSize,
        },
      });

      // 2. Remove steps que não existem mais
      const existingStepIds = quiz.steps.map((step) => step.id);
      await tx.step.deleteMany({
        where: {
          quizId: quizId,
          id: {
            notIn: existingStepIds,
          },
        },
      });

      // 3. Processa cada step
      for (const step of quiz.steps) {
        // Upsert do step
        await tx.step.upsert({
          where: { id: step.id },
          create: {
            id: step.id,
            title: step.title,
            order: step.order,
            quizId: quizId,
          },
          update: {
            title: step.title,
            order: step.order,
          },
        });

        // Remove elementos que não existem mais neste step
        const existingElementIds = step.elements.map((element) => element.id);
        await tx.element.deleteMany({
          where: {
            stepId: step.id,
            id: {
              notIn: existingElementIds,
            },
          },
        });

        // Upsert dos elementos
        for (const element of step.elements) {
          await tx.element.upsert({
            where: { id: element.id },
            create: {
              id: element.id,
              type: element.type,
              content: element.content as Prisma.InputJsonValue,
              order: element.order,
              stepId: step.id,
            },
            update: {
              type: element.type,
              content: element.content as Prisma.InputJsonValue,
              order: element.order,
            },
          });
        }
      }

      // 4. Retorna o quiz atualizado
      return await tx.quiz.findUnique({
        where: { id: quizId },
        include: {
          steps: {
            include: {
              elements: {
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      });
    });

    if (!updatedQuiz) {
      return { success: false, error: "Quiz não encontrado" };
    }

    // Adiciona campos de compatibilidade
    const quizWithCompatibility: QuizWithSteps = {
      ...updatedQuiz,
      colors: {
        primaryColor: updatedQuiz.primaryColor,
        backgroundColor: updatedQuiz.backgroundColor,
        textColor: updatedQuiz.textColor,
        titleColor: updatedQuiz.titleColor,
      },
      fonts: {
        primaryFont: updatedQuiz.primaryFont,
        headingFont: updatedQuiz.headingFont,
        baseFontSize: updatedQuiz.baseFontSize,
      },
    };

    revalidatePath(`/dashboard/quiz/${quizId}`);
    revalidatePath(`/${quizId}`);
    return { success: true, data: quizWithCompatibility };
  } catch (error) {
    console.error("Erro ao atualizar quiz:", error);
    return { success: false, error: "Erro ao atualizar quiz" };
  }
}

/**
 * Verifica se um quiz existe
 */
export async function checkQuizExists(
  quizId: string
): Promise<ActionResult<boolean>> {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: { id: true },
    });

    return { success: true, data: !!quiz };
  } catch (error) {
    console.error("Erro ao verificar quiz:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}
