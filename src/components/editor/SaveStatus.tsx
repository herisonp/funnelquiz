"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useStorageQuota } from "@/hooks/useStorageQuota";
import { cn } from "@/lib/utils";

interface SaveStatusProps {
  className?: string;
}

export function SaveStatus({ className }: SaveStatusProps) {
  const { isSaving, lastSaved, saveManually, saveError } = useAutoSave();
  const { isNearLimit, isAtLimit, percentUsed } = useStorageQuota();
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Formata timestamp de último salvamento
  const formatLastSaved = (date: Date | null) => {
    if (!date) return "Nunca";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffSeconds < 60) {
      return "Agora mesmo";
    } else if (diffMinutes < 60) {
      return `${diffMinutes}min atrás`;
    } else {
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Anima sucesso quando salvamento é concluído
  useEffect(() => {
    if (!isSaving && lastSaved) {
      setShowSuccessAnimation(true);
      const timer = setTimeout(() => setShowSuccessAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSaved]);

  // Determina status visual
  const getStatusProps = () => {
    if (saveError) {
      return {
        icon: AlertCircle,
        color: "text-destructive",
        bgColor: "bg-destructive/10",
        message: "Erro ao salvar",
        tooltip: saveError,
      };
    }

    if (isSaving) {
      return {
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        message: "Salvando...",
        tooltip: "Salvamento em andamento",
      };
    }

    if (showSuccessAnimation) {
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        message: "Salvo",
        tooltip: `Último salvamento: ${formatLastSaved(lastSaved)}`,
      };
    }

    return {
      icon: Save,
      color: "text-muted-foreground",
      bgColor: "bg-muted/20",
      message: "Auto-save ativo",
      tooltip: `Último salvamento: ${formatLastSaved(lastSaved)}`,
    };
  };

  const statusProps = getStatusProps();
  const StatusIcon = statusProps.icon;

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-2", className)}>
        {/* Indicador de status */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="secondary"
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 transition-all duration-200",
                statusProps.bgColor,
                showSuccessAnimation && "scale-105"
              )}
            >
              <StatusIcon
                className={cn(
                  "h-3 w-3 transition-colors",
                  statusProps.color,
                  isSaving && "animate-spin"
                )}
              />
              <span className={cn("text-xs font-medium", statusProps.color)}>
                {statusProps.message}
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{statusProps.tooltip}</p>
          </TooltipContent>
        </Tooltip>

        {/* Botão de salvamento manual */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={saveManually}
              disabled={isSaving}
              className="h-7 w-7 p-0"
            >
              <Save className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Salvar agora (Ctrl+S)</p>
          </TooltipContent>
        </Tooltip>

        {/* Indicador de quota de storage */}
        {(isNearLimit || isAtLimit) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant={isAtLimit ? "destructive" : "secondary"}
                className="text-xs"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                {Math.round(percentUsed)}%
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isAtLimit
                  ? "Armazenamento quase cheio! Considere exportar dados."
                  : "Armazenamento próximo do limite."}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
