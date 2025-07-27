import { cn } from "@/lib/utils";

interface QuizFooterProps {
  className?: string;
}

export function QuizFooter({ className = "" }: QuizFooterProps) {
  return (
    <footer className={cn("py-6 px-4", className)}>
      <div className="max-w-md mx-auto text-center">
        <p className="text-[10px] text-muted-foreground">
          Powered by{" "}
          <span className="font-semibold text-foreground">FunnelQuiz</span>
        </p>
        <p className="text-[10px] text-muted-foreground">
          © {new Date().getFullYear()} Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
