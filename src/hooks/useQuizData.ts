import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useEditorStore } from "@/hooks/useEditorStore";
import { StorageManager } from "@/lib/storage-manager";
import { getQuizById, checkQuizExists } from "@/lib/actions/quiz-actions";
import { QuizWithSteps } from "@/types/composed";
import { SavedQuizData } from "@/schemas/quiz-schema";

interface UseQuizDataReturn {
  isLoading: boolean;
  error: string | null;
  quiz: QuizWithSteps | null;
  hasUnsavedChanges: boolean;
}

// Tipo para compatibilidade com dados antigos do localStorage
type LocalQuizData = SavedQuizData["quiz"] & {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  primaryFont?: string;
  headingFont?: string;
  baseFontSize?: string;
};

/**
 * Hook híbrido para carregamento de dados do quiz
 * Prioriza dados do banco, mas mantém localStorage como backup
 */
export function useQuizData(): UseQuizDataReturn {
  const params = useParams();
  const quizId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quiz = useEditorStore((state) => state.quiz);
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges);
  const setQuiz = useEditorStore((state) => state.setQuiz);

  useEffect(() => {
    let isCancelled = false;

    const loadQuizData = async () => {
      if (!quizId) {
        setError("ID do quiz não fornecido");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // 1. Primeiro verifica se o quiz existe no banco
        const existsResult = await checkQuizExists(quizId);

        if (!existsResult.success) {
          setError(existsResult.error || "Erro ao verificar quiz");
          setIsLoading(false);
          return;
        }

        if (!existsResult.data) {
          // Quiz não existe no banco - retorna 404
          notFound();
          return;
        }

        // 2. Carrega dados do banco
        const result = await getQuizById(quizId);

        if (!result.success || !result.data) {
          setError(result.error || "Erro ao carregar quiz");
          setIsLoading(false);
          return;
        }

        const dbQuiz = result.data;

        // 3. Verifica se há dados mais recentes no localStorage
        const storageManager = StorageManager.getInstance();
        let finalQuiz = dbQuiz;

        try {
          if (storageManager.isStorageAvailable()) {
            const localData = (await storageManager.loadData(
              `funnelquiz-editor-${quizId}`
            )) as SavedQuizData | null;

            if (localData?.quiz) {
              const localQuiz = localData.quiz as LocalQuizData;

              // Compara timestamps para decidir qual usar
              const dbTimestamp = new Date(dbQuiz.updatedAt).getTime();
              const localTimestamp = new Date(localData.timestamp).getTime();

              // Se dados locais são mais recentes, usa eles (abordagem híbrida)
              if (localTimestamp > dbTimestamp) {
                console.log("Usando dados do localStorage (mais recentes)");

                // Combina dados locais com estrutura do banco
                finalQuiz = {
                  ...dbQuiz, // Base do banco
                  ...localQuiz, // Sobrescreve com dados locais
                  id: quizId, // Garante que o ID está correto
                  // Garante compatibilidade com campos do banco
                  primaryColor:
                    localQuiz.primaryColor ||
                    localQuiz.colors?.primaryColor ||
                    dbQuiz.primaryColor,
                  backgroundColor:
                    localQuiz.backgroundColor ||
                    localQuiz.colors?.backgroundColor ||
                    dbQuiz.backgroundColor,
                  textColor:
                    localQuiz.textColor ||
                    localQuiz.colors?.textColor ||
                    dbQuiz.textColor,
                  titleColor:
                    localQuiz.titleColor ||
                    localQuiz.colors?.titleColor ||
                    dbQuiz.titleColor,
                  primaryFont:
                    localQuiz.primaryFont ||
                    localQuiz.fonts?.primaryFont ||
                    dbQuiz.primaryFont,
                  headingFont:
                    localQuiz.headingFont ||
                    localQuiz.fonts?.headingFont ||
                    dbQuiz.headingFont,
                  baseFontSize:
                    localQuiz.baseFontSize ||
                    localQuiz.fonts?.baseFontSize ||
                    dbQuiz.baseFontSize,
                  colors: localQuiz.colors || {
                    primaryColor: localQuiz.primaryColor || dbQuiz.primaryColor,
                    backgroundColor:
                      localQuiz.backgroundColor || dbQuiz.backgroundColor,
                    textColor: localQuiz.textColor || dbQuiz.textColor,
                    titleColor: localQuiz.titleColor || dbQuiz.titleColor,
                  },
                  fonts: localQuiz.fonts || {
                    primaryFont: localQuiz.primaryFont || dbQuiz.primaryFont,
                    headingFont: localQuiz.headingFont || dbQuiz.headingFont,
                    baseFontSize: localQuiz.baseFontSize || dbQuiz.baseFontSize,
                  },
                };
              } else {
                console.log("Usando dados do banco (mais recentes)");
              }
            }
          }
        } catch (localError) {
          console.warn(
            "Erro ao carregar dados locais, usando dados do banco:",
            localError
          );
        }

        if (isCancelled) return;

        // 4. Atualiza o store com os dados finais
        setQuiz(finalQuiz);

        console.log("Quiz carregado com sucesso:", finalQuiz.title);
      } catch (err) {
        if (isCancelled) return;

        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        console.error("Erro ao carregar quiz:", err);
        setError(errorMessage);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadQuizData();

    return () => {
      isCancelled = true;
    };
  }, [quizId, setQuiz]);

  return {
    isLoading,
    error,
    quiz,
    hasUnsavedChanges,
  };
}

/**
 * Hook para migração de dados do localStorage antigo
 * Remove dados não específicos do quiz quando carrega dados do banco
 */
export function useLocalStorageMigration(quizId: string) {
  useEffect(() => {
    const migrateOldData = () => {
      const storageManager = StorageManager.getInstance();

      if (!storageManager.isStorageAvailable()) return;

      try {
        // Verifica se existe dados no storage genérico
        const oldData = localStorage.getItem("funnelquiz-editor");

        if (oldData && quizId) {
          console.log("Migrando dados antigos para storage específico do quiz");

          // Move para storage específico do quiz
          localStorage.setItem(`funnelquiz-editor-${quizId}`, oldData);

          // Remove dados antigos
          localStorage.removeItem("funnelquiz-editor");
          localStorage.removeItem("funnelquiz-editor-backup");

          console.log("Migração concluída");
        }
      } catch (error) {
        console.warn("Erro na migração de dados:", error);
      }
    };

    migrateOldData();
  }, [quizId]);
}
