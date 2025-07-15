import { cn } from "@/lib/utils";

interface ContentSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function ContentSection({
  children,
  title,
  description,
  className,
}: ContentSectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
