"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LeadsMetricsCardsProps {
  metrics: {
    visitors: number;
    totalLeads: number;
    interactionRate: number;
    qualifiedLeads: number;
    completedFlows: number;
  };
}

export function LeadsMetricsCards({ metrics }: LeadsMetricsCardsProps) {
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  // Calcular taxas de crescimento simuladas (em um app real, viria dos dados históricos)
  const growthRates = {
    visitors: 12.5,
    totalLeads: 8.3,
    interactionRate: -2.1,
    qualifiedLeads: 15.7,
    completedFlows: 22.4,
  };

  const metricsData = [
    {
      title: "Total de Visitantes",
      value: metrics.visitors.toLocaleString("pt-BR"),
      growth: growthRates.visitors,
      description: "Acessaram o funil",
      footerText: "Aumento consistente este mês",
      footerSubtext: "Tráfego orgânico em alta",
    },
    {
      title: "Leads Adquiridos",
      value: metrics.totalLeads.toLocaleString("pt-BR"),
      growth: growthRates.totalLeads,
      description: "Iniciaram interação",
      footerText: "Performance acima da meta",
      footerSubtext: "Taxa de captura melhorou",
    },
    {
      title: "Taxa de Interação",
      value: formatPercentage(metrics.interactionRate),
      growth: growthRates.interactionRate,
      description: "Visitantes que interagiram",
      footerText: "Leve queda neste período",
      footerSubtext: "Necessita otimização",
    },
    {
      title: "Leads Qualificados",
      value: metrics.qualifiedLeads.toLocaleString("pt-BR"),
      growth: growthRates.qualifiedLeads,
      description: "Passaram de 50% do quiz",
      footerText: "Forte crescimento de qualidade",
      footerSubtext: "Segmentação mais eficaz",
    },
    {
      title: "Fluxos Completos",
      value: metrics.completedFlows.toLocaleString("pt-BR"),
      growth: growthRates.completedFlows,
      description: "Finalizaram o funil",
      footerText: "Excelente taxa de conversão",
      footerSubtext: "Supera projeções de crescimento",
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      {metricsData.map((metric) => {
        const isPositiveGrowth = metric.growth > 0;
        const TrendIcon = isPositiveGrowth ? IconTrendingUp : IconTrendingDown;

        return (
          <Card key={metric.title} className="@container/card">
            <CardHeader>
              <CardDescription>{metric.description}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {metric.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendIcon />
                  {isPositiveGrowth ? "+" : ""}
                  {metric.growth.toFixed(1)}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {metric.footerText} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                {metric.footerSubtext}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
