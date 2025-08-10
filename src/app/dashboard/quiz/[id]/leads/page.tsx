"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { LeadsMetricsCards } from "@/components/leads/LeadsMetricsCards";
import { LeadsFunnelChart } from "@/components/leads/LeadsFunnelChart";
import { LeadsTimelineChart } from "@/components/leads/LeadsTimelineChart";
import { AdvancedFilters } from "@/components/leads/AdvancedFilters";
import { LeadsTable, Lead } from "@/components/leads/LeadsTable";
import { LeadDetailsModal } from "@/components/leads/LeadDetailsModal";
import { useAdvancedLeadsData } from "@/hooks/useAdvancedLeadsData";

// Dados mockados para os gráficos
const mockFunnelData = [
  {
    id: "step-0",
    order: 0,
    step: "Etapa 0: Página Inicial",
    visitors: 1000,
    completed: 800,
    abandonmentRate: 20,
  },
  {
    id: "step-1",
    order: 1,
    step: "Etapa 1: Desafio",
    visitors: 800,
    completed: 650,
    abandonmentRate: 18.7,
  },
  {
    id: "step-2",
    order: 2,
    step: "Etapa 2: Empresa",
    visitors: 650,
    completed: 520,
    abandonmentRate: 20,
  },
  {
    id: "step-3",
    order: 3,
    step: "Etapa 3: Orçamento",
    visitors: 520,
    completed: 350,
    abandonmentRate: 32.7,
  },
  {
    id: "step-4",
    order: 4,
    step: "Etapa 4: Timeline",
    visitors: 350,
    completed: 180,
    abandonmentRate: 48.6,
  },
  {
    id: "step-5",
    order: 5,
    step: "Etapa 5: Contato",
    visitors: 180,
    completed: 120,
    abandonmentRate: 33.3,
  },
];

const mockTimelineData = [
  {
    date: "20/07",
    visitors: 120,
    totalLeads: 85,
    interactionRate: 70.8,
    qualifiedLeads: 58,
    completedFlows: 24,
  },
  {
    date: "21/07",
    visitors: 150,
    totalLeads: 102,
    interactionRate: 68.0,
    qualifiedLeads: 72,
    completedFlows: 31,
  },
  {
    date: "22/07",
    visitors: 180,
    totalLeads: 125,
    interactionRate: 69.4,
    qualifiedLeads: 89,
    completedFlows: 38,
  },
  {
    date: "23/07",
    visitors: 160,
    totalLeads: 115,
    interactionRate: 71.9,
    qualifiedLeads: 82,
    completedFlows: 35,
  },
  {
    date: "24/07",
    visitors: 200,
    totalLeads: 145,
    interactionRate: 72.5,
    qualifiedLeads: 104,
    completedFlows: 42,
  },
  {
    date: "25/07",
    visitors: 220,
    totalLeads: 158,
    interactionRate: 71.8,
    qualifiedLeads: 118,
    completedFlows: 48,
  },
  {
    date: "26/07",
    visitors: 190,
    totalLeads: 138,
    interactionRate: 72.6,
    qualifiedLeads: 98,
    completedFlows: 41,
  },
];

export default function LeadsPage() {
  const params = useParams();
  const quizId = params?.id as string;

  const {
    filteredLeads,
    filters,
    setFilters,
    metrics,
    exportToCSV,
    resetData,
    leads,
  } = useAdvancedLeadsData(quizId);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="container mx-auto flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Cabeçalho */}
          <div className="px-4 lg:px-6">
            <h1 className="text-3xl font-bold">Leads do Quiz</h1>
            <p className="text-muted-foreground mt-2">
              Acompanhe e analise os leads capturados pelo seu funil de
              conversão
            </p>
          </div>

          {/* Filtros avançados */}
          <div className="px-4 lg:px-6">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              onExportCSV={exportToCSV}
              onResetData={resetData}
              totalResults={leads.length}
              filteredResults={filteredLeads.length}
            />
          </div>

          {/* Métricas principais */}
          <LeadsMetricsCards metrics={metrics} />

          {/* Gráficos */}
          <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 lg:grid-cols-2">
            <LeadsFunnelChart data={mockFunnelData} />
            <LeadsTimelineChart data={mockTimelineData} />
          </div>

          {/* Tabela de leads */}
          <div className="px-4 lg:px-6">
            <LeadsTable
              leads={filteredLeads}
              onViewDetails={handleViewDetails}
            />
          </div>

          {/* Modal de detalhes */}
          <LeadDetailsModal
            lead={selectedLead}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedLead(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}
