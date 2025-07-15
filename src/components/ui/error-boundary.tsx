"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Algo deu errado
          </h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Recarregar página
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
