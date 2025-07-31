"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { LeadsMetrics } from "@/components/leads/LeadsMetrics";
import { FunnelChart } from "@/components/leads/FunnelChart";
import { TimelineChart } from "@/components/leads/TimelineChart";
import { LeadsFilters } from "@/components/leads/LeadsFilters";
import { LeadsTable, Lead } from "@/components/leads/LeadsTable";
import { LeadDetailsModal } from "@/components/leads/LeadDetailsModal";
import { useLeadsData } from "@/hooks/useLeadsData";

// Dados mockados para os gráficos
const mockFunnelData = [
  {
    step: "Página Inicial",
    visitors: 1000,
    completed: 800,
    abandonmentRate: 20,
  },
  {
    step: "Etapa 1: Desafio",
    visitors: 800,
    completed: 650,
    abandonmentRate: 18.7,
  },
  {
    step: "Etapa 2: Empresa",
    visitors: 650,
    completed: 520,
    abandonmentRate: 20,
  },
  {
    step: "Etapa 3: Orçamento",
    visitors: 520,
    completed: 350,
    abandonmentRate: 32.7,
  },
  {
    step: "Etapa 4: Timeline",
    visitors: 350,
    completed: 180,
    abandonmentRate: 48.6,
  },
  {
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
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    metrics,
    exportToCSV,
    resetData,
    leads,
  } = useLeadsData(quizId);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Leads do Quiz</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe e analise os leads capturados pelo seu funil de conversão
          </p>
        </div>

        {/* Métricas principais */}
        <LeadsMetrics metrics={metrics} />

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FunnelChart data={mockFunnelData} />
          <TimelineChart data={mockTimelineData} />
        </div>

        {/* Filtros e tabela de leads */}
        <div className="space-y-4">
          <LeadsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onExportCSV={exportToCSV}
            onResetData={resetData}
            totalLeads={leads.length}
            filteredLeads={filteredLeads.length}
          />

          <LeadsTable leads={filteredLeads} onViewDetails={handleViewDetails} />
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
  );
}
