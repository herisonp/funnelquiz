import { getQuizById } from "@/lib/actions/quiz-actions";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { PublicQuizContainer } from "@/components/quiz/PublicQuizContainer";

type QuizPageProps = {
  params: Promise<{ id: string }>;
};

function generateCachedQuiz(id: string) {
  return unstable_cache(async () => getQuizById(id), [id], {
    revalidate: 60 * 2,
    tags: [`quiz-${id}`],
  });
}

export async function generateMetadata({ params }: QuizPageProps) {
  const { id } = await params;
  const getCachedQuiz = generateCachedQuiz(id);

  const { data: quiz } = await getCachedQuiz();

  if (!quiz) {
    return null;
  }

  return {
    title: quiz?.title,
    description: quiz?.description,
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { id } = await params;
  // TODO: melhorar a estratégia de carregamento do quiz, pois no momento, sempre que der um erro, ele entenderá que o quiz não existe e retornará 404
  const getCachedQuiz = generateCachedQuiz(id);

  const { data: quiz } = await getCachedQuiz();

  if (!quiz) {
    return notFound();
  }

  return <PublicQuizContainer quiz={quiz} />;
}
