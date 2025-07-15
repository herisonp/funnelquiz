import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor | Funnel Quiz",
  description: "Crie e edite seus quizzes de conversão",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
