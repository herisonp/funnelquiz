"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineData {
  date: string;
  visitors: number;
  totalLeads: number;
  interactionRate: number;
  qualifiedLeads: number;
  completedFlows: number;
}

interface TimelineChartProps {
  data: TimelineData[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      name: string;
      color: string;
      dataKey: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.dataKey === "interactionRate"
                ? `${entry.value.toFixed(1)}%`
                : entry.value.toLocaleString("pt-BR")}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Temporal dos Leads</CardTitle>
        <p className="text-sm text-muted-foreground">
          Acompanhamento das métricas ao longo do tempo
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Visitantes"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="totalLeads"
              stroke="#10b981"
              strokeWidth={2}
              name="Leads Adquiridos"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="qualifiedLeads"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Leads Qualificados"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="completedFlows"
              stroke="#059669"
              strokeWidth={2}
              name="Fluxos Completos"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="interactionRate"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Taxa de Interação (%)"
              dot={{ r: 4 }}
              yAxisId="right"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
