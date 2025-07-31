"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface FunnelData {
  step: string;
  visitors: number;
  completed: number;
  abandonmentRate: number;
}

interface LeadsFunnelChartProps {
  data: FunnelData[];
}

const chartConfig = {
  visitors: {
    label: "Visitantes",
    color: "hsl(var(--primary))",
  },
  completed: {
    label: "Convertidos",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function LeadsFunnelChart({ data }: LeadsFunnelChartProps) {
  // Transformar dados para mostrar a conversão vs abandono
  const chartData = data.map((item, index) => ({
    step: `Etapa ${index + 1}`,
    stepName: item.step.replace(/^Etapa \d+: /, ""),
    visitors: item.visitors,
    completed: item.completed,
    abandoned: item.visitors - item.completed,
    conversionRate: ((item.completed / item.visitors) * 100).toFixed(1),
  }));

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Análise do Funil de Conversão</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Visitantes vs convertidos em cada etapa do processo
          </span>
          <span className="@[540px]/card:hidden">Funil de conversão</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="stepName"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-45}
              textAnchor="end"
              height={60}
              tickFormatter={(value) => {
                // Truncar nomes muito longos
                return value.length > 15
                  ? `${value.substring(0, 15)}...`
                  : value;
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toLocaleString("pt-BR")}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value, payload) => {
                    const item = payload?.[0]?.payload;
                    return item ? item.step : value;
                  }}
                  formatter={(value, name, props) => {
                    const item = props.payload;
                    if (name === "visitors") {
                      return [
                        <>
                          <div className="space-y-1">
                            <div>
                              Visitantes: {value.toLocaleString("pt-BR")}
                            </div>
                            <div>
                              Convertidos:{" "}
                              {item.completed.toLocaleString("pt-BR")}
                            </div>
                            <div>Taxa de Conversão: {item.conversionRate}%</div>
                          </div>
                        </>,
                        "Métricas",
                      ];
                    }
                    return null;
                  }}
                />
              }
            />
            <Bar
              dataKey="visitors"
              fill="var(--color-visitors)"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.6}
            />
            <Bar
              dataKey="completed"
              fill="var(--color-completed)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        {/* Resumo das métricas */}
        <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-primary/60"></div>
              <span className="font-medium">Total de Visitantes</span>
            </div>
            <div className="text-muted-foreground">
              Usuários que acessaram cada etapa
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-primary"></div>
              <span className="font-medium">Conversões</span>
            </div>
            <div className="text-muted-foreground">
              Usuários que completaram a etapa
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-muted"></div>
              <span className="font-medium">Performance</span>
            </div>
            <div className="text-muted-foreground">
              Taxa de conversão por etapa
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
