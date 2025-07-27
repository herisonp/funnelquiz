import { getQuizById } from "@/lib/actions/quiz-actions";
import { QuizWithSteps } from "@/types";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { PublicQuizContainer } from "@/components/quiz/PublicQuizContainer";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // TODO: melhorar a estratégia de carregamento do quiz, pois no momento, sempre que der um erro, ele entenderá que o quiz não existe e retornará 404
  const getCachedQuiz = unstable_cache(async () => getQuizById(id), [id], {
    revalidate: 60 * 2,
    tags: [`quiz-${id}`],
  });

  const quiz = await getCachedQuiz()
    .then((data) => data?.data as QuizWithSteps)
    .catch((error) => {
      console.error("Error fetching cached quiz data:", error);
      return null;
    });

  if (!quiz) {
    return notFound();
  }

  return <PublicQuizContainer quiz={quiz} />;
}
