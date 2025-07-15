import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const sizeVariants = {
  small: "h-4 w-4",
  medium: "h-6 w-6",
  large: "h-8 w-8",
};

export function LoadingSpinner({
  size = "medium",
  className,
}: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn(
        "animate-spin text-muted-foreground",
        sizeVariants[size],
        className
      )}
    />
  );
}
