"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  TrendingUp,
  Target,
  CheckCircle,
} from "lucide-react";

interface LeadsMetricsProps {
  metrics: {
    visitors: number;
    totalLeads: number;
    interactionRate: number;
    qualifiedLeads: number;
    completedFlows: number;
  };
}

export function LeadsMetrics({ metrics }: LeadsMetricsProps) {
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const metricsData = [
    {
      title: "Visitantes",
      value: metrics.visitors.toLocaleString("pt-BR"),
      icon: Users,
      description: "Acessaram o funil",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Leads Adquiridos",
      value: metrics.totalLeads.toLocaleString("pt-BR"),
      icon: UserCheck,
      description: "Iniciaram interação",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Taxa de Interação",
      value: formatPercentage(metrics.interactionRate),
      icon: TrendingUp,
      description: "Visitantes vs Leads",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Leads Qualificados",
      value: metrics.qualifiedLeads.toLocaleString("pt-BR"),
      icon: Target,
      description: "Passaram de 50% do quiz",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Fluxos Completos",
      value: metrics.completedFlows.toLocaleString("pt-BR"),
      icon: CheckCircle,
      description: "Finalizaram o funil",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metricsData.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
