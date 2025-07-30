"use client";

import EditorHeader from "@/components/editor/EditorHeader";

// Note: metadata needs to be moved to a server component if needed
// export const metadata: Metadata = {
//   title: "Editar Quiz | Funnel Quiz",
//   description: "Edite seu quiz de conversão",
// };

export default function EditarQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header compartilhado entre todas as sub-rotas */}
      <EditorHeader />

      {/* Conteúdo das páginas filhas */}
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
