import { z } from "zod";

// Quiz validations
export const createQuizSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(100, "Título muito longo"),
  description: z.string().optional(),
});

export const quizIdSchema = z.object({
  id: z.string().cuid("ID inválido"),
});

// Element validations - serão expandidas na Tarefa 3
export const baseElementSchema = z.object({
  id: z.string().cuid(),
  type: z.enum(["text", "multiple-choice", "navigation-button"]),
  stepId: z.string().cuid(),
  order: z.number().int().min(0),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type QuizId = z.infer<typeof quizIdSchema>;
export type BaseElement = z.infer<typeof baseElementSchema>;
