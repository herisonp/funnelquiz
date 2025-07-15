import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8",
        className
      )}
    >
      {Icon && <Icon className="h-12 w-12 text-muted-foreground mb-4" />}

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

      {description && (
        <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      )}

      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
