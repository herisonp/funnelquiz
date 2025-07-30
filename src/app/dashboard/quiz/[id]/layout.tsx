import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar Quiz | Funnel Quiz",
  description: "Edite seu quiz de conversão",
};

export default function EditarQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
