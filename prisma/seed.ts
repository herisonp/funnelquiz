import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seeds...");

  // Limpar dados existentes
  await prisma.answer.deleteMany();
  await prisma.response.deleteMany();
  await prisma.element.deleteMany();
  await prisma.step.deleteMany();
  await prisma.quiz.deleteMany();

  // Criar quiz de exemplo
  const quiz = await prisma.quiz.create({
    data: {
      title: "Quiz de Exemplo - Funil de Marketing",
      description: "Um quiz de exemplo para testar o sistema",
      steps: {
        create: [
          {
            title: "Boas-vindas",
            order: 1,
            elements: {
              create: [
                {
                  type: "TEXT",
                  order: 1,
                  content: {
                    text: "Bem-vindo ao nosso quiz!",
                    fontSize: "2xl",
                    fontWeight: "bold",
                    textAlign: "center",
                  },
                },
                {
                  type: "TEXT",
                  order: 2,
                  content: {
                    text: "Responda algumas perguntas para descobrirmos como podemos ajudá-lo.",
                    fontSize: "base",
                    textAlign: "center",
                  },
                },
                {
                  type: "NAVIGATION_BUTTON",
                  order: 3,
                  content: {
                    text: "Começar",
                    variant: "default",
                    size: "lg",
                    action: "next",
                  },
                },
              ],
            },
          },
          {
            title: "Primeira Pergunta",
            order: 2,
            elements: {
              create: [
                {
                  type: "MULTIPLE_CHOICE",
                  order: 1,
                  content: {
                    question: "Qual é o seu principal objetivo?",
                    required: true,
                    allowMultiple: false,
                    options: [
                      { id: "1", text: "Aumentar vendas", value: "sales" },
                      { id: "2", text: "Gerar leads", value: "leads" },
                      {
                        id: "3",
                        text: "Melhorar engajamento",
                        value: "engagement",
                      },
                      { id: "4", text: "Outro", value: "other" },
                    ],
                  },
                },
                {
                  type: "NAVIGATION_BUTTON",
                  order: 2,
                  content: {
                    text: "Continuar",
                    variant: "default",
                    action: "next",
                  },
                },
              ],
            },
          },
          {
            title: "Finalização",
            order: 3,
            elements: {
              create: [
                {
                  type: "TEXT",
                  order: 1,
                  content: {
                    text: "Obrigado por responder!",
                    fontSize: "xl",
                    fontWeight: "semibold",
                    textAlign: "center",
                  },
                },
                {
                  type: "NAVIGATION_BUTTON",
                  order: 2,
                  content: {
                    text: "Finalizar",
                    variant: "default",
                    action: "submit",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      steps: {
        include: {
          elements: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  console.log("✅ Quiz criado:", quiz.title);
  console.log(`📊 Steps criados: ${quiz.steps.length}`);

  const totalElements = quiz.steps.reduce(
    (acc, step) => acc + step.elements.length,
    0
  );
  console.log(`🧩 Elementos criados: ${totalElements}`);

  console.log("🎉 Seeds concluídos com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seeds:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
