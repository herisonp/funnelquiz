import { AnswerValue, QuizResponseData } from "@/types/composed";

export class QuizResponseUtils {
  /**
   * Validate answer value based on element type and requirements
   */
  static validateAnswerValue(
    answerValue: AnswerValue | undefined,
    elementType: string,
    isRequired: boolean = false
  ): boolean {
    if (!answerValue && !isRequired) return true;
    if (!answerValue && isRequired) return false;
    if (!answerValue) return false;

    switch (elementType) {
      case "MULTIPLE_CHOICE":
        if (Array.isArray(answerValue.multipleChoice)) {
          return answerValue.multipleChoice.length > 0;
        }
        return Boolean(answerValue.multipleChoice);

      case "TEXT":
        return Boolean(answerValue.text && answerValue.text.trim().length > 0);

      default:
        return true;
    }
  }

  /**
   * Format answer value for display
   */
  static formatAnswerForDisplay(
    answerValue: AnswerValue,
    elementType: string
  ): string {
    switch (elementType) {
      case "MULTIPLE_CHOICE":
        if (Array.isArray(answerValue.multipleChoice)) {
          return answerValue.multipleChoice.join(", ");
        }
        return String(answerValue.multipleChoice || "");

      case "TEXT":
        return answerValue.text || "";

      default:
        return JSON.stringify(answerValue);
    }
  }

  /**
   * Calculate quiz completion percentage
   */
  static calculateCompletionPercentage(
    responses: Record<string, AnswerValue>,
    totalElements: number
  ): number {
    if (totalElements === 0) return 100;
    const answeredElements = Object.keys(responses).length;
    return Math.round((answeredElements / totalElements) * 100);
  }

  /**
   * Export quiz response data to JSON
   */
  static exportToJSON(
    responseData: QuizResponseData,
    quizTitle?: string
  ): string {
    const exportData = {
      quiz: {
        id: responseData.quizId,
        title: quizTitle || "Quiz sem título",
      },
      session: {
        id: responseData.sessionId,
        startedAt: responseData.startedAt,
        completedAt: responseData.completedAt,
        isCompleted: responseData.isCompleted,
      },
      responses: responseData.responses,
      summary: {
        totalResponses: Object.keys(responseData.responses).length,
        completionTime:
          responseData.completedAt && responseData.startedAt
            ? new Date(responseData.completedAt).getTime() -
              new Date(responseData.startedAt).getTime()
            : null,
      },
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Clean up old quiz responses from localStorage
   */
  static cleanupOldResponses(maxAgeInDays: number = 30): void {
    try {
      const storage = window.localStorage;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - maxAgeInDays);

      // Find and remove old quiz response entries
      Object.keys(storage).forEach((key) => {
        if (key.startsWith("quiz-response-storage")) {
          try {
            const data = JSON.parse(storage.getItem(key) || "{}");
            if (data.state?.currentResponse?.startedAt) {
              const responseDate = new Date(
                data.state.currentResponse.startedAt
              );
              if (responseDate < cutoffDate) {
                storage.removeItem(key);
              }
            }
          } catch {
            // If we can't parse the data, remove it
            storage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn("Failed to cleanup old responses:", error);
    }
  }

  /**
   * Generate a summary of all responses
   */
  static generateResponseSummary(
    responses: Record<string, AnswerValue>
  ): Array<{
    elementId: string;
    value: string;
    hasValue: boolean;
  }> {
    return Object.entries(responses).map(([elementId, answerValue]) => ({
      elementId,
      value: this.formatAnswerForDisplay(answerValue, "MULTIPLE_CHOICE"), // Default formatting
      hasValue: Boolean(answerValue),
    }));
  }
}

// Auto cleanup old responses on module load
if (typeof window !== "undefined") {
  QuizResponseUtils.cleanupOldResponses();
}
