"use client";

import { useState, useMemo } from "react";
import { isWithinInterval } from "date-fns";
import { Lead } from "@/components/leads/LeadsTable";

// Dados mockados - em produção viriam de uma API
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 99999-9999",
    score: 85,
    status: "qualified",
    createdAt: new Date("2025-07-28T10:30:00"),
    lastStepCompleted: 4,
    totalSteps: 5,
    answers: {
      "Qual é o seu principal desafio?": "Gerar mais leads",
      "Qual o tamanho da sua empresa?": "10-50 funcionários",
      "Orçamento mensal para marketing?": "R$ 5.000 - R$ 10.000",
    },
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao.santos@empresa.com",
    phone: "(11) 88888-8888",
    score: 65,
    status: "qualified",
    createdAt: new Date("2025-07-27T15:45:00"),
    lastStepCompleted: 3,
    totalSteps: 5,
    answers: {
      "Qual é o seu principal desafio?": "Aumentar conversões",
      "Qual o tamanho da sua empresa?": "1-10 funcionários",
    },
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    score: 95,
    status: "completed",
    createdAt: new Date("2025-07-26T09:15:00"),
    lastStepCompleted: 5,
    totalSteps: 5,
    answers: {
      "Qual é o seu principal desafio?": "Automatizar processos",
      "Qual o tamanho da sua empresa?": "50+ funcionários",
      "Orçamento mensal para marketing?": "R$ 20.000+",
      "Quando pretende implementar?": "Nos próximos 3 meses",
      "Qual é a sua função?": "CEO/Diretor",
    },
  },
  {
    id: "4",
    name: "Pedro Oliveira",
    email: "pedro@startup.com",
    score: 35,
    status: "unqualified",
    createdAt: new Date("2025-07-25T14:20:00"),
    lastStepCompleted: 2,
    totalSteps: 5,
    answers: {
      "Qual é o seu principal desafio?": "Reduzir custos",
      "Qual o tamanho da sua empresa?": "Apenas eu",
    },
  },
  {
    id: "5",
    name: "Carla Mendes",
    email: "carla.mendes@email.com",
    phone: "(11) 77777-7777",
    score: 78,
    status: "qualified",
    createdAt: new Date("2025-07-24T11:30:00"),
    lastStepCompleted: 4,
    totalSteps: 5,
    answers: {
      "Qual é o seu principal desafio?": "Melhorar ROI",
      "Qual o tamanho da sua empresa?": "10-50 funcionários",
      "Orçamento mensal para marketing?": "R$ 10.000 - R$ 20.000",
    },
  },
];

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface UseLeadsDataReturn {
  leads: Lead[];
  filteredLeads: Lead[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  metrics: {
    visitors: number;
    totalLeads: number;
    interactionRate: number;
    qualifiedLeads: number;
    completedFlows: number;
  };
  exportToCSV: () => void;
  resetData: () => Promise<void>;
}

export function useLeadsData(quizId?: string): UseLeadsDataReturn {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  // Em produção, aqui seria uma chamada para a API usando o quizId
  const leads = mockLeads;

  // Aplicar filtros
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Filtro de busca
      const matchesSearch =
        searchTerm === "" ||
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.phone && lead.phone.includes(searchTerm));

      // Filtro de data
      const matchesDate =
        !dateRange.from ||
        !dateRange.to ||
        isWithinInterval(lead.createdAt, {
          start: dateRange.from,
          end: dateRange.to,
        });

      return matchesSearch && matchesDate;
    });
  }, [leads, searchTerm, dateRange]);

  // Calcular métricas
  const metrics = useMemo(() => {
    const visitors = 1000; // Em produção, viria da API
    const totalLeads = filteredLeads.length;
    const qualifiedLeads = filteredLeads.filter(
      (lead) => lead.status === "qualified" || lead.status === "completed"
    ).length;
    const completedFlows = filteredLeads.filter(
      (lead) => lead.status === "completed"
    ).length;
    const interactionRate = visitors > 0 ? (totalLeads / visitors) * 100 : 0;

    return {
      visitors,
      totalLeads,
      interactionRate,
      qualifiedLeads,
      completedFlows,
    };
  }, [filteredLeads]);

  const exportToCSV = () => {
    const csvData = filteredLeads.map((lead) => ({
      Nome: lead.name,
      Email: lead.email,
      Telefone: lead.phone || "",
      Status:
        lead.status === "qualified"
          ? "Qualificado"
          : lead.status === "completed"
          ? "Completo"
          : "Não Qualificado",
      Score: lead.score,
      Progresso: `${lead.lastStepCompleted}/${lead.totalSteps}`,
      "Data de Captura": lead.createdAt.toLocaleDateString("pt-BR"),
      Respostas: Object.entries(lead.answers)
        .map(([q, a]) => `${q}: ${Array.isArray(a) ? a.join(", ") : a}`)
        .join(" | "),
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) =>
        Object.values(row)
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leads-${quizId || "quiz"}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  const resetData = async () => {
    if (
      window.confirm(
        "Tem certeza que deseja resetar todos os dados de leads? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        // Em produção, aqui seria uma chamada para a API
        // await api.resetQuizLeads(quizId);
        console.log("Dados resetados para o quiz:", quizId);
        alert("Dados resetados com sucesso!");

        // Recarregar os dados
        // refetch();
      } catch (error) {
        console.error("Erro ao resetar dados:", error);
        alert("Erro ao resetar os dados. Tente novamente.");
      }
    }
  };

  return {
    leads,
    filteredLeads,
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    metrics,
    exportToCSV,
    resetData,
  };
}
