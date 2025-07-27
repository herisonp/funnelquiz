"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { createQuiz } from "@/lib/actions/quiz-actions";
import { toast } from "sonner";

const createQuizSchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres")
    .trim(),
  description: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .optional(),
});

type CreateQuizFormData = z.infer<typeof createQuizSchema>;

interface CreateQuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateQuizModal({ open, onOpenChange }: CreateQuizModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CreateQuizFormData>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateQuizFormData) => {
    startTransition(async () => {
      try {
        // Criar FormData para enviar para a Server Action
        const formData = new FormData();
        formData.append("title", data.title);
        if (data.description) {
          formData.append("description", data.description);
        }

        // Executar Server Action
        const result = await createQuiz(formData);

        if (!result.success) {
          // Mostrar erros de validação
          if (result.fieldErrors) {
            if (result.fieldErrors.title) {
              form.setError("title", {
                message: result.fieldErrors.title[0],
              });
            }
            if (result.fieldErrors.description) {
              form.setError("description", {
                message: result.fieldErrors.description[0],
              });
            }
          } else {
            toast.error(result.error || "Erro ao criar quiz");
          }
          return;
        }

        // Sucesso - resetar formulário e fechar modal
        form.reset();
        onOpenChange(false);
        toast.success("Quiz criado com sucesso!");

        // Redirecionar para o editor
        if (result.data) {
          router.push(`/dashboard/editor/${result.data.id}`);
        }
      } catch (error) {
        console.error("Erro ao criar quiz:", error);
        toast.error("Erro inesperado ao criar quiz");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Criar Novo Quiz
          </DialogTitle>
          <DialogDescription>
            Crie um novo quiz fornecendo um título e uma descrição opcional.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Quiz *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Quiz de Satisfação do Cliente"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o propósito do seu quiz..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Quiz
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
