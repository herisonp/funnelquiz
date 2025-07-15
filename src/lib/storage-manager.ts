import LZString from "lz-string";
import {
  SavedQuizData,
  savedQuizDataSchema,
  STORAGE_KEY,
  BACKUP_STORAGE_KEY,
} from "@/schemas/quiz-schema";

export interface StorageQuotaInfo {
  used: number;
  total: number;
  available: number;
  percentUsed: number;
}

export class StorageManager {
  private static instance: StorageManager;

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * Verifica se localStorage está disponível
   */
  public isStorageAvailable(): boolean {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Estima o uso de quota do localStorage
   */
  public getStorageQuota(): StorageQuotaInfo {
    if (!this.isStorageAvailable()) {
      return { used: 0, total: 0, available: 0, percentUsed: 0 };
    }

    let used = 0;
    const total = 5 * 1024 * 1024; // Estimativa conservadora de 5MB

    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }
    } catch {
      // Em caso de erro, retorna estimativa baseada apenas nas nossas chaves
      const ourData = localStorage.getItem(STORAGE_KEY) || "";
      const backupData = localStorage.getItem(BACKUP_STORAGE_KEY) || "";
      used =
        ourData.length +
        backupData.length +
        STORAGE_KEY.length +
        BACKUP_STORAGE_KEY.length;
    }

    const available = Math.max(0, total - used);
    const percentUsed = (used / total) * 100;

    return { used, total, available, percentUsed };
  }

  /**
   * Comprime dados usando LZ-String
   */
  private compressData(data: string): string {
    try {
      return LZString.compress(data) || data;
    } catch {
      return data;
    }
  }

  /**
   * Descomprime dados usando LZ-String
   */
  private decompressData(data: string): string {
    try {
      const decompressed = LZString.decompress(data);
      return decompressed || data;
    } catch {
      return data;
    }
  }

  /**
   * Salva dados no localStorage com compressão
   */
  public saveData(key: string, data: Record<string, unknown>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isStorageAvailable()) {
        reject(new Error("localStorage não está disponível"));
        return;
      }

      try {
        const jsonString = JSON.stringify(data);
        const compressedData = this.compressData(jsonString);

        // Verifica quota antes de salvar
        const quota = this.getStorageQuota();
        const dataSize = compressedData.length + key.length;

        if (dataSize > quota.available) {
          // Tenta fazer limpeza automática
          this.cleanupOldBackups();

          const updatedQuota = this.getStorageQuota();
          if (dataSize > updatedQuota.available) {
            reject(new Error("Quota de armazenamento insuficiente"));
            return;
          }
        }

        // Cria backup antes de salvar
        const existingData = localStorage.getItem(key);
        if (existingData) {
          localStorage.setItem(BACKUP_STORAGE_KEY, existingData);
        }

        localStorage.setItem(key, compressedData);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Carrega dados do localStorage com descompressão
   */
  public loadData(key: string): Promise<SavedQuizData | null> {
    return new Promise((resolve) => {
      if (!this.isStorageAvailable()) {
        resolve(null);
        return;
      }

      try {
        const compressedData = localStorage.getItem(key);

        if (!compressedData) {
          resolve(null);
          return;
        }

        const jsonString = this.decompressData(compressedData);
        const data = JSON.parse(jsonString);

        // Valida dados com schema Zod
        const validatedData = savedQuizDataSchema.parse(data);
        resolve(validatedData);
      } catch (error) {
        console.warn("Erro ao carregar dados do localStorage:", error);

        // Tenta carregar backup
        try {
          const backupData = localStorage.getItem(BACKUP_STORAGE_KEY);
          if (backupData) {
            const jsonString = this.decompressData(backupData);
            const data = JSON.parse(jsonString);
            const validatedData = savedQuizDataSchema.parse(data);

            console.log("Dados recuperados do backup");
            resolve(validatedData);
            return;
          }
        } catch (backupError) {
          console.warn("Erro ao carregar backup:", backupError);
        }

        resolve(null);
      }
    });
  }

  /**
   * Remove dados do localStorage
   */
  public removeData(key: string): void {
    if (this.isStorageAvailable()) {
      localStorage.removeItem(key);
    }
  }

  /**
   * Limpa backups antigos para economizar espaço
   */
  public cleanupOldBackups(): void {
    if (!this.isStorageAvailable()) return;

    try {
      // Remove backups antigos (mantém apenas o último)
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          key.startsWith("funnelquiz-backup-") &&
          key !== BACKUP_STORAGE_KEY
        ) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn("Erro ao limpar backups:", error);
    }
  }

  /**
   * Exporta dados para download
   */
  public exportData(data: SavedQuizData, filename?: string): void {
    try {
      const exportData = {
        version: data.version,
        exportedAt: new Date().toISOString(),
        quiz: data.quiz,
        metadata: {
          appVersion: "1.0.0",
          userAgent: navigator.userAgent,
        },
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download =
        filename ||
        `quiz-${data.quiz.title}-${
          new Date().toISOString().split("T")[0]
        }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error("Erro ao exportar dados: " + error);
    }
  }
}
