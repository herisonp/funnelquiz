"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
// Removidos imports de Select e ToggleGroup

interface TimelineData {
  date: string;
  visitors: number;
  totalLeads: number;
  interactionRate: number;
  qualifiedLeads: number;
  completedFlows: number;
}

interface LeadsTimelineChartProps {
  data: TimelineData[];
}

const chartConfig = {
  leads: {
    label: "Leads",
  },
  visitors: {
    label: "Visitantes",
    color: "hsl(var(--primary))",
  },
  totalLeads: {
    label: "Leads Adquiridos",
    color: "hsl(var(--primary))",
  },
  qualifiedLeads: {
    label: "Leads Qualificados",
    color: "hsl(var(--primary))",
  },
  interactionRate: {
    label: "Taxa de Interação (%)",
    color: "hsl(var(--primary))",
  },
  completedFlows: {
    label: "Fluxos Completos",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function LeadsTimelineChart({ data }: LeadsTimelineChartProps) {
  // Sempre exibir todas as métricas
  const selectedMetrics = [
    "visitors",
    "totalLeads",
    "qualifiedLeads",
    "interactionRate",
    "completedFlows",
  ];

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Evolução de Métricas</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Acompanhamento de visitantes, interações e leads ao longo do tempo
          </span>
          <span className="@[540px]/card:hidden">Evolução temporal</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              {selectedMetrics.map((metric) => (
                <linearGradient
                  key={metric}
                  id={`fill${metric}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${metric})`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${metric})`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const [day, month] = value.split("/");
                return `${day}/${month}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return `${value}`;
                  }}
                  indicator="dot"
                  formatter={(value, name) => {
                    if (name === "interactionRate") {
                      return [
                        `${value}% `,
                        chartConfig[name as keyof typeof chartConfig]?.label,
                      ];
                    }
                    return [
                      `${value} `,
                      chartConfig[name as keyof typeof chartConfig]?.label,
                    ];
                  }}
                />
              }
            />
            {selectedMetrics.map((metric) => (
              <Area
                key={metric}
                dataKey={metric}
                type="natural"
                fill={`url(#fill${metric})`}
                stroke={`var(--color-${metric})`}
                stackId={metric === "interactionRate" ? "rate" : "a"}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
