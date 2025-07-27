import { useEffect, useState } from "react";

/**
 * Hook que retorna true apenas após a hidratação do cliente
 * Útil para evitar problemas de hidratação com SSR
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
