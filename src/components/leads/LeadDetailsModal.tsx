"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Calendar, CheckCircle2 } from "lucide-react";
import { Lead } from "./LeadsTable";

interface LeadDetailsModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadDetailsModal({
  lead,
  isOpen,
  onClose,
}: LeadDetailsModalProps) {
  if (!lead) return null;

  const progressPercentage = Math.round(
    (lead.lastStepCompleted / lead.totalSteps) * 100
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Lead
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Nome</span>
                  </div>
                  <p className="text-base">{lead.name}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-base">{lead.email}</p>
                </div>

                {lead.phone && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Telefone</span>
                    </div>
                    <p className="text-base">{lead.phone}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Data de Captura</span>
                  </div>
                  <p className="text-base">
                    {format(lead.createdAt, "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progresso */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progresso do Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Progresso</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{progressPercentage}%</span>
                    <span className="text-muted-foreground">
                      {lead.lastStepCompleted}/{lead.totalSteps} etapas
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Respostas do quiz */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Respostas do Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(lead.answers).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(lead.answers).map(
                    ([question, answer], index) => (
                      <div key={index}>
                        <div className="space-y-2">
                          <p className="font-medium text-sm">{question}</p>
                          <p className="text-muted-foreground">
                            {Array.isArray(answer) ? answer.join(", ") : answer}
                          </p>
                        </div>
                        {index < Object.entries(lead.answers).length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma resposta registrada ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
