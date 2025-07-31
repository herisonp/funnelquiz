"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  PieChart,
  Table as TableIcon,
  Download,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LeadsMetrics } from "./LeadsMetrics";
import { FunnelChart } from "./FunnelChart";
import { TimelineChart } from "./TimelineChart";
import { LeadsTable, Lead } from "./LeadsTable";
import { LeadsStats } from "./LeadsStats";

type ViewType = "overview" | "analytics" | "leads" | "stats";

interface LeadsViewSwitcherProps {
  leads: Lead[];
  metrics: {
    visitors: number;
    totalLeads: number;
    interactionRate: number;
    qualifiedLeads: number;
    completedFlows: number;
  };
  funnelData: Array<{
    step: string;
    visitors: number;
    completed: number;
    abandonmentRate: number;
  }>;
  timelineData: Array<{
    date: string;
    visitors: number;
    totalLeads: number;
    interactionRate: number;
    qualifiedLeads: number;
    completedFlows: number;
  }>;
  onViewDetails: (lead: Lead) => void;
}

export function LeadsViewSwitcher({
  leads,
  metrics,
  funnelData,
  timelineData,
  onViewDetails,
}: LeadsViewSwitcherProps) {
  const [activeView, setActiveView] = useState<ViewType>("overview");

  const views = [
    {
      id: "overview" as ViewType,
      label: "Visão Geral",
      icon: TrendingUp,
      description: "Métricas principais e resumo",
    },
    {
      id: "analytics" as ViewType,
      label: "Analytics",
      icon: BarChart3,
      description: "Gráficos e análises detalhadas",
    },
    {
      id: "leads" as ViewType,
      label: "Lista de Leads",
      icon: Users,
      description: "Tabela com todos os leads",
    },
    {
      id: "stats" as ViewType,
      label: "Estatísticas",
      icon: PieChart,
      description: "Distribuições e conversões",
    },
  ];

  const renderView = () => {
    switch (activeView) {
      case "overview":
        return (
          <div className="space-y-6">
            <LeadsMetrics metrics={metrics} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FunnelChart data={funnelData} />
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Resumo dos Leads</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {leads.filter((l) => l.lastStepCompleted >= 3).length}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Leads Qualificados
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {
                            leads.filter(
                              (l) => l.lastStepCompleted === l.totalSteps
                            ).length
                          }
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Conversões
                        </p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setActiveView("leads")}
                      >
                        <TableIcon className="h-4 w-4 mr-2" />
                        Ver Todos os Leads
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FunnelChart data={funnelData} />
              <TimelineChart data={timelineData} />
            </div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Insights dos Dados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {(
                        (metrics.qualifiedLeads / metrics.totalLeads) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <p className="text-sm text-blue-700">
                      Taxa de Qualificação
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(
                        leads.reduce(
                          (sum, lead) => sum + lead.lastStepCompleted,
                          0
                        ) / leads.length
                      )}
                    </div>
                    <p className="text-sm text-purple-700">Etapa Média</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "leads":
        return (
          <div className="space-y-6">
            <LeadsTable leads={leads} onViewDetails={onViewDetails} />
          </div>
        );

      case "stats":
        return (
          <div className="space-y-6">
            <LeadsStats leads={leads} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navegação de abas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <Button
                  key={view.id}
                  variant={activeView === view.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveView(view.id)}
                  className={cn(
                    "flex items-center gap-2",
                    activeView === view.id &&
                      "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {view.label}
                </Button>
              );
            })}

            {/* Botão de download */}
            <div className="ml-auto">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Descrição da aba ativa */}
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-muted-foreground">
              {views.find((v) => v.id === activeView)?.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo da aba ativa */}
      {renderView()}
    </div>
  );
}
