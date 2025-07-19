import { z } from "zod";
import { ElementType } from "@prisma/client";

// Schema mais flexível para content (aceita qualquer JsonValue)
const elementContentSchema = z.union([
  z.record(z.any()), // object
  z.array(z.any()), // array
  z.string(), // string
  z.number(), // number
  z.boolean(), // boolean
  z.null(), // null
]);

// Schema para Element
const elementSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(ElementType),
  order: z.number(),
  content: elementContentSchema,
  stepId: z.string(),
});

// Schema para Step
const stepSchema = z.object({
  id: z.string(),
  title: z.string(),
  order: z.number(),
  quizId: z.string(),
  elements: z.array(elementSchema),
});

// Schema para Quiz
const quizSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z
    .string()
    .nullable()
    .transform((val) => val || ""),
  isPublished: z.boolean(),
  createdAt: z
    .union([z.date(), z.string()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val)),
  updatedAt: z
    .union([z.date(), z.string()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val)),
  steps: z.array(stepSchema),
});

// Schema para dados salvos (inclui metadados)
export const savedQuizDataSchema = z.object({
  version: z.string(),
  timestamp: z
    .union([z.date(), z.string()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val)),
  quiz: quizSchema,
  editorState: z
    .object({
      currentStepId: z.string().nullable(),
      selectedElementId: z.string().nullable(),
    })
    .optional(),
});

export type SavedQuizData = z.infer<typeof savedQuizDataSchema>;

// Schema para export/import
export const exportQuizSchema = z.object({
  version: z.string(),
  exportedAt: z
    .union([z.date(), z.string()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val)),
  quiz: quizSchema,
  metadata: z
    .object({
      appVersion: z.string(),
      userAgent: z.string().optional(),
    })
    .optional(),
});

export type ExportQuizData = z.infer<typeof exportQuizSchema>;

// Constantes
export const CURRENT_DATA_VERSION = "1.0.0";
export const STORAGE_KEY = "funnelquiz-editor-data";
export const BACKUP_STORAGE_KEY = "funnelquiz-editor-backup";
