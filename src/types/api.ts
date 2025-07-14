import { Quiz, Response } from "@prisma/client";
import {
  QuizWithSteps,
  ResponseWithAnswers,
  CreateQuizInput,
} from "./composed";

// Tipo base para respostas da API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Quiz API types
export interface CreateQuizRequest {
  quiz: CreateQuizInput;
}

export interface UpdateQuizRequest {
  quiz: Partial<Quiz>;
}

// Response API types
export interface SubmitResponseRequest {
  quizId: string;
  answers: Array<{
    elementId: string;
    value: unknown;
  }>;
}

// API Response types
export type CreateQuizResponse = ApiResponse<Quiz>;
export type GetQuizResponse = ApiResponse<QuizWithSteps>;
export type UpdateQuizResponse = ApiResponse<Quiz>;
export type SubmitResponseResponse = ApiResponse<Response>;
export type GetResponsesResponse = ApiResponse<ResponseWithAnswers[]>;

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ValidationErrorResponse extends ApiResponse {
  errors: Array<{
    field: string;
    message: string;
  }>;
}

export interface ValidationErrorResponse extends ApiResponse {
  errors: {
    field: string;
    message: string;
  }[];
}
