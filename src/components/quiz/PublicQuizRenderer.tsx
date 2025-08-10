import { QuizWithSteps } from "@/types/composed";
import { useQuizResponse } from "@/hooks/useQuizResponse";
import { QuizContainer } from "./QuizContainer";
import { QuizElementRenderer } from "./QuizElementRenderer";

interface PublicQuizRendererProps {
  quiz: QuizWithSteps;
}

export function PublicQuizRenderer({ quiz }: PublicQuizRendererProps) {
  const {
    navigationInfo,
    handleNavigation,
    goToPrevious,
    canProceedFromCurrentStep,
  } = useQuizResponse(quiz);

  const { currentStepIndex, isFirstStep, progress, currentStep } =
    navigationInfo;

  // Função para voltar no histórico do quiz (não do navegador)
  const handleQuizBack = () => {
    if (!isFirstStep) {
      goToPrevious();
    }
  };

  // Show error if no current step
  if (!currentStep) {
    return (
      <QuizContainer
        currentStep={1}
        totalSteps={quiz.steps.length}
        progress={0}
        onBack={handleQuizBack}
        title="Erro"
        colors={quiz.colors}
      >
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-destructive">
            Etapa não encontrada
          </h2>
          <p className="text-muted-foreground">
            Ocorreu um erro ao carregar a etapa atual do quiz.
          </p>
        </div>
      </QuizContainer>
    );
  }

  const canProceed = canProceedFromCurrentStep();

  return (
    <QuizContainer
      currentStep={currentStepIndex + 1}
      totalSteps={quiz.steps.length}
      progress={progress}
      onBack={!isFirstStep ? handleQuizBack : undefined}
      colors={quiz.colors}
    >
      <div className="space-y-4">
        {/* Render step elements */}
        {currentStep.elements
          .sort((a, b) => a.order - b.order)
          .map((element) => (
            <QuizElementRenderer
              key={element.id}
              element={element}
              onNavigate={handleNavigation}
              canProceed={canProceed}
              quizColors={quiz.colors}
              quizFonts={quiz.fonts}
            />
          ))}

        {/* Validation message */}
        {!canProceed && !isFirstStep && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Complete todos os campos obrigatórios para continuar
            </p>
          </div>
        )}
      </div>
    </QuizContainer>
  );
}
