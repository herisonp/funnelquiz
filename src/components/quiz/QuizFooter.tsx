interface QuizFooterProps {
  className?: string;
}

export function QuizFooter({ className = "" }: QuizFooterProps) {
  return (
    <footer
      className={`py-6 px-4 border-t bg-background/50 backdrop-blur-sm ${className}`}
    >
      <div className="max-w-md mx-auto text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Powered by{" "}
          <span className="font-semibold text-foreground">FunnelQuiz</span>
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
