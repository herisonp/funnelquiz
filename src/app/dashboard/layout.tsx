import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Funnel Quiz",
  description: "Gerencie seus quizzes e acompanhe o desempenho",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Funnel Quiz
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bem-vindo ao Dashboard
              </span>
            </div>
          </nav>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
