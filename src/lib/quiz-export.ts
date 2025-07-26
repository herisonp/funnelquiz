import { StorageManager } from "@/lib/storage-manager";
import {
  exportQuizSchema,
  ExportQuizData,
  CURRENT_DATA_VERSION,
} from "@/schemas/quiz-schema";
import { QuizWithSteps } from "@/types/composed";

export class QuizExportService {
  private storageManager: StorageManager;

  constructor() {
    this.storageManager = StorageManager.getInstance();
  }

  /**
   * Exporta quiz para arquivo JSON
   */
  public exportQuiz(quiz: QuizWithSteps, filename?: string): void {
    try {
      const exportData: ExportQuizData = {
        version: CURRENT_DATA_VERSION,
        exportedAt: new Date(),
        quiz: {
          ...quiz,
          description: quiz.description || "",
        },
        metadata: {
          appVersion: "1.0.0",
          userAgent: navigator.userAgent,
        },
      };

      // Valida dados antes de exportar
      const validatedData = exportQuizSchema.parse(exportData);

      this.storageManager.exportData(
        {
          version: validatedData.version,
          timestamp: validatedData.exportedAt,
          quiz: validatedData.quiz,
        },
        filename
      );
    } catch (error) {
      throw new Error(
        `Erro ao exportar quiz: ${
          error instanceof Error ? error.message : error
        }`
      );
    }
  }

  /**
   * Cria um backup do quiz atual
   */
  public createBackup(quiz: QuizWithSteps): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `backup-${quiz.title}-${timestamp}.json`;
    this.exportQuiz(quiz, filename);
  }
}

export class QuizImportService {
  /**
   * Importa quiz de arquivo JSON
   */
  public importQuiz(file: File): Promise<QuizWithSteps> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;

          if (!content) {
            reject(new Error("Arquivo vazio ou inválido"));
            return;
          }

          const data = JSON.parse(content);

          // Valida dados importados
          const validatedData = exportQuizSchema.parse(data);

          // Verifica compatibilidade de versão
          if (!this.isVersionCompatible(validatedData.version)) {
            console.warn(
              `Versão ${validatedData.version} pode não ser totalmente compatível`
            );
          }

          // Adiciona valores padrão para compatibilidade
          const importedQuiz =
            validatedData.quiz as typeof validatedData.quiz & {
              primaryColor?: string;
              backgroundColor?: string;
              textColor?: string;
              titleColor?: string;
              primaryFont?: string;
              headingFont?: string;
              baseFontSize?: string;
            };

          const quizWithDefaults = {
            ...importedQuiz,
            primaryColor:
              importedQuiz.primaryColor ||
              importedQuiz.colors?.primaryColor ||
              "#3b82f6",
            backgroundColor:
              importedQuiz.backgroundColor ||
              importedQuiz.colors?.backgroundColor ||
              "#ffffff",
            textColor:
              importedQuiz.textColor ||
              importedQuiz.colors?.textColor ||
              "#374151",
            titleColor:
              importedQuiz.titleColor ||
              importedQuiz.colors?.titleColor ||
              "#111827",
            primaryFont:
              importedQuiz.primaryFont ||
              importedQuiz.fonts?.primaryFont ||
              "Inter, sans-serif",
            headingFont:
              importedQuiz.headingFont ||
              importedQuiz.fonts?.headingFont ||
              "Inter, sans-serif",
            baseFontSize:
              importedQuiz.baseFontSize ||
              importedQuiz.fonts?.baseFontSize ||
              "16px",
            colors: importedQuiz.colors || {
              primaryColor: importedQuiz.primaryColor || "#3b82f6",
              backgroundColor: importedQuiz.backgroundColor || "#ffffff",
              textColor: importedQuiz.textColor || "#374151",
              titleColor: importedQuiz.titleColor || "#111827",
            },
            fonts: importedQuiz.fonts || {
              primaryFont: importedQuiz.primaryFont || "Inter, sans-serif",
              headingFont: importedQuiz.headingFont || "Inter, sans-serif",
              baseFontSize: importedQuiz.baseFontSize || "16px",
            },
          };

          resolve(quizWithDefaults);
        } catch (error) {
          if (error instanceof SyntaxError) {
            reject(new Error("Arquivo JSON inválido"));
          } else {
            reject(
              new Error(
                `Erro ao validar dados: ${
                  error instanceof Error ? error.message : error
                }`
              )
            );
          }
        }
      };

      reader.onerror = () => {
        reject(new Error("Erro ao ler arquivo"));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Importa quiz de string JSON
   */
  public importQuizFromString(jsonString: string): QuizWithSteps {
    try {
      const data = JSON.parse(jsonString);
      const validatedData = exportQuizSchema.parse(data);

      if (!this.isVersionCompatible(validatedData.version)) {
        console.warn(
          `Versão ${validatedData.version} pode não ser totalmente compatível`
        );
      }

      // Adiciona valores padrão para compatibilidade
      const importedQuiz = validatedData.quiz as typeof validatedData.quiz & {
        primaryColor?: string;
        backgroundColor?: string;
        textColor?: string;
        titleColor?: string;
        primaryFont?: string;
        headingFont?: string;
        baseFontSize?: string;
      };

      return {
        ...importedQuiz,
        primaryColor:
          importedQuiz.primaryColor ||
          importedQuiz.colors?.primaryColor ||
          "#3b82f6",
        backgroundColor:
          importedQuiz.backgroundColor ||
          importedQuiz.colors?.backgroundColor ||
          "#ffffff",
        textColor:
          importedQuiz.textColor || importedQuiz.colors?.textColor || "#374151",
        titleColor:
          importedQuiz.titleColor ||
          importedQuiz.colors?.titleColor ||
          "#111827",
        primaryFont:
          importedQuiz.primaryFont ||
          importedQuiz.fonts?.primaryFont ||
          "Inter, sans-serif",
        headingFont:
          importedQuiz.headingFont ||
          importedQuiz.fonts?.headingFont ||
          "Inter, sans-serif",
        baseFontSize:
          importedQuiz.baseFontSize ||
          importedQuiz.fonts?.baseFontSize ||
          "16px",
        colors: importedQuiz.colors || {
          primaryColor: importedQuiz.primaryColor || "#3b82f6",
          backgroundColor: importedQuiz.backgroundColor || "#ffffff",
          textColor: importedQuiz.textColor || "#374151",
          titleColor: importedQuiz.titleColor || "#111827",
        },
        fonts: importedQuiz.fonts || {
          primaryFont: importedQuiz.primaryFont || "Inter, sans-serif",
          headingFont: importedQuiz.headingFont || "Inter, sans-serif",
          baseFontSize: importedQuiz.baseFontSize || "16px",
        },
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error("JSON inválido");
      } else {
        throw new Error(
          `Erro ao validar dados: ${
            error instanceof Error ? error.message : error
          }`
        );
      }
    }
  }

  /**
   * Verifica se a versão é compatível
   */
  private isVersionCompatible(version: string): boolean {
    const currentVersion = CURRENT_DATA_VERSION;

    // Para o MVP, apenas a versão atual é considerada compatível
    // No futuro, implementar lógica de compatibilidade mais sofisticada
    return version === currentVersion;
  }

  /**
   * Migra dados de versões antigas (para implementação futura)
   */
  private migrateData(
    data: Record<string, unknown>,
    fromVersion: string
  ): Record<string, unknown> {
    // Placeholder para migration logic
    console.log(
      `Migrando dados da versão ${fromVersion} para ${CURRENT_DATA_VERSION}`
    );

    // Por enquanto, retorna dados sem modificação
    return data;
  }
}

// Instâncias singleton para uso em toda a aplicação
export const quizExportService = new QuizExportService();
export const quizImportService = new QuizImportService();
