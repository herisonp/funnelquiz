"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
  lastStepCompleted: number;
  totalSteps: number;
  answers: Record<string, string | string[]>;
}

interface LeadsTableProps {
  leads: Lead[];
  onViewDetails: (lead: Lead) => void;
}

export function LeadsTable({ leads, onViewDetails }: LeadsTableProps) {
  const getProgressPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  const getProgressColor = () => {
    return "bg-primary";
  };

  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            Nenhum lead encontrado
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Os leads aparecerão aqui conforme as pessoas responderem o quiz.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Leads Capturados ({leads.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => {
                const progressPercentage = getProgressPercentage(
                  lead.lastStepCompleted,
                  lead.totalSteps
                );

                return (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="font-medium">{lead.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">
                            {lead.email}
                          </span>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{progressPercentage}%</span>
                          <span className="text-muted-foreground">
                            {lead.lastStepCompleted}/{lead.totalSteps}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {format(lead.createdAt, "dd/MM/yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(lead)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
