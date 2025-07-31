"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Lead } from "./LeadsTable";

interface LeadsStatsProps {
  leads: Lead[];
}

export function LeadsStats({ leads }: LeadsStatsProps) {
  // Calcular estatísticas
  const totalLeads = leads.length;

  // Considera qualificado quem passou da etapa 3
  const progressStats = {
    step1: leads.filter((l) => l.lastStepCompleted >= 1).length,
    step2: leads.filter((l) => l.lastStepCompleted >= 2).length,
    step3: leads.filter((l) => l.lastStepCompleted >= 3).length,
    step4: leads.filter((l) => l.lastStepCompleted >= 4).length,
    step5: leads.filter((l) => l.lastStepCompleted >= 5).length,
  };

  const qualifiedLeads = leads.filter((l) => l.lastStepCompleted >= 3).length;
  const completedLeads = leads.filter(
    (l) => l.lastStepCompleted === l.totalSteps
  ).length;

  const conversionRate =
    totalLeads > 0 ? (completedLeads / totalLeads) * 100 : 0;

  const qualificationRate =
    totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;

  if (totalLeads === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhum dado disponível para análise.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Taxas de Conversão */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Taxas de Conversão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Taxa de Qualificação</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">
                  {qualificationRate.toFixed(1)}%
                </span>
              </div>
            </div>
            <Progress value={qualificationRate} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {qualifiedLeads} de {totalLeads} leads (etapa 3+)
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Taxa de Conversão</span>
              <div className="flex items-center gap-1">
                {conversionRate >= 20 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : conversionRate >= 10 ? (
                  <Minus className="h-4 w-4 text-yellow-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className="font-medium">
                  {conversionRate.toFixed(1)}%
                </span>
              </div>
            </div>
            <Progress value={conversionRate} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedLeads} de {totalLeads} leads completaram o funil
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Progresso por Etapa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Progresso por Etapa do Funil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((step) => {
              const count =
                progressStats[`step${step}` as keyof typeof progressStats];
              const percentage = (count / totalLeads) * 100;

              return (
                <div key={step} className="text-center space-y-2">
                  <div className="text-xs font-medium">Etapa {step}</div>
                  <div className="text-lg font-bold">{count}</div>
                  <div className="text-xs text-muted-foreground">
                    {percentage.toFixed(1)}%
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground">
              Funil de conversão mostrando quantos leads chegaram em cada etapa
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
