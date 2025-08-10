"use client";

import { useState, useMemo } from "react";
import { isWithinInterval } from "date-fns";
import { Lead } from "@/components/leads/LeadsTable";
import { FilterValue } from "@/components/leads/AdvancedFilters";

// Dados mockados - em produção viriam de uma API
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 99999-9999",
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

interface UseAdvancedLeadsDataReturn {
  leads: Lead[];
  filteredLeads: Lead[];
  filters: FilterValue[];
  setFilters: (filters: FilterValue[]) => void;
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

export function useAdvancedLeadsData(
  quizId?: string
): UseAdvancedLeadsDataReturn {
  const [filters, setFilters] = useState<FilterValue[]>([]);

  // Em produção, aqui seria uma chamada para a API usando o quizId
  const leads = mockLeads;

  // Aplicar filtros
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      return filters.every((filter) => {
        switch (filter.type) {
          case "dateRange": {
            const dateRange = filter.value as {
              from: Date | undefined;
              to: Date | undefined;
            };
            if (!dateRange.from || !dateRange.to) return true;
            return isWithinInterval(lead.createdAt, {
              start: dateRange.from,
              end: dateRange.to,
            });
          }

          case "stepResponse": {
            const stepFilter = filter.value as {
              step: string;
              responseText: string;
            };
            const stepIndex = parseInt(stepFilter.step);

            // Mapear stepIndex para pergunta correspondente
            const stepQuestions = [
              "Qual é o seu principal desafio?",
              "Qual o tamanho da sua empresa?",
              "Orçamento mensal para marketing?",
              "Quando pretende implementar?",
              "Qual é a sua função?",
            ];

            const questionKey = stepQuestions[stepIndex];
            const answer = lead.answers[questionKey];

            if (!answer) return false;

            const answerText = Array.isArray(answer)
              ? answer.join(" ")
              : answer;
            return answerText
              .toLowerCase()
              .includes(stepFilter.responseText.toLowerCase());
          }

          case "userData": {
            const userFilter = filter.value as {
              field: string;
              searchText: string;
            };
            const searchText = userFilter.searchText.toLowerCase();

            switch (userFilter.field) {
              case "name":
                return lead.name.toLowerCase().includes(searchText);
              case "email":
                return lead.email.toLowerCase().includes(searchText);
              case "phone":
                return lead.phone?.toLowerCase().includes(searchText) || false;
              case "all":
                return (
                  lead.name.toLowerCase().includes(searchText) ||
                  lead.email.toLowerCase().includes(searchText) ||
                  (lead.phone && lead.phone.toLowerCase().includes(searchText))
                );
              default:
                return true;
            }
          }

          default:
            return true;
        }
      });
    });
  }, [leads, filters]);

  // Calcular métricas baseadas nos dados filtrados
  const metrics = useMemo(() => {
    const visitors = 1000; // Em produção, viria da API
    const totalLeads = filteredLeads.length;
    const qualifiedLeads = filteredLeads.filter(
      (lead) => lead.lastStepCompleted >= 3 // Considera qualificado quem passou da etapa 3
    ).length;
    const completedFlows = filteredLeads.filter(
      (lead) => lead.lastStepCompleted === lead.totalSteps
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
      Progresso: `${lead.lastStepCompleted}/${lead.totalSteps}`,
      "Progresso %": `${Math.round(
        (lead.lastStepCompleted / lead.totalSteps) * 100
      )}%`,
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
    filters,
    setFilters,
    metrics,
    exportToCSV,
    resetData,
  };
}
