"use server";

import { prisma } from "@/lib/prisma";
import { cache } from "react";
import type { Prisma } from "@prisma/client";

/**
 * Cached function para buscar todos os quizzes
 * Uso do cache do React para otimizar consultas
 */
export const getQuizzes = cache(async () => {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            responses: true,
            steps: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return quizzes;
  } catch (error) {
    console.error("Erro ao buscar quizzes:", error);
    return [];
  }
});

/**
 * Cached function para buscar um quiz específico
 */
export const getQuizById = cache(async (id: string) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        steps: {
          include: {
            elements: true,
          },
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });

    return quiz;
  } catch (error) {
    console.error("Erro ao buscar quiz:", error);
    return null;
  }
});

/**
 * Cached function para buscar estatísticas dos quizzes
 */
export const getQuizStats = cache(async () => {
  try {
    const [totalQuizzes, publishedQuizzes, draftQuizzes, totalResponses] =
      await Promise.all([
        prisma.quiz.count(),
        prisma.quiz.count({ where: { isPublished: true } }),
        prisma.quiz.count({ where: { isPublished: false } }),
        prisma.response.count(),
      ]);

    return {
      totalQuizzes,
      publishedQuizzes,
      draftQuizzes,
      totalResponses,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return {
      totalQuizzes: 0,
      publishedQuizzes: 0,
      draftQuizzes: 0,
      totalResponses: 0,
    };
  }
});

/**
 * Função para buscar quizzes com filtros
 */
export async function getFilteredQuizzes(params: {
  search?: string;
  status?: "all" | "published" | "draft";
  limit?: number;
  offset?: number;
}) {
  try {
    const { search, status = "all", limit = 50, offset = 0 } = params;

    const where: Prisma.QuizWhereInput = {};

    // Filtro de busca
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filtro de status
    if (status === "published") {
      where.isPublished = true;
    } else if (status === "draft") {
      where.isPublished = false;
    }

    const [quizzes, totalCount] = await Promise.all([
      prisma.quiz.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              responses: true,
              steps: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.quiz.count({ where }),
    ]);

    return {
      quizzes,
      totalCount,
      hasMore: totalCount > offset + limit,
    };
  } catch (error) {
    console.error("Erro ao buscar quizzes filtrados:", error);
    return {
      quizzes: [],
      totalCount: 0,
      hasMore: false,
    };
  }
}
