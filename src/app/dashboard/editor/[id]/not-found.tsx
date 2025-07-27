import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Quiz não encontrado
        </h1>

        <p className="text-muted-foreground mb-8">
          O quiz que você está procurando não existe ou foi removido. Verifique
          o link ou volte para o dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>

          <Button asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Criar Novo Quiz
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
