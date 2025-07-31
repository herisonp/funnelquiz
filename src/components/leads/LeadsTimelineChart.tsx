"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  totalLeads: {
    label: "Leads Adquiridos",
    color: "var(--primary)",
  },
  qualifiedLeads: {
    label: "Leads Qualificados",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function LeadsTimelineChart({ data }: LeadsTimelineChartProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("7d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = React.useMemo(() => {
    let daysToShow = 7;
    if (timeRange === "30d") {
      daysToShow = 30;
    } else if (timeRange === "90d") {
      daysToShow = 90;
    }

    return data.slice(-daysToShow);
  }, [data, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Evolução de Leads</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Acompanhamento de leads adquiridos e qualificados
          </span>
          <span className="@[540px]/card:hidden">Evolução temporal</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="7d">Últimos 7 dias</ToggleGroupItem>
            <ToggleGroupItem value="30d">Últimos 30 dias</ToggleGroupItem>
            <ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Selecionar período"
            >
              <SelectValue placeholder="Últimos 7 dias" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                Últimos 7 dias
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Últimos 30 dias
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                Últimos 3 meses
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTotalLeads" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-totalLeads)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-totalLeads)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillQualifiedLeads"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-qualifiedLeads)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-qualifiedLeads)"
                  stopOpacity={0.1}
                />
              </linearGradient>
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
                />
              }
            />
            <Area
              dataKey="qualifiedLeads"
              type="natural"
              fill="url(#fillQualifiedLeads)"
              stroke="var(--color-qualifiedLeads)"
              stackId="a"
            />
            <Area
              dataKey="totalLeads"
              type="natural"
              fill="url(#fillTotalLeads)"
              stroke="var(--color-totalLeads)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
