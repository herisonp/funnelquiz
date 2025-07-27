"use client";

import { useState, useEffect } from "react";
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
  Copy,
} from "lucide-react";
import Link from "next/link";
import { CreateQuizModal } from "@/components/dashboard/CreateQuizModal";
import { getQuizzes, getQuizStats } from "@/lib/actions/quiz-queries";
import { deleteQuiz, duplicateQuiz } from "@/lib/actions/quiz-actions";
import { toast } from "sonner";

type Quiz = {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    responses: number;
    steps: number;
  };
};

type QuizStats = {
  totalQuizzes: number;
  publishedQuizzes: number;
  draftQuizzes: number;
  totalResponses: number;
};

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
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [stats, setStats] = useState<QuizStats>({
    totalQuizzes: 0,
    publishedQuizzes: 0,
    draftQuizzes: 0,
    totalResponses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do servidor
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [quizzesData, statsData] = await Promise.all([
          getQuizzes(),
          getQuizStats(),
        ]);

        setQuizzes(quizzesData);
        setStats(statsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados do dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (isCreateQuizModalOpen) return; // Não carregar se o modal estiver aberto
    loadData();
  }, [isCreateQuizModalOpen]);

  // Função para recarregar dados
  const reloadData = async () => {
    try {
      const [quizzesData, statsData] = await Promise.all([
        getQuizzes(),
        getQuizStats(),
      ]);

      setQuizzes(quizzesData);
      setStats(statsData);
    } catch (error) {
      console.error("Erro ao recarregar dados:", error);
      toast.error("Erro ao recarregar dados");
    }
  };

  const handleDeleteQuiz = async (quizId: string, quizTitle: string) => {
    if (!confirm(`Tem certeza que deseja deletar o quiz "${quizTitle}"?`)) {
      return;
    }

    try {
      const result = await deleteQuiz(quizId);

      if (result.success) {
        // Remover da lista local
        setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
        setStats((prev) => ({
          ...prev,
          totalQuizzes: prev.totalQuizzes - 1,
          publishedQuizzes:
            prev.publishedQuizzes -
            (quizzes.find((q) => q.id === quizId)?.isPublished ? 1 : 0),
          draftQuizzes:
            prev.draftQuizzes -
            (quizzes.find((q) => q.id === quizId)?.isPublished ? 0 : 1),
        }));
        toast.success("Quiz deletado com sucesso!");
      } else {
        toast.error(result.error || "Erro ao deletar quiz");
      }
    } catch (error) {
      console.error("Erro ao deletar quiz:", error);
      toast.error("Erro inesperado ao deletar quiz");
    }
  };

  const handleDuplicateQuiz = async (quizId: string) => {
    try {
      const result = await duplicateQuiz(quizId);

      if (result.success && result.data) {
        toast.success("Quiz duplicado com sucesso!");
        // Recarregar dados
        await reloadData();
      } else {
        toast.error(result.error || "Erro ao duplicar quiz");
      }
    } catch (error) {
      console.error("Erro ao duplicar quiz:", error);
      toast.error("Erro inesperado ao duplicar quiz");
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <p className="text-xl font-bold">{stats.totalQuizzes}</p>
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
              <p className="text-xl font-bold">{stats.publishedQuizzes}</p>
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
              <p className="text-xl font-bold">{stats.draftQuizzes}</p>
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
              Mostrando {filteredQuizzes.length} de {stats.totalQuizzes} quizzes
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
                  <TableHead>Respostas</TableHead>
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
                          {quiz._count.responses} respostas
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(quiz.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/${quiz.id}`} title="Visualizar quiz">
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/dashboard/editor/${quiz.id}`}
                              title="Editar quiz"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Duplicar quiz"
                            className="cursor-pointer"
                            onClick={() => handleDuplicateQuiz(quiz.id)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Deletar quiz"
                            className="cursor-pointer"
                            onClick={() =>
                              handleDeleteQuiz(quiz.id, quiz.title)
                            }
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
