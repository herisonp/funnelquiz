import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "bordered" | "elevated";
  className?: string;
}

const variantStyles = {
  default: "",
  bordered: "border-2",
  elevated: "shadow-lg",
};

export function SectionCard({
  children,
  title,
  description,
  header,
  footer,
  variant = "default",
  className,
}: SectionCardProps) {
  return (
    <Card className={cn(variantStyles[variant], className)}>
      {(title || description || header) && (
        <CardHeader>
          {header}
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent>{children}</CardContent>

      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
