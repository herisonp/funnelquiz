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
  id: string;
  order: number;
  step: string;
  visitors: number;
  completed: number;
  abandonmentRate: number;
}

interface LeadsFunnelChartProps {
  data: FunnelData[];
}

const chartConfig = {
  interactionRate: {
    label: "Taxa de Interação (%)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function LeadsFunnelChart({ data }: LeadsFunnelChartProps) {
  // Ordenar dados pela ordem das etapas e calcular taxa de interação
  const chartData = data
    .sort((a, b) => {
      return a.order - b.order;
    })
    .map((item) => {
      const interactionRate = (item.completed / item.visitors) * 100;
      return {
        id: item.id,
        step: item.step,
        stepName: item.step,
        interactionRate: Number(interactionRate.toFixed(1)),
        visitors: item.visitors,
        completed: item.completed,
      };
    });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Taxa de Interação por Etapa</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Percentual de usuários que interagem com cada etapa do funil
          </span>
          <span className="@[540px]/card:hidden">Taxa de interação</span>
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
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
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
                    if (name === "interactionRate") {
                      return [
                        <React.Fragment key="metrics">
                          <div className="space-y-1">
                            <div>Taxa de Interação: {value}%</div>
                            <div>
                              Visitantes:{" "}
                              {item.visitors.toLocaleString("pt-BR")}
                            </div>
                            <div>
                              Interações:{" "}
                              {item.completed.toLocaleString("pt-BR")}
                            </div>
                          </div>
                        </React.Fragment>,
                      ];
                    }
                    return null;
                  }}
                />
              }
            />
            <Bar
              dataKey="interactionRate"
              fill="var(--color-interactionRate)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
