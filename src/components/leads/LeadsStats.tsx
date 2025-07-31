"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Lead } from "./LeadsTable";

interface LeadsStatsProps {
  leads: Lead[];
}

export function LeadsStats({ leads }: LeadsStatsProps) {
  // Calcular estatísticas
  const totalLeads = leads.length;

  const statusStats = {
    qualified: leads.filter((l) => l.status === "qualified").length,
    completed: leads.filter((l) => l.status === "completed").length,
    unqualified: leads.filter((l) => l.status === "unqualified").length,
  };

  const scoreRanges = {
    high: leads.filter((l) => l.score >= 80).length,
    medium: leads.filter((l) => l.score >= 50 && l.score < 80).length,
    low: leads.filter((l) => l.score < 50).length,
  };

  const progressStats = {
    step1: leads.filter((l) => l.lastStepCompleted >= 1).length,
    step2: leads.filter((l) => l.lastStepCompleted >= 2).length,
    step3: leads.filter((l) => l.lastStepCompleted >= 3).length,
    step4: leads.filter((l) => l.lastStepCompleted >= 4).length,
    step5: leads.filter((l) => l.lastStepCompleted >= 5).length,
  };

  const avgScore =
    totalLeads > 0
      ? Math.round(
          leads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads
        )
      : 0;

  const conversionRate =
    totalLeads > 0 ? (statusStats.completed / totalLeads) * 100 : 0;

  const qualificationRate =
    totalLeads > 0
      ? ((statusStats.qualified + statusStats.completed) / totalLeads) * 100
      : 0;

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Status dos Leads */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status dos Leads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Completos</span>
              <Badge variant="default">{statusStats.completed}</Badge>
            </div>
            <Progress
              value={(statusStats.completed / totalLeads) * 100}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Qualificados</span>
              <Badge variant="secondary">{statusStats.qualified}</Badge>
            </div>
            <Progress
              value={(statusStats.qualified / totalLeads) * 100}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Não Qualificados</span>
              <Badge variant="outline">{statusStats.unqualified}</Badge>
            </div>
            <Progress
              value={(statusStats.unqualified / totalLeads) * 100}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Distribuição de Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribuição de Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{avgScore}</div>
            <p className="text-sm text-muted-foreground">Score Médio</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Alto (80+)</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{scoreRanges.high}</span>
                <div className="w-12 h-2 bg-green-500 rounded"></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Médio (50-79)</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {scoreRanges.medium}
                </span>
                <div className="w-12 h-2 bg-yellow-500 rounded"></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Baixo (&lt;50)</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{scoreRanges.low}</span>
                <div className="w-12 h-2 bg-red-500 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {statusStats.completed} de {totalLeads} leads completaram o funil
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Progresso por Etapa */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg">
            Progresso por Etapa do Funil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((step) => {
              const count =
                progressStats[`step${step}` as keyof typeof progressStats];
              const percentage = (count / totalLeads) * 100;

              return (
                <div key={step} className="text-center space-y-2">
                  <div className="text-sm font-medium">Etapa {step}</div>
                  <div className="text-2xl font-bold">{count}</div>
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
