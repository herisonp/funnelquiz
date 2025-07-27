"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  FileText,
  Users,
  Search,
} from "lucide-react";
import Link from "next/link";
import { CreateQuizModal } from "@/components/dashboard/CreateQuizModal";

// Dados mockados para os quizzes
const mockQuizzes = [
  {
    id: "quiz_1",
    title: "Quiz de Satisfação do Cliente",
    description: "Avalie a experiência do cliente com nossos produtos",
    isPublished: true,
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-20T14:45:00Z"),
  },
  {
    id: "quiz_2",
    title: "Pesquisa de Interesse em Produtos",
    description: "Descubra quais produtos interessam mais aos seus clientes",
    isPublished: false,
    createdAt: new Date("2024-01-10T09:15:00Z"),
    updatedAt: new Date("2024-01-12T16:20:00Z"),
  },
  {
    id: "quiz_3",
    title: "Questionário de Feedback",
    description: "Colete feedback sobre nossos serviços",
    isPublished: true,
    createdAt: new Date("2024-01-05T11:00:00Z"),
    updatedAt: new Date("2024-01-18T13:30:00Z"),
  },
  {
    id: "quiz_4",
    title: "Quiz de Onboarding",
    description: "Guie novos usuários através do processo de integração",
    isPublished: false,
    createdAt: new Date("2024-01-03T08:45:00Z"),
    updatedAt: new Date("2024-01-08T10:15:00Z"),
  },
  {
    id: "quiz_5",
    title: "Avaliação de Necessidades",
    description: "Identifique as necessidades específicas dos clientes",
    isPublished: true,
    createdAt: new Date("2023-12-28T14:20:00Z"),
    updatedAt: new Date("2024-01-15T09:45:00Z"),
  },
];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);

  const filteredQuizzes = mockQuizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && quiz.isPublished) ||
      (statusFilter === "draft" && !quiz.isPublished);

    return matchesSearch && matchesStatus;
  });

  const totalQuizzes = mockQuizzes.length;
  const publishedQuizzes = mockQuizzes.filter(
    (quiz) => quiz.isPublished
  ).length;
  const draftQuizzes = totalQuizzes - publishedQuizzes;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Gerencie seus quizzes e acompanhe o desempenho
          </p>
        </div>
        <Button onClick={() => setIsCreateQuizModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Quiz
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Total de Quizzes
              </p>
              <p className="text-xl font-bold">{totalQuizzes}</p>
            </div>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Publicados
              </p>
              <p className="text-xl font-bold">{publishedQuizzes}</p>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Rascunhos
              </p>
              <p className="text-xl font-bold">{draftQuizzes}</p>
            </div>
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Quizzes</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os seus quizzes criados
          </CardDescription>

          {/* Controles de Filtro */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título, descrição ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: "all" | "published" | "draft") =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="published">Publicados</SelectItem>
                <SelectItem value="draft">Rascunhos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Indicador de resultados */}
          {(searchTerm || statusFilter !== "all") && (
            <div className="mb-4 text-sm text-gray-600">
              Mostrando {filteredQuizzes.length} de {totalQuizzes} quizzes
              {searchTerm && <span> • Busca: &ldquo;{searchTerm}&rdquo;</span>}
              {statusFilter !== "all" && (
                <span>
                  {" "}
                  • Status:{" "}
                  {statusFilter === "published" ? "Publicados" : "Rascunhos"}
                </span>
              )}
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuizzes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-gray-500">
                        {searchTerm || statusFilter !== "all"
                          ? "Nenhum quiz encontrado com os filtros aplicados."
                          : "Nenhum quiz criado ainda."}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quiz.title}</div>
                          {quiz.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {quiz.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={quiz.isPublished ? "default" : "secondary"}
                        >
                          {quiz.isPublished ? "Publicado" : "Rascunho"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(quiz.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/quiz/preview/${quiz.id}`}
                              title="Visualizar quiz"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/dashboard/editar/${quiz.id}`}
                              title="Editar quiz"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Deletar quiz"
                            onClick={() => {
                              // TODO: Implementar função de deletar
                              console.log("Deletar quiz:", quiz.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Criação de Quiz */}
      <CreateQuizModal
        open={isCreateQuizModalOpen}
        onOpenChange={setIsCreateQuizModalOpen}
      />
    </div>
  );
}
