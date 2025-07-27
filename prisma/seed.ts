import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes (opcional)
  await prisma.response.deleteMany();
  await prisma.element.deleteMany();
  await prisma.step.deleteMany();
  await prisma.quiz.deleteMany();

  // Criar quizzes de exemplo
  const quiz1 = await prisma.quiz.create({
    data: {
      title: "Quiz de Satisfação do Cliente",
      description: "Avalie a experiência do cliente com nossos produtos",
      isPublished: true,
      primaryColor: "#3b82f6",
      backgroundColor: "#ffffff",
      textColor: "#374151",
      titleColor: "#111827",
      steps: {
        create: [
          {
            title: "Bem-vindo",
            order: 0,
            elements: {
              create: [
                {
                  type: "TEXT",
                  content: {
                    text: "Bem-vindo ao nosso Quiz de Satisfação!",
                    size: "large",
                    alignment: "center",
                  },
                  order: 0,
                },
                {
                  type: "NAVIGATION_BUTTON",
                  content: {
                    text: "Começar",
                    style: "primary",
                    action: "next",
                  },
                  order: 1,
                },
              ],
            },
          },
          {
            title: "Pergunta 1",
            order: 1,
            elements: {
              create: [
                {
                  type: "TEXT",
                  content: {
                    text: "Como você avalia nosso atendimento?",
                    size: "medium",
                    alignment: "left",
                  },
                  order: 0,
                },
                {
                  type: "MULTIPLE_CHOICE",
                  content: {
                    question: "Como você avalia nosso atendimento?",
                    options: [
                      { id: "1", text: "Excelente" },
                      { id: "2", text: "Bom" },
                      { id: "3", text: "Regular" },
                      { id: "4", text: "Ruim" },
                    ],
                    allowMultiple: false,
                    required: true,
                  },
                  order: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const quiz2 = await prisma.quiz.create({
    data: {
      title: "Pesquisa de Interesse em Produtos",
      description: "Descubra quais produtos interessam mais aos seus clientes",
      isPublished: false,
      primaryColor: "#10b981",
      backgroundColor: "#f9fafb",
      textColor: "#374151",
      titleColor: "#111827",
      steps: {
        create: [
          {
            title: "Introdução",
            order: 0,
            elements: {
              create: [
                {
                  type: "TEXT",
                  content: {
                    text: "Ajude-nos a conhecer melhor seus interesses",
                    size: "large",
                    alignment: "center",
                  },
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seed concluído com sucesso!");
  console.log(`📊 Quiz 1 criado: ${quiz1.title} (ID: ${quiz1.id})`);
  console.log(`📊 Quiz 2 criado: ${quiz2.title} (ID: ${quiz2.id})`);
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
