// Re-exports from Prisma
export * from "@prisma/client";

// Local type exports organized by domain
export * from "./composed";
export * from "./api";
// Explicitly re-export AnswerValue from composed to avoid ambiguity
export type { AnswerValue } from "./composed";
export * from "./public";
export * from "./components";
export * from "./validation";

// Common utility types for the application
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
