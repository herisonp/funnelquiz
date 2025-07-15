import { useState, useEffect, useCallback } from "react";
import { StorageManager, StorageQuotaInfo } from "@/lib/storage-manager";

interface UseStorageQuotaReturn extends StorageQuotaInfo {
  isNearLimit: boolean;
  isAtLimit: boolean;
  refreshQuota: () => void;
}

export function useStorageQuota(): UseStorageQuotaReturn {
  const [quotaInfo, setQuotaInfo] = useState<StorageQuotaInfo>({
    used: 0,
    total: 0,
    available: 0,
    percentUsed: 0,
  });

  const storageManager = StorageManager.getInstance();

  const refreshQuota = useCallback(() => {
    const info = storageManager.getStorageQuota();
    setQuotaInfo(info);
  }, [storageManager]);

  useEffect(() => {
    refreshQuota();

    // Atualiza quota quando há mudanças no localStorage
    const handleStorageChange = () => {
      refreshQuota();
    };

    // Escuta eventos de salvamento
    const handleQuizSaved = () => {
      refreshQuota();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("quiz-saved", handleQuizSaved);

    // Atualiza periodicamente
    const interval = setInterval(refreshQuota, 30000); // a cada 30 segundos

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("quiz-saved", handleQuizSaved);
      clearInterval(interval);
    };
  }, [refreshQuota]);

  const isNearLimit = quotaInfo.percentUsed > 80;
  const isAtLimit = quotaInfo.percentUsed > 95;

  return {
    ...quotaInfo,
    isNearLimit,
    isAtLimit,
    refreshQuota,
  };
}
